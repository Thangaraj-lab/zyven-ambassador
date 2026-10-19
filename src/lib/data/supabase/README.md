# Supabase Repository Adapter

The adapter contains the read paths that are safe to use from the production UI. Mutations that require role checks or atomic transactions use the server actions and PostgreSQL RPCs in this repository.

Before enabling production mode:
1. Apply every SQL migration in `supabase/migrations/`.
2. Put the real Supabase URL and anon/public key in `.env.local`.
3. Set `NEXT_PUBLIC_USE_MOCK=false` and test each role end to end.
