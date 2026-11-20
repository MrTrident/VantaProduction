import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

// Simple in-memory rate limiter for login brute-force prevention
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (now > entry.resetTime) {
    loginAttempts.delete(ip);
    return false;
  }
  return entry.count >= 5;
}

function recordAttempt(ip: string, success: boolean) {
  const now = Date.now();
  if (success) {
    loginAttempts.delete(ip);
    return;
  }
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 min lock
  } else {
    entry.count += 1;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many failed login attempts. Please try again in 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { emailOrUsername, password } = body;

    if (!emailOrUsername || !password) {
      return NextResponse.json({ error: 'Email/username and password are required.' }, { status: 400 });
    }

    const cleanInput = String(emailOrUsername).trim().toLowerCase();

    // Query user profile from PostgreSQL to resolve username to email and fetch position/founder status
    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    const profileRes = await pg.query(`
      SELECT p.id, p.username, p.display_name, p.email, p.avatar_url, p.bio, p.is_founder, p.status,
             op.title as position_title, op.level as position_level,
             d.name as department_name, d.slug as department_slug
      FROM public.profiles p
      LEFT JOIN public.organizational_positions op ON p.position_id = op.id
      LEFT JOIN public.departments d ON p.department_id = d.id
      WHERE LOWER(p.username) = $1 OR LOWER(p.email) = $1;
    `, [cleanInput]);

    let targetEmail = cleanInput;
    let userProfile = profileRes.rows[0];

    if (userProfile) {
      targetEmail = userProfile.email;
    }

    // Authenticate with Supabase Auth
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            });
          });
        },
      },
    });

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: String(password).trim(),
    });

    if (authError || !authData.user) {
      recordAttempt(ip, false);
      await pg.query(`
        INSERT INTO public.audit_logs (user_name, action, entity_type, details, ip_address)
        VALUES ($1, 'LOGIN_FAILED', 'Authentication', $2, $3);
      `, [cleanInput, JSON.stringify({ reason: authError?.message || 'Invalid credentials' }), ip]);
      await pg.end();

      return NextResponse.json({ error: 'Invalid credentials. Please verify your username and password.' }, { status: 401 });
    }

    recordAttempt(ip, true);

    // If profile wasn't found before, fetch by auth user id
    if (!userProfile) {
      const pRes = await pg.query(`
        SELECT p.id, p.username, p.display_name, p.email, p.avatar_url, p.bio, p.is_founder, p.status,
               op.title as position_title, op.level as position_level,
               d.name as department_name, d.slug as department_slug
        FROM public.profiles p
        LEFT JOIN public.organizational_positions op ON p.position_id = op.id
        LEFT JOIN public.departments d ON p.department_id = d.id
        WHERE p.id = $1;
      `, [authData.user.id]);
      userProfile = pRes.rows[0];
    }

    // Log successful login
    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, details, ip_address)
      VALUES ($1, $2, 'LOGIN_SUCCESS', 'Authentication', $3, $4);
    `, [
      authData.user.id,
      userProfile?.display_name || cleanInput,
      JSON.stringify({ email: targetEmail, isFounder: userProfile?.is_founder }),
      ip
    ]);
    await pg.end();

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: userProfile?.username || authData.user.user_metadata?.username,
        displayName: userProfile?.display_name || authData.user.user_metadata?.display_name || 'Member',
        avatarUrl: userProfile?.avatar_url || '/images/vanta-logo.jpg',
        bio: userProfile?.bio || '',
        isFounder: userProfile?.is_founder || false,
        positionTitle: userProfile?.position_title || 'Artist',
        departmentName: userProfile?.department_name || 'Production',
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Authentication service temporarily unavailable.' }, { status: 500 });
  }
}
