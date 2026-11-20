import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';
import { AuditLog } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

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

    // Verify user has audit log viewing permission (is_founder or position_level <= 4)
    const userRes = await pg.query(`
      SELECT p.is_founder, op.level as position_level
      FROM public.profiles p
      LEFT JOIN public.organizational_positions op ON p.position_id = op.id
      WHERE p.id = $1;
    `, [user.id]);

    const caller = userRes.rows[0];
    if (!caller || (!caller.is_founder && (caller.position_level || 99) > 4)) {
      await pg.end();
      return NextResponse.json({ error: 'Forbidden: Security logs are restricted to executive leadership.' }, { status: 403 });
    }

    const logsRes = await pg.query(`
      SELECT * FROM public.audit_logs
      ORDER BY created_at DESC
      LIMIT 100;
    `);

    await pg.end();

    const auditLogs: AuditLog[] = logsRes.rows.map(row => ({
      id: row.id,
      userId: row.user_id || 'system',
      userName: row.user_name || 'System Action',
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      details: typeof row.details === 'string' ? JSON.parse(row.details) : (row.details || {}),
      ipAddress: row.ip_address || '127.0.0.1',
      createdAt: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 19) : '',
    }));

    return NextResponse.json({ auditLogs });
  } catch (err: any) {
    console.error('Audit logs retrieval error:', err);
    return NextResponse.json({ error: 'Failed to retrieve audit trail.' }, { status: 500 });
  }
}
