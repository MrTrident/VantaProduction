import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Application } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yslpywcxgtnssaaynzug.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH';

const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory fallback
let serverApplicationsCache: Application[] = [];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase GET applications warning:', error.message);
      return NextResponse.json({ applications: serverApplicationsCache });
    }

    const mapped: Application[] = (data || []).map((row: any) => ({
      id: row.id,
      displayName: row.display_name || '',
      username: row.username || '',
      email: row.email || '',
      discordTag: row.discord_tag || '',
      services: row.services || [],
      experience: row.experience || '',
      portfolioLinks: row.portfolio_links || [],
      socialLinks: row.social_links || {},
      introduction: row.introduction || '',
      status: row.status || 'pending',
      reviewNotes: row.review_notes || '',
      reviewedBy: row.reviewed_by,
      createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));

    // Merge with any cache items not yet synced
    const combined = [...mapped];
    for (const cached of serverApplicationsCache) {
      if (!combined.some((a) => a.id === cached.id || (a.email === cached.email && a.createdAt === cached.createdAt))) {
        combined.push(cached);
      }
    }

    return NextResponse.json({ applications: combined });
  } catch (err: any) {
    console.error('Applications GET error:', err);
    return NextResponse.json({ applications: serverApplicationsCache });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newApp: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      displayName: body.displayName || '',
      username: body.username || '',
      email: body.email || '',
      discordTag: body.discordTag || '',
      services: body.services || [],
      experience: body.experience || '',
      portfolioLinks: body.portfolioLinks || [],
      socialLinks: body.socialLinks || {},
      introduction: body.introduction || '',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save to server fallback cache immediately
    serverApplicationsCache = [newApp, ...serverApplicationsCache];

    // Persist to Supabase Postgres
    const { data, error } = await supabase
      .from('applications')
      .insert({
        display_name: newApp.displayName,
        username: newApp.username,
        email: newApp.email,
        discord_tag: newApp.discordTag,
        services: newApp.services,
        experience: newApp.experience,
        portfolio_links: newApp.portfolioLinks,
        social_links: newApp.socialLinks,
        introduction: newApp.introduction,
        status: 'pending',
      });

    if (error) {
      console.warn('Supabase POST applications insert warning:', error.message);
    }

    return NextResponse.json({ success: true, application: newApp });
  } catch (err: any) {
    console.error('Applications POST error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to submit' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    // Update in-memory
    serverApplicationsCache = serverApplicationsCache.map((a) =>
      a.id === id ? { ...a, status, reviewNotes: notes } : a
    );

    // Update in Supabase
    const { error } = await supabase
      .from('applications')
      .update({
        status,
        review_notes: notes || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.warn('Supabase PATCH applications update warning:', error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Applications PATCH error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update' }, { status: 500 });
  }
}
