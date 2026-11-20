import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password, displayName } = body;

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: 'Valid token and password (at least 8 chars) are required.' }, { status: 400 });
    }

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    // Verify token
    const invRes = await pg.query(`
      SELECT * FROM public.invitations 
      WHERE token = $1 AND status = 'pending' AND expires_at > NOW();
    `, [token]);

    if (invRes.rows.length === 0) {
      await pg.end();
      return NextResponse.json({ error: 'Invalid or expired invitation token.' }, { status: 400 });
    }

    const inv = invRes.rows[0];

    // Create user in Supabase Auth
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: inv.email,
      password,
      options: {
        data: {
          username: inv.username,
          display_name: displayName || inv.username,
        }
      }
    });

    if (signUpError || !signUpData.user) {
      await pg.end();
      return NextResponse.json({ error: signUpError?.message || 'Failed to register account.' }, { status: 400 });
    }

    const newUserId = signUpData.user.id;

    // Confirm email in auth.users
    await pg.query(`
      UPDATE auth.users 
      SET email_confirmed_at = NOW(),
          encrypted_password = crypt($1, gen_salt('bf'))
      WHERE id = $2;
    `, [password, newUserId]);

    // Create profile
    await pg.query(`
      INSERT INTO public.profiles (
        id, username, display_name, email, avatar_url, bio, is_founder, status, position_id, department_id
      ) VALUES ($1, $2, $3, $4, '/images/vanta-logo.jpg', '', false, 'active', $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        display_name = EXCLUDED.display_name,
        position_id = EXCLUDED.position_id,
        department_id = EXCLUDED.department_id;
    `, [
      newUserId,
      inv.username,
      displayName || inv.username,
      inv.email,
      inv.position_id,
      inv.department_id
    ]);

    // Create artist profile
    await pg.query(`
      INSERT INTO public.artist_profiles (
        user_id, display_name, username, avatar_url, specialty, is_public, is_featured
      ) VALUES ($1, $2, $3, '/images/vanta-logo.jpg', 'Creative Artist', true, false)
      ON CONFLICT (user_id) DO NOTHING;
    `, [newUserId, displayName || inv.username, inv.username]);

    // Mark invitation as accepted
    await pg.query(`UPDATE public.invitations SET status = 'accepted' WHERE id = $1;`, [inv.id]);

    // Audit log
    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'INVITATION_ACCEPTED', 'Invitation', $3, $4);
    `, [newUserId, inv.username, inv.id, JSON.stringify({ email: inv.email })]);

    await pg.end();

    // Sign in the user immediately
    await supabase.auth.signInWithPassword({
      email: inv.email,
      password,
    });

    return NextResponse.json({ success: true, message: 'Account registered and activated successfully!' });
  } catch (err: any) {
    console.error('Accept invitation error:', err);
    return NextResponse.json({ error: 'Failed to accept invitation.' }, { status: 500 });
  }
}
