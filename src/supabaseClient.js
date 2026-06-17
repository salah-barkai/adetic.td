import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchActualites() {
  const { data, error } = await supabase
    .from("actualites")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function addContactMessage(message) {
  const { error } = await supabase.from("contacts").insert([{
    ...message,
    statut: "Nouveau",
    created_at: new Date().toISOString(),
  }]);
  return { error };
}

export async function submitDemandeDomaine(data) {
  const { error } = await supabase.from("demandes_domaine").insert([data]);
  return { error };
}

export async function submitDemandeEquipement(data) {
  const { error } = await supabase.from("demandes_equipement").insert([data]);
  return { error };
}

export async function submitDeclarationPanne(data) {
  const { error } = await supabase.from("declarations_panne").insert([data]);
  return { error };
}

export async function submitDemandeEmail(data) {
  const { error } = await supabase.from("demandes_email").insert([data]);
  return { error };
}

export async function submitDemandePlateforme(data) {
  const { error } = await supabase.from("demandes_plateforme").insert([data]);
  return { error };
}

export async function adminFetchDemandesEmail() {
  const { data, error } = await supabase
    .from("demandes_email")
    .select("*")
    .order("id", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchDemandesPlateforme() {
  const { data, error } = await supabase
    .from("demandes_plateforme")
    .select("*")
    .order("id", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchDemandsDomaine() {
  const { data, error } = await supabase
    .from("demandes_domaine")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchDemandesEquipement() {
  const { data, error } = await supabase
    .from("demandes_equipement")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchDeclarationsPanne() {
  const { data, error } = await supabase
    .from("declarations_panne")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminFetchContacts() {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("id", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminUpdateStatus(table, id, statut) {
  const { error } = await supabase
    .from(table)
    .update({ statut })
    .eq("id", id);
  if (error) throw error;
}

export async function adminAddActualite(article) {
  const { error } = await supabase.from("actualites").insert([article]);
  if (error) throw error;
}

export async function adminUpdateActualite(id, article) {
  const { data, error } = await supabase
    .from("actualites")
    .update(article)
    .eq("id", id)
    .select();
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("RLS bloque la modification — exécutez supabase_admin_policies.sql dans Supabase SQL Editor");
}

export async function adminDeleteActualite(id) {
  const { data, error } = await supabase
    .from("actualites")
    .delete()
    .eq("id", id)
    .select();
  if (error) throw error;
  if (!data || data.length === 0)
    throw new Error("RLS bloque la suppression — exécutez supabase_admin_policies.sql dans Supabase SQL Editor");
}

export async function uploadArticleImage(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const filename = `article-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("images")
    .upload(filename, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("images").getPublicUrl(filename);
  return data.publicUrl;
}
