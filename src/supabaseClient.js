import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchActualites() {
  const { data, error } = await supabase
    .from("actualites")
    .select("id, category, date, title, excerpt, color, icon, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchActualites error:", error);
    return null;
  }

  return data?.map((item) => ({ ...item, image: item.image_url || item.image })) || [];
}

export async function addContactMessage(message) {
  const { error } = await supabase.from("contacts").insert([message]);
  if (error) {
    console.error("addContactMessage error:", error);
  }
  return { error };
}
