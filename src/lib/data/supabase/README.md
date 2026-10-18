# Supabase Repository Implementation (Future Phase)

This directory is reserved for the production Supabase repository adapter.
When backend migration occurs:
1. Implement `supabaseRepository.ts` against the `Repository` interface defined in `src/lib/data/repository.ts`.
2. Flip `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`.
3. Points calculations, ledger transactions, and atomic approvals map to Supabase SQL views and SECURITY DEFINER PostgreSQL functions with zero changes required to UI components.
