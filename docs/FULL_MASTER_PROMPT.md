<USER_REQUEST>
You are the lead product architect, senior frontend engineer, interaction designer,
motion designer and design-systems engineer responsible for building the production
frontend of the Zyven Student Ambassador Portal.

Treat this as a real commercial product, not a college project, dashboard template,
SaaS admin template, or UI demo.

Read these files FIRST and treat them as the source of truth:

1. docs/BRIEF.md
2. CLAUDE.md

Do not start implementation until you understand:
- roles
- permissions
- database model
- authentication
- task lifecycle
- submission lifecycle
- team model
- ambassador model
- admin model
- RLS
- real-time behavior
- security rules
- copy rules
- existing design tokens
- existing routes

============================================================
01. PRODUCT PRINCIPLE
============================================================

Build Zyven as a premium student ambassador platform.

The experience should feel closer to a premium modern product such as:
- Apple-level simplicity
- Linear-level interaction quality
- modern premium event platforms
- high-end editorial websites
- cinematic product experiences

But DO NOT copy any existing product.

The interface must have its own visual identity.

Core philosophy:

DISCOVER → ACT → SUBMIT → GET APPROVED → EARN → RANK → PROGRESS

The product should feel:
- premium
- youthful
- elegant
- intelligent
- fast
- cinematic
- trustworthy
- easy to understand
- visually memorable

It must NOT feel:
- like an admin dashboard
- like a college portal
- like a generic Tailwind template
- like a crypto website
- like an AI SaaS landing page
- overloaded with gradients
- overloaded with glassmorphism
- overloaded with 3D
- filled with fake statistics
- filled with unnecessary AI explanations

============================================================
02. CRITICAL ROLE RULE
============================================================

There are THREE database roles:

student
ambassador
admin

But the PUBLIC LOGIN UI has ONLY:

Student / Ambassador

Do NOT display:
- Admin Login
- Admin Portal
- Administrator
- Admin button
- admin card
- admin tab

The common login is:

/login

After successful authentication:

1. Read authenticated user.
2. Read authoritative role from profiles table.
3. If role = student:
   redirect /dashboard

4. If role = ambassador:
   redirect /ambassador

5. If role = admin:
   redirect /admin

Never hardcode an admin email.
Never determine role from email.
Never determine role from frontend state.
Never trust user metadata.

Admin access remains private because the UI does not advertise it,
while authorization is enforced by the backend and RLS.

============================================================
03. FRONTEND TECHNOLOGY
============================================================

Use:

Next.js App Router
TypeScript strict
Tailwind CSS
shadcn/ui
Radix UI
Motion for React
Supabase
TanStack Query
TanStack Table
React Hook Form
Zod
next-intl
next-themes
Sonner
Lucide React
browser-image-compression
Cloudflare Turnstile
Sentry
PostHog

Use Three.js / React Three Fiber ONLY where it materially improves the
experience.

Required 3D areas:
- premium landing visual accents
- reward/level-up moments where appropriate
- optional immersive task/event visual moments
- premium ambassador experience elements

Do NOT build a continuously running 3D scene everywhere.

Performance is more important than visual complexity.

============================================================
04. MOTION ARCHITECTURE
============================================================

Use Motion as the primary animation engine.

DO NOT introduce GSAP.

DO NOT create unnecessary animation libraries.

Animation hierarchy:

LEVEL 1 — MICRO INTERACTION
- button press
- hover
- icon movement
- checkbox
- toggle
- input focus

LEVEL 2 — COMPONENT MOTION
- card expansion
- task status changes
- modal opening
- dropdown
- notification
- progress

LEVEL 3 — PAGE TRANSITION
- shared layout transitions
- content replacement
- route transitions

LEVEL 4 — CINEMATIC MOMENT
- task completion
- approval
- points awarded
- tier upgrade
- leaderboard movement
- major card opening

LEVEL 5 — OPTIONAL 3D
Only for moments where 3D communicates something better than 2D.

Never animate everything simultaneously.

Motion must create hierarchy.

============================================================
05. DESIGN SYSTEM
============================================================

Use the existing design tokens from BRIEF.md.

Light theme is the primary experience.

Base:

Background:
#FAFAFC

Surface:
#FFFFFF

Border:
#E7E8F0

Primary text:
#0B1020

Muted:
#5B6178

Primary:
#5B5BF0

Accent:
#8B5CF6

Success:
#16A34A

Warning:
#F59E0B

Danger:
#E11D48

Dark:

Background:
#070A16

Surface:
#0E1224

Border:
#232949

Text:
#F3F4FA

Brand gradient:
#4F46E5 → #7C3AED → #A78BFA

Gradient is an accent.

Never use gradients on every card.

Typography:
Plus Jakarta Sans
Noto Sans Tamil

Large editorial headings.
Compact readable body text.

Cards:
20px radius

Buttons:
12px radius

Pills:
999px

Max content width:
1200px

Desktop spacing:
generous

Mobile spacing:
compact but breathable

============================================================
06. VISUAL LANGUAGE
============================================================

The new visual language is:

LIGHT EDITORIAL + CINEMATIC DEPTH + SELECTIVE 3D

Use:

- clean white surfaces
- deep navy typography
- violet/indigo accents
- subtle shadows
- thin borders
- large typography
- premium photography only when real assets exist
- soft background lighting
- subtle grain where appropriate
- layered cards
- floating sheets
- magnetic-feeling buttons
- shared-element transitions
- spatial depth

Avoid:

- excessive neon
- cyberpunk
- excessive glass
- excessive blur
- excessive rounded cards
- floating random objects
- fake charts
- fake numbers
- fake testimonials
- AI robots
- generic futuristic illustrations

============================================================
07. GLOBAL APP SHELL
============================================================

Desktop:

┌─────────────────────────────────────────────────────────────┐
│ ZYVEN       Home Events Tasks Leaderboard        Bell  User │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    PAGE CONTENT                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Mobile:

┌───────────────────────────────┐
│ ZYVEN                 Bell ○  │
│                               │
│        PAGE CONTENT           │
│                               │
├───────────────────────────────┤
│ Home Tasks Rank Rewards Me    │
└───────────────────────────────┘

Desktop navigation should be minimal.

Mobile uses a 5-item bottom navigation.

============================================================
08. PUBLIC LANDING PAGE
============================================================

The landing page is NOT a dashboard.

Purpose:
Explain the ambassador program quickly and convert students.

Layout:

┌──────────────────────────────────────────────┐
│ NAV                                          │
├──────────────────────────────────────────────┤
│                                              │
│        STUDENT AMBASSADOR PROGRAM            │
│                                              │
│        Represent Zyven                       │
│        on your campus.                      │
│                                              │
│   [ Join as Student ] [ See how it works ]  │
│                                              │
│       premium visual composition             │
│                                              │
├──────────────────────────────────────────────┤
│ HOW IT WORKS                                 │
│                                              │
│ 01 Sign up → 02 Get tasks → 03 Submit →     │
│ 04 Earn points                               │
├──────────────────────────────────────────────┤
│ OPEN TASKS                                   │
├──────────────────────────────────────────────┤
│ TIERS                                        │
├──────────────────────────────────────────────┤
│ STUDENT / AMBASSADOR                         │
├──────────────────────────────────────────────┤
│ FAQ                                          │
├──────────────────────────────────────────────┤
│ FINAL CTA                                    │
├──────────────────────────────────────────────┤
│ FOOTER                                       │
└──────────────────────────────────────────────┘

Keep scrolling smooth but restrained.

Do not add unnecessary AI sections.

Do not add fake statistics.

============================================================
09. AUTH EXPERIENCE
============================================================

/login

Premium split layout.

Desktop:

┌────────────────────────────┬──────────────────────────────┐
│                            │                              │
│      ZYVEN BRAND           │       Welcome back           │
│                            │                              │
│  Represent Zyven.          │       Google                │
│  Complete tasks.           │       LinkedIn              │
│  Earn points.              │       GitHub                 │
│                            │                              │
│                            │       ───── or ─────         │
│                            │                              │
│                            │       Email                  │
│                            │       Password               │
│                            │                              │
│                            │       [ Continue ]           │
│                            │                              │
│                            │       Create account         │
└────────────────────────────┴──────────────────────────────┘

Do not mention Admin.

When admin credentials authenticate:
route to /admin automatically.

Use:
- form field entrance
- focus animations
- button loading state
- error shake
- successful authentication transition

Never expose security implementation details.

============================================================
10. STUDENT DASHBOARD
============================================================

This is the most important redesign.

DO NOT make it look like:

┌────┐ ┌────┐ ┌────┐
│ 20 │ │ 12 │ │  3 │
└────┘ └────┘ └────┘

That is generic dashboard design.

Instead create a PREMIUM PERSONAL COMMAND CENTER.

Desktop:

┌──────────────────────────────────────────────────────────────┐
│ GOOD EVENING, THANGARAJ                         ● Active      │
│                                                              │
│              80                                             │
│              POINTS                                          │
│                                                              │
│              ───────────────────────                         │
│              20 points to next tier                          │
│                                                              │
│              #12 on leaderboard                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ WHAT TO DO NEXT                                              │
│                                                              │
│ ┌──────────────────────┐ ┌──────────────────────┐            │
│ │ LinkedIn              │ │ WhatsApp             │            │
│ │ Follow + Post         │ │ Join Community       │            │
│ │ +50                   │ │ +30                  │            │
│ │ 5 min                 │ │ 2 min                │            │
│ │                 →     │ │                 →    │            │
│ └──────────────────────┘ └──────────────────────┘            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ YOUR PROGRESS                                                │
│                                                              │
│             current tier                                     │
│        ─────────────────────────                              │
│                                                              │
├───────────────────────────┬──────────────────────────────────┤
│ YOUR TEAM                 │ RECENT ACTIVITY                  │
│                           │                                  │
│ Team name                 │ +50 Points                       │
│ Team rank                 │ LinkedIn task                    │
│ Members                   │                                  │
└───────────────────────────┴──────────────────────────────────┘

Important:

The first viewport should communicate:
WHAT SHOULD I DO NEXT?

Not:
HOW MANY CHARTS DO I HAVE?

============================================================
11. DASHBOARD HERO INTERACTION
============================================================

Points should feel alive.

When points change:

old number
↓
animated count
↓
new number

A subtle radial light expands behind the number.

Do NOT use confetti.

Use a refined particle/burst effect only once.

Tier progress:

progress bar smoothly fills.

If tier changes:

1. Background slightly darkens.
2. Current card expands.
3. Tier emblem appears.
4. Number counts upward.
5. New tier title enters.
6. Small particle burst.
7. Screen returns to normal.

Duration:
900–1400ms.

Allow Skip.

Respect reduced motion.

============================================================
12. TASK CARD SYSTEM
============================================================

Task cards must feel interactive.

Normal:

┌─────────────────────────────┐
│ LinkedIn                    │
│                             │
│ Follow + Post               │
│                             │
│ +50 POINTS       5 MIN      │
│                             │
│                             │
│ Start task              →   │
└─────────────────────────────┘

Hover:
- card lifts 4px
- image/icon scales 1.02
- arrow moves
- border becomes slightly stronger
- shadow deepens

Click:

DO NOT immediately hard-cut to another page.

Use:

CARD
 ↓
card expands
 ↓
background dims slightly
 ↓
content transitions into detail view
 ↓
task detail page

This should feel like the selected card is becoming the next screen.

Use Motion shared layout where technically appropriate.

============================================================
13. TASK DETAIL
============================================================

Desktop:

┌─────────────────────────────────────────────────────────────┐
│ ← Back                                      Save             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ LinkedIn                                                    │
│ Follow + Post                                               │
│                                                             │
│ +50 POINTS       5 MIN       DEADLINE                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ HOW TO COMPLETE                                             │
│                                                             │
│ 01 Follow Zyven                                             │
│ 02 Create your post                                         │
│ 03 Publish it                                               │
│ 04 Submit your proof                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SUBMIT PROOF                                                │
│                                                             │
│ URL                                                         │
│ [________________________________________]                  │
│                                                             │
│ Screenshot                                                  │
│ [       Drop screenshot here       ]                        │
│                                                             │
│                    [ Submit proof ]                         │
└─────────────────────────────────────────────────────────────┘

The submit section should visually become the focal point.

============================================================
14. SUBMIT ANIMATION
============================================================

When user clicks Submit:

1. Button compresses.
2. Button enters loading state.
3. Form locks.
4. Validation passes.
5. Button transforms into success state.
6. Check mark draws.
7. Form card subtly expands.
8. Timeline item appears:
   "Proof submitted"
9. Reviewer status appears.

No full-screen celebration for normal submission.

============================================================
15. APPROVAL EXPERIENCE
============================================================

When reviewer approves:

Realtime event arrives.

Do NOT silently update.

Show a premium notification.

Example:

        ✓

      APPROVED

     +50 POINTS

   LinkedIn Follow + Post

Then:

points counter updates
↓
rank recalculates
↓
progress updates

If tier changes, trigger the tier celebration.

This is one of the highest-value moments in the product.

============================================================
16. LEADERBOARD
============================================================

Do not create a boring table first.

Desktop:

┌──────────────────────────────────────────────────────────────┐
│ LEADERBOARD                                                  │
│                                                              │
│       Students        Teams                                  │
│                                                              │
│             01                                           │
│          ┌─────────┐                                      │
│          │  NAME   │                                      │
│          │  POINTS │                                      │
│          └─────────┘                                      │
│                                                              │
│  02  Name                                      140          │
│  03  Anonymous                                 120          │
│  04  Name                                      110          │
│                                                              │
│  YOUR POSITION                                              │
│  ─────────────────────────────────────────────────────────   │
│  #12  You                                      80           │
└──────────────────────────────────────────────────────────────┘

Top three may have subtle podium treatment.

Do not over-animate leaderboard rows.

When user's rank changes:
old position → new position with a smooth row transition.

============================================================
17. REWARDS
============================================================

Do not make it a grid of generic reward cards.

Create a visual tier progression.

Example:

             NEXT
              ↓
        ┌────────────┐
        │  TIER 02   │
        │  100 PTS   │
        └────────────┘
             │
             │
        ┌────────────┐
        │  TIER 01   │
        │  50 PTS    │
        └────────────┘

Current tier receives visual emphasis.

Reached tiers:
solid / completed

Future tiers:
quiet / muted

Perks appear only if real database data exists.

============================================================
18. PROFILE
============================================================

Profile should feel like a personal identity page.

Desktop:

┌─────────────────────────────────────────────┐
│                                             │
│             AVATAR                          │
│                                             │
│             NAME                            │
│             COLLEGE                         │
│             TEAM                            │
│                                             │
│       80 POINTS        #12                   │
│                                             │
├─────────────────────────────────────────────┤
│ Activity                                    │
│ Points history                              │
│ Team                                        │
│ Certificates                                │
│ Settings                                    │
└─────────────────────────────────────────────┘

Use a large profile header instead of many small cards.

============================================================
19. AMBASSADOR EXPERIENCE
============================================================

Ambassador is NOT a student dashboard.

It is an operational command center.

But still premium and visually elegant.

Primary question:

WHAT NEEDS MY ATTENTION?

Hero:

REVIEWS WAITING
TASKS WAITING FOR APPROVAL
TEAM ACTIVITY

Then:

┌───────────────────────────────┐
│ REVIEWS WAITING               │
│ 08                            │
│ [ Review submissions → ]      │
└───────────────────────────────┘

┌───────────────────────────────┐
│ TEAM                          │
│ 32 members                    │
│ Team points                   │
│ Team rank                     │
│ [ Manage team → ]             │
└───────────────────────────────┘

Use action-focused cards, not statistics dashboards.

============================================================
20. AMBASSADOR TASK CREATION
============================================================

Use a premium step-based creation studio.

Desktop:

┌──────────────────────────────────────────────────────────────┐
│ CREATE TASK                                                   │
│                                                              │
│ 01 Basics ─ 02 Proof ─ 03 Audience ─ 04 Review              │
│                                                              │
│                                                              │
│                     FORM                                     │
│                                                              │
│                                         [ Save draft ]       │
│                                         [ Continue → ]       │
└──────────────────────────────────────────────────────────────┘

Progress indicator is animated.

Fields enter smoothly.

Do not put all fields on one huge page.

============================================================
21. REVIEW EXPERIENCE
============================================================

Reviewing should feel like an evidence inspection interface.

Desktop:

┌──────────────────────┬───────────────────────────────────────┐
│ STUDENT              │ PROOF                                 │
│                      │                                       │
│ Name                 │ LinkedIn URL                          │
│ College              │                                       │
│ Team                 │ Screenshot                            │
│                      │                                       │
│ LinkedIn profile     │                                       │
│                      │                                       │
│                      │                                       │
│                      │ [Approve] [Changes] [Reject]          │
└──────────────────────┴───────────────────────────────────────┘

Use keyboard shortcuts:
A = approve
C = changes
R = reject

After action:
current submission slides away
next submission enters.

This makes review fast.

============================================================
22. ADMIN PORTAL
============================================================

Admin is the ONLY place where a conventional operational dashboard is acceptable.

But still make it premium.

Admin visual language:
- dark navy sidebar
- clean white/dark content
- dense but readable
- tables
- filters
- queues
- review panels

Do not expose admin UI to normal users.

Admin login itself should remain visually minimal.

============================================================
23. MOBILE EXPERIENCE
============================================================

Do not shrink desktop.

Redesign layouts intentionally.

375px target.

Student mobile:

┌──────────────────────────┐
│ Zyven             Bell   │
│                          │
│ Good evening             │
│                          │
│ 80 POINTS                │
│ #12                       │
│ ─────────────            │
│                          │
│ WHAT TO DO NEXT          │
│                          │
│ ┌──────────────────────┐ │
│ │ LinkedIn             │ │
│ │ +50                  │ │
│ │ Start →              │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ WhatsApp             │ │
│ │ +30                  │ │
│ │ Start →              │ │
│ └──────────────────────┘ │
│                          │
├──────────────────────────┤
│ Home Tasks Rank Rewards Me│
└──────────────────────────┘

Task details:
- sticky submit CTA
- bottom sheets where appropriate
- full-width evidence uploader

Never create horizontal overflow.

============================================================
24. PREMIUM POPUPS
============================================================

Use dialogs/sheets selectively.

Required:

- task confirmation
- proof preview
- notification
- tier upgrade
- team invite
- profile edit
- request ambassador
- reject/review reason
- delete account request

Modal style:

large radius
clean typography
soft backdrop
subtle scale + fade
keyboard accessible
focus trapped

Do NOT use popup for every interaction.

============================================================
25. 3D SYSTEM
============================================================

3D should be a premium layer, not the entire website.

Use Three.js/R3F only when useful.

Potential uses:

1. Landing:
   subtle 3D Zyven mark / depth object.

2. Tier upgrade:
   3D emblem or spatial visual.

3. Premium task completion:
   very short visual effect.

4. Future event/experience pages:
   full 3D experience if justified.

Avoid:
- constant rotating objects
- WebGL background everywhere
- expensive shaders
- huge GLB files
- GPU-heavy mobile scenes

On mobile:
reduce or disable 3D when needed.

Fallback must always exist.

============================================================
26. CARD-TO-PAGE TRANSITIONS
============================================================

This is a core design feature.

Every important clickable card should feel connected to its destination.

Pattern:

REST
 ↓
HOVER
 ↓
FOCUS
 ↓
CLICK
 ↓
SHARED ELEMENT EXPANDS
 ↓
NEW CONTENT ENTERS
 ↓
PAGE SETTLES

Use Motion layoutId/shared layout transitions where stable.

If shared layout becomes technically unstable with App Router,
use controlled route transition overlays instead.

Never sacrifice reliability for animation.

============================================================
27. PAGE TRANSITIONS
============================================================

Use:

opacity
translateY 8px
scale 0.995 → 1

250–450ms.

Do not use dramatic page wipes.

Major screens may use:
- directional slide
- shared card expansion
- sheet transition

Respect reduced motion.

============================================================
28. NOTIFICATION SYSTEM
============================================================

Notification bell:

idle:
small dot if unread

click:
floating panel enters

new notification:
subtle bell animation

Approval:
priority notification

Tier:
priority notification

Do not spam toast notifications.

Use persistent notification center for history.

============================================================
29. REAL-TIME UX
============================================================

Supabase Realtime must update:

- points
- rank
- task assignment
- submission status
- announcements
- notifications

Do not refresh entire pages.

Update only the affected UI.

Example:

submission approved
→ notification
→ points count
→ rank
→ progress
→ tier if necessary

All transitions should be smooth.

============================================================
30. EMPTY STATES
============================================================

Empty states must look designed.

Example:

No tasks:

No tasks right now.

New tasks will appear here when they are assigned.

[ Back to home ]

No leaderboard points:

Nobody has points yet.

Complete a task to take the first position.

[ See tasks ]

Never use:
"No data found."

============================================================
31. LOADING EXPERIENCE
============================================================

Never show full-screen spinners unless unavoidable.

Use skeleton layouts matching the final content.

Example:

text skeleton
card skeleton
avatar skeleton
progress skeleton

When content arrives:
crossfade into real content.

============================================================
32. ERROR EXPERIENCE
============================================================

Errors should be actionable.

Bad:
"Something went wrong."

Better:
"Your proof could not be submitted because the deadline has passed."

Then:

[ Back to tasks ]

Known database errors must map to human-readable messages.

============================================================
33. ACCESSIBILITY
============================================================

Mandatory:

WCAG AA

Keyboard navigation
visible focus
aria labels
semantic HTML
44px minimum touch targets
screen reader support
reduced motion
proper contrast
form error association
focus trapping in dialogs

Do not make animation dependent on hover only.

============================================================
34. RESPONSIVE BREAKPOINTS
============================================================

Design/test:

375px
390px
430px
768px
1024px
1280px
1440px
1920px

At every breakpoint:
- no overflow
- no broken typography
- no clipped buttons
- no inaccessible controls
- no animation glitches

============================================================
35. PERFORMANCE
============================================================

Target:

Lighthouse mobile:
Performance 85+
Accessibility 95+
SEO 95+

Rules:

- lazy load heavy visuals
- dynamic import 3D
- optimize images
- avoid huge background videos
- avoid unnecessary client components
- server-render initial content
- use React Server Components wherever possible
- cache appropriately
- use Supabase queries efficiently
- virtualize large admin tables if needed

Do not turn the entire application into "use client".

============================================================
36. FILE ARCHITECTURE
============================================================

Follow the existing architecture.

Keep separation:

src/
  app/
  components/
  features/
  lib/
  hooks/
  styles/
  messages/
  types/

Feature-based UI should be used where complexity grows.

Example:

src/features/tasks/
  components/
  hooks/
  actions/
  schemas/
  types.ts

src/features/leaderboard/
src/features/rewards/
src/features/ambassador/
src/features/admin/

Do not create a giant components folder containing the entire application.

============================================================
37. COMPONENT ARCHITECTURE
============================================================

Create reusable primitives:

Button
Card
Badge
Avatar
Progress
Dialog
Sheet
Tooltip
Tabs
Input
Textarea
Select
Checkbox
Radio
Table
Skeleton
EmptyState
Timeline
Stepper

Then product-specific components:

TaskCard
TaskHero
TaskProofForm
TaskStatus
PointsDisplay
TierProgress
LeaderboardRow
LeaderboardPodium
RewardTier
TeamCard
NotificationBell
NotificationPanel
ProfileHeader
AmbassadorReviewCard
ReviewEvidence
ApprovalDialog
TierUpgradeOverlay

Do not duplicate components between desktop and mobile unless interaction
requirements genuinely differ.

============================================================
38. DATA RULE
============================================================

Absolutely NO:

mock users
mock points
fake statistics
fake task counts
fake leaderboard entries
fake testimonials
fake rewards
fake colleges
fake reviews

If database is empty:

design an intentional empty state.

Never hide missing data by inventing it.

============================================================
39. AI RULE
============================================================

Remove unnecessary visible AI content.

AI is NOT the selling point of this product.

Do not add:
- AI assistant
- AI chatbot
- AI recommendations
- AI-generated dashboard copy
- AI insights cards

unless explicitly required by the backend/product brief.

AI may be used internally later, but the frontend should remain:
human
simple
clear
task-oriented.

============================================================
40. CORE USER FLOWS
============================================================

FLOW A — Student

Landing
 ↓
Join
 ↓
Signup/Login
 ↓
Onboarding
 ↓
Dashboard
 ↓
Task
 ↓
Submit proof
 ↓
Review
 ↓
Approval
 ↓
Points
 ↓
Rank
 ↓
Tier

FLOW B — Ambassador

Login
 ↓
Ambassador Home
 ↓
Team
 ↓
Create Task
 ↓
Submit for Approval
 ↓
Admin Approval
 ↓
Task Live
 ↓
Student Submission
 ↓
Review
 ↓
Approve
 ↓
Student points update

FLOW C — Admin

Login
 ↓
Database role = admin
 ↓
Admin portal
 ↓
Review
 ↓
Approve
 ↓
Realtime update

============================================================
41. INTERACTION PRIORITY
============================================================

The most important actions must always be visually obvious.

Student:
1. Start task
2. Submit proof
3. See approval
4. Track progress

Ambassador:
1. Review
2. Create task
3. Manage team

Admin:
1. Review
2. Approve tasks
3. Manage users

Everything else is secondary.

============================================================
42. BUILD ORDER
============================================================

Implement in EXACTLY this order.

PHASE 1
Design system

PHASE 2
Global shell + navigation

PHASE 3
Authentication

PHASE 4
Student dashboard

PHASE 5
Task discovery + task detail

PHASE 6
Proof submission

PHASE 7
Leaderboard + rewards + profile

PHASE 8
Realtime feedback

PHASE 9
Ambassador portal

PHASE 10
Ambassador task studio

PHASE 11
Review experience

PHASE 12
Admin portal

PHASE 13
Premium motion pass

PHASE 14
Selective 3D pass

PHASE 15
Mobile optimization

PHASE 16
Accessibility

PHASE 17
Performance + production hardening

DO NOT jump directly to 3D.

DO NOT polish the landing page for weeks before the core product flow works.

============================================================
43. DEVELOPMENT RULE
============================================================

For each phase:

1. Read BRIEF.md.
2. Read CLAUDE.md.
3. Inspect existing implementation.
4. Do not destroy working functionality.
5. Implement the phase.
6. Test desktop.
7. Test mobile.
8. Test keyboard interaction.
9. Test reduced motion.
10. Run lint.
11. Run typecheck.
12. Run tests.
13. Fix issues.
14. Commit.

Never rewrite the whole project just to change styling.

============================================================
44. VISUAL QUALITY BAR
============================================================

Before considering a screen complete, ask:

Does this look like a real premium product?

Does the first viewport immediately explain the purpose?

Is the primary action obvious?

Does the screen have visual hierarchy?

Does the animation communicate something?

Can the user understand it without animation?

Does it work at 375px?

Does it work with reduced motion?

Does it feel fast?

Is every piece of information necessary?

Is every number real?

Is every reward real?

Is every image real?

If any answer is no, fix it.

============================================================
45. FINAL QUALITY RULE
============================================================

Do not optimize for:

"more effects"

Optimize for:

"more perceived quality."

The final product should feel premium because:
- hierarchy is excellent
- transitions are connected
- interactions are responsive
- typography is strong
- spacing is intentional
- information is simple
- animations have purpose
- 3D is selective
- real-time feedback feels alive
- mobile is thoughtfully designed

Build Zyven as a product people would willingly use,
not as a demonstration of frontend libraries.

Start with PHASE 1 only.

Do not implement future phases until the current phase passes:
- visual review
- responsive review
- accessibility review
- typecheck
- lint
- tests.  i want the best ui with 3d and animated one machan build it 

</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-18T19:25:00+05:30.

The user's current state is as follows:
Active Document: c:\Users\pandi\OneDrive\ドキュメント\event webiste\zyven-ambassador\src\lib\data\types.ts (LANGUAGE_TYPESCRIPT)
Cursor is on line: 237
Other open documents:
- c:\Users\pandi\OneDrive\ドキュメント\event webiste\zyven-ambassador\src\lib\data\types.ts (LANGUAGE_TYPESCRIPT)
- c:\Users\pandi\OneDrive\ドキュメント\event webiste\zyven-ambassador\.gitignore (LANGUAGE_UNSPECIFIED)
- c:\Users\pandi\OneDrive\ドキュメント\event webiste\zyven-ambassador\src\lib\motion.ts (LANGUAGE_TYPESCRIPT)
- c:\Users\pandi\OneDrive\ドキュメント\event webiste\zyven-ambassador\CLAUDE.md (LANGUAGE_MARKDOWN)
- c:\Users\pandi\OneDrive\ドキュメント\event webiste\zyven-ambassador\src\app\(auth)\register\profile\page.tsx (LANGUAGE_TSX)
</ADDITIONAL_METADATA>