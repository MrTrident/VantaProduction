import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ user: null }, { status: 401 });
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

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

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
      WHERE p.id = $1;
    `, [user.id]);

    await pg.end();

    const profile = profileRes.rows[0];

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: profile?.username || user.user_metadata?.username || 'user',
        displayName: profile?.display_name || user.user_metadata?.display_name || 'Member',
        avatarUrl: profile?.avatar_url || '/images/vanta-logo.jpg',
        bio: profile?.bio || '',
        isFounder: profile?.is_founder || false,
        positionTitle: profile?.position_title || 'Artist',
        positionLevel: profile?.position_level || 14,
        departmentName: profile?.department_name || 'Production',
        departmentSlug: profile?.department_slug || 'production',
      },
    });
  } catch (err: any) {
    console.error('Session retrieval error:', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
