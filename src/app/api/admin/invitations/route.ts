import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

export async function GET() {
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

    const res = await pg.query(`
      SELECT inv.*, op.title as position_title, d.name as department_name, r.name as role_name
      FROM public.invitations inv
      LEFT JOIN public.organizational_positions op ON inv.position_id = op.id
      LEFT JOIN public.departments d ON inv.department_id = d.id
      LEFT JOIN public.roles r ON inv.role_id = r.id
      ORDER BY inv.created_at DESC;
    `);

    await pg.end();

    const invitations = res.rows.map(row => ({
      id: row.id,
      email: row.email,
      username: row.username,
      token: row.token,
      positionId: row.position_id,
      positionTitle: row.position_title,
      departmentId: row.department_id,
      departmentName: row.department_name,
      roleId: row.role_id,
      roleName: row.role_name,
      status: row.status,
      expiresAt: row.expires_at ? new Date(row.expires_at).toISOString().split('T')[0] : '',
      createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    }));

    return NextResponse.json({ invitations });
  } catch (err: any) {
    console.error('Invitations GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve invitations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { email, username, positionId, departmentId, roleId } = body;

    if (!email || !username) {
      return NextResponse.json({ error: 'Email and username are required.' }, { status: 400 });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    const res = await pg.query(`
      INSERT INTO public.invitations (
        id, email, username, token, position_id, department_id, role_id, status, invited_by, expires_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'pending', $7, $8
      ) RETURNING id, token;
    `, [
      String(email).trim().toLowerCase(),
      String(username).trim().toLowerCase(),
      token,
      positionId || null,
      departmentId || null,
      roleId || null,
      user.id,
      expiresAt.toISOString()
    ]);

    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'INVITATION_CREATED', 'Invitation', $3, $4);
    `, [user.id, user.email, res.rows[0].id, JSON.stringify({ email, username, expiresAt })]);

    await pg.end();

    return NextResponse.json({
      success: true,
      invitation: {
        id: res.rows[0].id,
        token: res.rows[0].token,
        inviteUrl: `/invite/accept?token=${res.rows[0].token}`,
      }
    });
  } catch (err: any) {
    console.error('Invitations POST error:', err);
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
  }
}
