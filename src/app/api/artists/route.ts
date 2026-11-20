import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  const pg = new Client({
    connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();

  try {
    let query = `
      SELECT ap.*, 
             p.display_name, 
             p.username, 
             p.avatar_url, 
             p.bio as profile_bio, 
             p.is_founder,
             op.title as position_title,
             d.name as department_name
      FROM public.artist_profiles ap
      JOIN public.profiles p ON ap.user_id = p.id
      LEFT JOIN public.organizational_positions op ON p.position_id = op.id
      LEFT JOIN public.departments d ON p.department_id = d.id
    `;
    const params: any[] = [];

    if (username) {
      params.push(username.toLowerCase());
      query += ` WHERE LOWER(p.username) = $1 LIMIT 1;`;
    } else {
      query += ` WHERE ap.is_public = true ORDER BY ap.display_order ASC;`;
    }

    const res = await pg.query(query, params);
    await pg.end();

    const artists = res.rows.map(row => ({
      userId: row.user_id,
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url || '/images/vanta-logo.jpg',
      bio: row.bio || row.profile_bio || '',
      specialty: row.specialty,
      yearsExperience: row.years_experience,
      bannerUrl: row.banner_url || '/images/vanta-welcome-banner.jpg',
      themeMode: row.theme_mode || 'dark',
      layoutMode: row.layout_mode || 'grid',
      isFeatured: row.is_featured || false,
      isPublic: row.is_public || false,
      availabilityStatus: row.availability_status || 'available',
      socialLinks: row.social_links || {},
      displayOrder: row.display_order || 0,
      positionTitle: row.position_title || 'Artist',
      departmentName: row.department_name || 'Production',
      isFounder: row.is_founder || false,
    }));

    if (username) {
      if (artists.length === 0) {
        return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
      }
      return NextResponse.json({ artist: artists[0] });
    }

    return NextResponse.json({ artists });
  } catch (err: any) {
    await pg.end();
    console.error('Artists GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve artists' }, { status: 500 });
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

    const body = await req.json();
    const { userId, specialty, yearsExperience, bannerUrl, bio, avatarUrl, displayName, availabilityStatus, socialLinks } = body;

    const targetUserId = userId || user.id;

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    // Verify requesting user is either target or Founder
    const callerRes = await pg.query(`SELECT is_founder FROM public.profiles WHERE id = $1;`, [user.id]);
    const isFounder = callerRes.rows[0]?.is_founder === true;

    if (targetUserId !== user.id && !isFounder) {
      await pg.end();
      return NextResponse.json({ error: 'Forbidden: You cannot modify another artist profile.' }, { status: 403 });
    }

    // Update public.profiles if avatar/displayName/bio changed
    if (avatarUrl || displayName || bio) {
      await pg.query(`
        UPDATE public.profiles
        SET avatar_url = COALESCE($1, avatar_url),
            display_name = COALESCE($2, display_name),
            bio = COALESCE($3, bio),
            updated_at = NOW()
        WHERE id = $4;
      `, [avatarUrl || null, displayName || null, bio || null, targetUserId]);
    }

    // Update public.artist_profiles
    await pg.query(`
      UPDATE public.artist_profiles
      SET specialty = COALESCE($1, specialty),
          years_experience = COALESCE($2, years_experience),
          banner_url = COALESCE($3, banner_url),
          availability_status = COALESCE($4, availability_status),
          social_links = COALESCE($5, social_links),
          updated_at = NOW()
      WHERE user_id = $6;
    `, [
      specialty || null,
      yearsExperience !== undefined ? yearsExperience : null,
      bannerUrl || null,
      availabilityStatus || null,
      socialLinks ? JSON.stringify(socialLinks) : null,
      targetUserId
    ]);

    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'ARTIST_PROFILE_UPDATED', 'ArtistProfile', $3, $4);
    `, [
      user.id,
      user.email,
      targetUserId,
      JSON.stringify({ specialty, yearsExperience, availabilityStatus })
    ]);

    await pg.end();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Artist PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update artist profile' }, { status: 500 });
  }
}
