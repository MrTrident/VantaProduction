import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';
import { Application } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

async function verifyStaff(cookieStore: any): Promise<boolean> {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const pg = new Client({
    connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();

  const res = await pg.query(`
    SELECT p.is_founder, op.level as position_level
    FROM public.profiles p
    LEFT JOIN public.organizational_positions op ON p.position_id = op.id
    WHERE p.id = $1;
  `, [user.id]);
  await pg.end();

  const profile = res.rows[0];
  if (!profile) return false;

  // Level <= 8 corresponds to management/staff who can review applications
  return profile.is_founder === true || (profile.position_level || 99) <= 8;
}

export async function GET() {
  const cookieStore = await cookies();
  const isAuthorized = await verifyStaff(cookieStore);

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden: Recruitment applications are confidential.' }, { status: 403 });
  }

  const pg = new Client({
    connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();

  try {
    const res = await pg.query(`
      SELECT * FROM public.applications 
      ORDER BY created_at DESC;
    `);
    await pg.end();

    const applications: Application[] = res.rows.map(row => ({
      id: row.id,
      displayName: row.display_name,
      username: row.username,
      email: row.email,
      discordTag: row.discord_tag,
      services: row.services || [],
      experience: row.experience,
      portfolioLinks: row.portfolio_links || [],
      socialLinks: row.social_links || {},
      introduction: row.introduction,
      status: row.status,
      reviewNotes: row.review_notes || '',
      reviewedBy: row.reviewed_by,
      createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    }));

    return NextResponse.json({ applications });
  } catch (err: any) {
    await pg.end();
    console.error('Applications GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { displayName, username, email, discordTag, services, experience, portfolioLinks, socialLinks, introduction } = body;

    // Strict Input Validation
    if (!displayName || !username || !email || !discordTag) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    const insertRes = await pg.query(`
      INSERT INTO public.applications (
        id, display_name, username, email, discord_tag, services, experience, portfolio_links, social_links, introduction, status
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending'
      ) RETURNING id;
    `, [
      String(displayName).trim().slice(0, 80),
      String(username).trim().toLowerCase().slice(0, 40),
      String(email).trim().toLowerCase().slice(0, 100),
      String(discordTag).trim().slice(0, 50),
      Array.isArray(services) ? services : [],
      String(experience || '').slice(0, 500),
      Array.isArray(portfolioLinks) ? portfolioLinks : [],
      socialLinks && typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : '{}',
      String(introduction || '').slice(0, 2000),
    ]);

    const newAppId = insertRes.rows[0].id;

    await pg.query(`
      INSERT INTO public.audit_logs (user_name, action, entity_type, entity_id, details)
      VALUES ($1, 'APPLICATION_SUBMITTED', 'Recruitment', $2, $3);
    `, [
      displayName,
      newAppId,
      JSON.stringify({ username, email, discordTag })
    ]);

    await pg.end();

    return NextResponse.json({ success: true, id: newAppId });
  } catch (err: any) {
    console.error('Applications POST error:', err);
    return NextResponse.json({ error: 'Submission failed.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const isAuthorized = await verifyStaff(cookieStore);

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Forbidden: Insufficient moderation authority.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Application ID and status are required.' }, { status: 400 });
    }

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    await pg.query(`
      UPDATE public.applications
      SET status = $1,
          review_notes = COALESCE($2, review_notes),
          updated_at = NOW()
      WHERE id = $3;
    `, [status, notes || null, id]);

    await pg.end();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Applications PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update application.' }, { status: 500 });
  }
}
