import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Client } from 'pg';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

async function getAuthUser(cookieStore: any) {
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
  if (!user) return null;

  const pg = new Client({
    connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();

  const res = await pg.query(`
    SELECT p.id, p.username, p.display_name, p.is_founder, op.level as position_level
    FROM public.profiles p
    LEFT JOIN public.organizational_positions op ON p.position_id = op.id
    WHERE p.id = $1;
  `, [user.id]);
  await pg.end();

  return {
    ...user,
    profile: res.rows[0] || null,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope') || 'public';
  const category = searchParams.get('category');
  const artistUsername = searchParams.get('artist');

  const pg = new Client({
    connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await pg.connect();

  try {
    const cookieStore = await cookies();
    const authUser = await getAuthUser(cookieStore);

    let query = `
      SELECT pi.*, 
             p.display_name as artist_display_name, 
             p.username as artist_username, 
             p.avatar_url as artist_avatar_url
      FROM public.portfolio_items pi
      JOIN public.profiles p ON pi.artist_id = p.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (scope === 'public') {
      conditions.push(`pi.status = 'approved' AND pi.is_public = true`);
    } else if (scope === 'mine') {
      if (!authUser) {
        await pg.end();
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      params.push(authUser.id);
      conditions.push(`pi.artist_id = $${params.length}`);
    } else if (scope === 'moderation') {
      if (!authUser || (!authUser.profile?.is_founder && (authUser.profile?.position_level || 99) > 8)) {
        await pg.end();
        return NextResponse.json({ error: 'Forbidden: Insufficient moderation authority' }, { status: 403 });
      }
      // Return all moderation queue items
    }

    if (category && category !== 'all' && category !== 'All') {
      params.push(category);
      conditions.push(`LOWER(pi.category) = LOWER($${params.length})`);
    }

    if (artistUsername) {
      params.push(artistUsername.toLowerCase());
      conditions.push(`LOWER(p.username) = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY pi.created_at DESC;`;

    const result = await pg.query(query, params);
    await pg.end();

    const items = result.rows.map(row => ({
      id: row.id,
      artistId: row.artist_id,
      artistUsername: row.artist_username,
      artistDisplayName: row.artist_display_name,
      artistAvatarUrl: row.artist_avatar_url,
      title: row.title,
      description: row.description || '',
      category: row.category,
      mediaUrl: row.media_url,
      thumbnailUrl: row.thumbnail_url || row.media_url,
      mediaType: row.media_type || 'image',
      externalUrl: row.external_url || '',
      status: row.status,
      moderationNotes: row.moderation_notes || '',
      isFeatured: row.is_featured || false,
      isFloatingHero: row.is_floating_hero || false,
      isPublic: row.is_public || false,
      views: row.views || 0,
      likes: row.likes || 0,
      createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    }));

    return NextResponse.json({ items });
  } catch (err: any) {
    await pg.end();
    console.error('Portfolio GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve portfolio' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authUser = await getAuthUser(cookieStore);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, mediaUrl, thumbnailUrl, description, externalUrl } = body;

    if (!title || !category || !mediaUrl) {
      return NextResponse.json({ error: 'Title, category, and media URL are required.' }, { status: 400 });
    }

    const isFounder = authUser.profile?.is_founder === true;
    // CRITICAL: Ordinary artists cannot approve their own submissions; only Founder can auto-approve
    const status = isFounder ? 'approved' : 'submitted';
    const isPublic = isFounder;

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    const insertRes = await pg.query(`
      INSERT INTO public.portfolio_items (
        id, artist_id, title, category, media_url, thumbnail_url, description, external_url, status, is_public, is_featured, is_floating_hero
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, false, false
      ) RETURNING id, created_at;
    `, [
      authUser.id,
      title,
      category,
      mediaUrl,
      thumbnailUrl || mediaUrl,
      description || '',
      externalUrl || '',
      status,
      isPublic,
    ]);

    const newItemId = insertRes.rows[0].id;

    // Record audit log
    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'PORTFOLIO_ITEM_SUBMITTED', 'PortfolioItem', $3, $4);
    `, [
      authUser.id,
      authUser.profile?.display_name || authUser.email,
      newItemId,
      JSON.stringify({ title, category, status, isFounder })
    ]);

    await pg.end();

    return NextResponse.json({
      success: true,
      id: newItemId,
      status,
      message: isFounder ? 'Item published directly to portfolio.' : 'Item submitted for administrative review.',
    });
  } catch (err: any) {
    console.error('Portfolio POST error:', err);
    return NextResponse.json({ error: 'Submission failed.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authUser = await getAuthUser(cookieStore);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, moderationNotes, isFeatured, isFloatingHero } = body;

    if (!id) {
      return NextResponse.json({ error: 'Portfolio item ID is required.' }, { status: 400 });
    }

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    // Verify existing item and author
    const itemRes = await pg.query(`SELECT * FROM public.portfolio_items WHERE id = $1;`, [id]);
    if (itemRes.rows.length === 0) {
      await pg.end();
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }

    const existingItem = itemRes.rows[0];
    const isFounder = authUser.profile?.is_founder === true;
    const isManager = (authUser.profile?.position_level || 99) <= 8;

    // RULE: Artists cannot approve their own submissions
    if (status && status !== existingItem.status) {
      if (existingItem.artist_id === authUser.id && !isFounder) {
        await pg.end();
        return NextResponse.json(
          { error: 'CRITICAL SECURITY: Artists are strictly prohibited from approving their own portfolio submissions.' },
          { status: 403 }
        );
      }
      if (!isFounder && !isManager) {
        await pg.end();
        return NextResponse.json({ error: 'Forbidden: Insufficient moderation authority.' }, { status: 403 });
      }
    }

    const newStatus = status || existingItem.status;
    const isPublic = newStatus === 'approved';

    await pg.query(`
      UPDATE public.portfolio_items
      SET status = $1,
          is_public = $2,
          moderation_notes = COALESCE($3, moderation_notes),
          is_featured = COALESCE($4, is_featured),
          is_floating_hero = COALESCE($5, is_floating_hero),
          updated_at = NOW()
      WHERE id = $6;
    `, [
      newStatus,
      isPublic,
      moderationNotes !== undefined ? moderationNotes : null,
      isFeatured !== undefined ? isFeatured : null,
      isFloatingHero !== undefined ? isFloatingHero : null,
      id
    ]);

    // Record audit log
    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'PORTFOLIO_ITEM_MODERATED', 'PortfolioItem', $3, $4);
    `, [
      authUser.id,
      authUser.profile?.display_name || authUser.email,
      id,
      JSON.stringify({
        previousStatus: existingItem.status,
        newStatus,
        moderationNotes,
        isFeatured,
        isFloatingHero
      })
    ]);

    await pg.end();

    return NextResponse.json({ success: true, status: newStatus });
  } catch (err: any) {
    console.error('Portfolio PATCH error:', err);
    return NextResponse.json({ error: 'Moderation update failed.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authUser = await getAuthUser(cookieStore);

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required.' }, { status: 400 });
    }

    const pg = new Client({
      connectionString: 'postgres://postgres:vantaneverdies@db.yslpywcxgtnssaaynzug.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await pg.connect();

    const itemRes = await pg.query(`SELECT * FROM public.portfolio_items WHERE id = $1;`, [id]);
    if (itemRes.rows.length === 0) {
      await pg.end();
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }

    const existingItem = itemRes.rows[0];
    const isOwner = existingItem.artist_id === authUser.id;
    const isFounder = authUser.profile?.is_founder === true;
    const isManager = (authUser.profile?.position_level || 99) <= 5;

    if (!isOwner && !isFounder && !isManager) {
      await pg.end();
      return NextResponse.json({ error: 'Forbidden: You do not own this portfolio item.' }, { status: 403 });
    }

    await pg.query(`DELETE FROM public.portfolio_items WHERE id = $1;`, [id]);

    await pg.query(`
      INSERT INTO public.audit_logs (user_id, user_name, action, entity_type, entity_id, details)
      VALUES ($1, $2, 'PORTFOLIO_ITEM_DELETED', 'PortfolioItem', $3, $4);
    `, [
      authUser.id,
      authUser.profile?.display_name || authUser.email,
      id,
      JSON.stringify({ title: existingItem.title, deletedBy: authUser.id })
    ]);

    await pg.end();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Portfolio DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete portfolio item.' }, { status: 500 });
  }
}
