import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

export async function GET() {
  try {
    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    const res = await pg.query(`
      SELECT p.id, p.username, p.display_name, p.email, p.avatar_url, p.bio, p.is_founder, p.status,
             p.position_id, p.department_id,
             op.title as position_title, op.level as position_level,
             d.name as department_name, d.slug as department_slug
      FROM public.profiles p
      LEFT JOIN public.organizational_positions op ON p.position_id = op.id
      LEFT JOIN public.departments d ON p.department_id = d.id
      ORDER BY op.level ASC NULLS LAST;
    `);

    await pg.end();

    const staff = res.rows.map(row => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      email: row.email,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      isFounder: row.is_founder,
      status: row.status,
      positionId: row.position_id,
      departmentId: row.department_id,
      positionTitle: row.position_title || 'Unassigned',
      positionLevel: row.position_level || 99,
      departmentName: row.department_name || 'Unassigned',
      departmentSlug: row.department_slug,
    }));

    return NextResponse.json({ staff });
  } catch (err: any) {
    console.error('Staff GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve staff roster' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    // Verify caller is Founder or Executive
    const callerRes = await pg.query(`
      SELECT p.is_founder, op.level as position_level
      FROM public.profiles p
      LEFT JOIN public.organizational_positions op ON p.position_id = op.id
      WHERE p.id = $1;
    `, [user.id]);

    const caller = callerRes.rows[0];
    if (!caller || (!caller.is_founder && (caller.position_level || 99) > 3)) {
      await pg.end();
      return NextResponse.json({ error: 'Forbidden: Insufficient executive authority.' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, newPositionId, newDepartmentId, notes } = body;

    if (!userId || !action) {
      await pg.end();
      return NextResponse.json({ error: 'User ID and action are required.' }, { status: 400 });
    }

    // Protect Founder account against demotion or modification
    const targetRes = await pg.query(`SELECT is_founder, username FROM public.profiles WHERE id = $1;`, [userId]);
    if (targetRes.rows[0]?.is_founder && !caller.is_founder) {
      await pg.end();
      return NextResponse.json({ error: 'CRITICAL SECURITY: The Founder cannot be demoted or transferred.' }, { status: 403 });
    }

    if (action === 'promote') {
      if (!newPositionId) {
        await pg.end();
        return NextResponse.json({ error: 'New position ID is required.' }, { status: 400 });
      }
      await pg.query(`UPDATE public.profiles SET position_id = $1, updated_at = NOW() WHERE id = $2;`, [newPositionId, userId]);
      await pg.query(`
        INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
        VALUES ($1, $2, 'STAFF_PROMOTED', 'Staff', $3, $4);
      `, [user.id, user.email, userId, JSON.stringify({ newPositionId, notes })]);
    } else if (action === 'transfer') {
      if (!newDepartmentId) {
        await pg.end();
        return NextResponse.json({ error: 'New department ID is required.' }, { status: 400 });
      }
      await pg.query(`UPDATE public.profiles SET department_id = $1, updated_at = NOW() WHERE id = $2;`, [newDepartmentId, userId]);
      await pg.query(`
        INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
        VALUES ($1, $2, 'STAFF_TRANSFERRED', 'Staff', $3, $4);
      `, [user.id, user.email, userId, JSON.stringify({ newDepartmentId, notes })]);
    }

    await pg.end();

    return NextResponse.json({ success: true, message: `Staff member ${action}d successfully.` });
  } catch (err: any) {
    console.error('Staff PATCH error:', err);
    return NextResponse.json({ error: 'Staff operation failed.' }, { status: 500 });
  }
}
