# ZYVEN STUDENT AMBASSADOR PLATFORM — PRODUCT SPECIFICATION (BRIEF.md)

## 01. PRODUCT PRINCIPLE
Build Zyven as a premium student ambassador platform.
Experience feel:
- Apple-level simplicity
- Linear-level interaction quality
- Modern premium event platforms & editorial websites
- Cinematic product experiences

Core philosophy:
DISCOVER → ACT → SUBMIT → GET APPROVED → EARN → RANK → PROGRESS

Aesthetics:
- LIGHT EDITORIAL + CINEMATIC DEPTH + SELECTIVE 3D
- Light theme is the primary experience
- Clean white surfaces, deep navy typography, violet/indigo accents
- Selective 3D visual accents (Three.js / React Three Fiber) where it materially elevates quality

## 02. ROLES & AUTH
- Three database roles: `student`, `ambassador`, `admin`
- Public login UI only exposes: Student / Ambassador (NO Admin button or Admin tab)
- Role redirected on auth:
  - `student` → `/dashboard`
  - `ambassador` → `/ambassador`
  - `admin` → `/admin`

## 03. DESIGN TOKENS
Light (Primary):
- Background: #FAFAFC
- Surface: #FFFFFF
- Border: #E7E8F0
- Primary text: #0B1020
- Muted text: #5B6178
- Primary: #5B5BF0
- Accent: #8B5CF6
- Success: #16A34A
- Warning: #F59E0B
- Danger: #E11D48

Dark:
- Background: #070A16
- Surface: #0E1224
- Border: #232949
- Text: #F3F4FA

Brand Gradient (Accent only, never overused):
- #4F46E5 → #7C3AED → #A78BFA

Radii:
- Cards: 20px (`rounded-[20px]`)
- Buttons: 12px (`rounded-[12px]`)
- Pills: 999px (`rounded-full`)
- Max container: 1200px

Typography:
- Plus Jakarta Sans
- Noto Sans Tamil
