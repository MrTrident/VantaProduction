import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yslpywcxgtnssaaynzug.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_urgoh6Q3NyqPSh5Lrtzr_w_EPEcB3HH";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
