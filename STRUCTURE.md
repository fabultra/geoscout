# GEO Scout - Structure des fichiers

## Pages requises

### Publiques
- src/app/page.tsx ✅
- src/app/terms/page.tsx ✅
- src/app/privacy/page.tsx ✅

### Auth
- src/app/login/page.tsx ✅
- src/app/register/page.tsx ✅
- src/app/register/success/page.tsx ✅
- src/app/forgot-password/page.tsx ✅
- src/app/reset-password/page.tsx ✅
- src/app/auth/callback/route.ts ✅

### Dashboard (protégé)
- src/app/dashboard/layout.tsx
- src/app/dashboard/page.tsx
- src/app/dashboard/analyses/page.tsx
- src/app/dashboard/analyses/new/page.tsx
- src/app/dashboard/analyses/[id]/page.tsx
- src/app/dashboard/analyses/[id]/progress/page.tsx
- src/app/dashboard/settings/page.tsx

## Composants

### Layout
- src/components/layout/header.tsx
- src/components/layout/footer.tsx
- src/components/layout/sidebar.tsx ✅

### Features
- src/components/features/score-circle.tsx ✅
- src/components/features/analysis-card.tsx ✅

## Lib
- src/lib/utils.ts ✅
- src/lib/constants.ts ✅
- src/lib/supabase/client.ts ✅
- src/lib/supabase/server.ts ✅

## Autres
- src/middleware.ts ✅
- src/types/index.ts ✅
- src/hooks/use-analysis.ts ✅

---

## RÈGLES POUR CURSOR

1. Ne JAMAIS supprimer un fichier existant sans demande explicite
2. Ne JAMAIS modifier un fichier non mentionné dans le prompt
3. Toujours vérifier que npm run build passe AVANT de dire "terminé"
4. Créer les dossiers parents si nécessaires
