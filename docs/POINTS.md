# ZYVEN Points, Leaderboard & Tiers

## Authoritative Points Ledger
- Points are never stored statically on `profiles.points`.
- All student balances are dynamically computed from `point_transactions`:
  ```sql
  SELECT COALESCE(SUM(amount), 0) FROM public.point_transactions WHERE student_id = :id;
  ```
- Types of transactions:
  - `task_approved`: Issued via atomic RPC on submission approval.
  - `admin_adjustment`: Issued by an administrator with audit logging.
  - `reward_adjustment`: Deducted on perk redemption.

## Dynamic Leaderboard
- Students only (Ambassadors and Admins do not participate in rankings).
- If no points have been earned yet, displays: `"No ranked students yet."`
- Team leaderboards are permanently removed.

## Tiers & Rewards
- **Bronze Cadet**: 0 - 149 pts
- **Silver Pioneer**: 150 - 399 pts
- **Gold Vanguard**: 400 - 999 pts
- **Platinum Legend**: 1000+ pts
- Tiers calculate automatically from the sum of points.
