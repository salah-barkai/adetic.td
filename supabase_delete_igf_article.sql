-- Supprimer l'article IGF 2025 "Une délégation tchadienne unie autour des priorités nationales"
-- À exécuter dans Supabase Dashboard → SQL Editor

DELETE FROM actualites
WHERE title ILIKE '%délégation tchadienne unie autour des priorités nationales%'
   OR (title ILIKE '%IGF 2025%' AND date ILIKE '%Norvège%');
