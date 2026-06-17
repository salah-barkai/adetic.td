-- ============================================================
-- ADETIC — Politiques RLS pour le dashboard admin
-- À exécuter dans Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Colonne "statut" sur les tables e-services et contacts
-- (à ignorer si elle existe déjà)

ALTER TABLE demandes_domaine     ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'En attente';
ALTER TABLE demandes_equipement  ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'En attente';
ALTER TABLE declarations_panne   ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'Ouvert';
ALTER TABLE contacts             ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'Nouveau';

-- ============================================================
-- 2. Politiques SELECT (lecture) — anon key lit tout
--    (nécessaire pour l'admin frontend qui utilise l'anon key)
-- ============================================================

-- demandes_domaine
DROP POLICY IF EXISTS "admin_select_demandes_domaine" ON demandes_domaine;
CREATE POLICY "admin_select_demandes_domaine"
  ON demandes_domaine FOR SELECT
  USING (true);

-- demandes_equipement
DROP POLICY IF EXISTS "admin_select_demandes_equipement" ON demandes_equipement;
CREATE POLICY "admin_select_demandes_equipement"
  ON demandes_equipement FOR SELECT
  USING (true);

-- declarations_panne
DROP POLICY IF EXISTS "admin_select_declarations_panne" ON declarations_panne;
CREATE POLICY "admin_select_declarations_panne"
  ON declarations_panne FOR SELECT
  USING (true);

-- contacts
DROP POLICY IF EXISTS "admin_select_contacts" ON contacts;
CREATE POLICY "admin_select_contacts"
  ON contacts FOR SELECT
  USING (true);

-- actualites (lecture déjà existante, mais on s'assure)
DROP POLICY IF EXISTS "admin_select_actualites" ON actualites;
CREATE POLICY "admin_select_actualites"
  ON actualites FOR SELECT
  USING (true);

-- ============================================================
-- 3. Politiques UPDATE (mise à jour du statut)
-- ============================================================

-- demandes_domaine
DROP POLICY IF EXISTS "admin_update_demandes_domaine" ON demandes_domaine;
CREATE POLICY "admin_update_demandes_domaine"
  ON demandes_domaine FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- demandes_equipement
DROP POLICY IF EXISTS "admin_update_demandes_equipement" ON demandes_equipement;
CREATE POLICY "admin_update_demandes_equipement"
  ON demandes_equipement FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- declarations_panne
DROP POLICY IF EXISTS "admin_update_declarations_panne" ON declarations_panne;
CREATE POLICY "admin_update_declarations_panne"
  ON declarations_panne FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- contacts
DROP POLICY IF EXISTS "admin_update_contacts" ON contacts;
CREATE POLICY "admin_update_contacts"
  ON contacts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. Politiques INSERT / UPDATE / DELETE pour les articles
-- ============================================================

DROP POLICY IF EXISTS "admin_insert_actualites" ON actualites;
CREATE POLICY "admin_insert_actualites"
  ON actualites FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_actualites" ON actualites;
CREATE POLICY "admin_update_actualites"
  ON actualites FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_actualites" ON actualites;
CREATE POLICY "admin_delete_actualites"
  ON actualites FOR DELETE
  USING (true);

-- ============================================================
-- Vérification : s'assurer que RLS est bien activé
-- ============================================================

ALTER TABLE demandes_domaine    ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_equipement ENABLE ROW LEVEL SECURITY;
ALTER TABLE declarations_panne  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE actualites          ENABLE ROW LEVEL SECURITY;
