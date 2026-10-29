# Design House — Admin Panel

Admin panel for **Design House India Pvt. Ltd.** (designhouse.co.in): website content, enquiries, careers, portfolio, SEO and admin users.

> **Status:** frontend only. Every screen runs on demo data and nothing is saved to a server yet.
> The "Demo data" badge in the top bar is shown until the backend is connected.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3020
```

Sign in with **any valid email** and a password of **6+ characters** (demo login).

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Development server on port 3020 |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | TypeScript check                |

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` once the API exists.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · lucide-react · Recharts · Sonner.
Font: **Inter**. Brand colours: navy `#134698`, orange `#DE802B` (tokens in `src/app/globals.css`).

## Folder structure

```
src/
├── app/                        Routes only — each page.tsx is a few lines that render a feature screen
│   ├── (auth)/login/           Sign-in page
│   ├── (dashboard)/            Every signed-in screen (shares the sidebar/topbar layout)
│   │   ├── layout.tsx
│   │   ├── page.tsx            Dashboard
│   │   └── <module>/page.tsx   One folder per sidebar link
│   ├── globals.css             Design tokens + base styles
│   └── layout.tsx              Root layout (Inter font, toaster, no-index)
│
├── components/
│   ├── ui/                     Reusable building blocks: Button, inputs, Modal, DataTable, Badge, Tabs …
│   └── layout/                 Dashboard shell: Sidebar, Topbar, menus, footer
│
├── features/                   One folder per business area
│   ├── auth/                   Login screen, session, auth guard, auth service
│   ├── dashboard/              Dashboard widgets (each in components/)
│   ├── analytics/              Website analytics screen
│   ├── leads/                  Contact requests, meeting bookings
│   ├── home/                   Home page sections (slider, stats, FAQs, clients …)
│   ├── company/                About, team, services, portfolio, videos, banners
│   ├── content/                Blogs, pages, downloads + the shared ContentForm
│   ├── careers/                Vacancies, job applications
│   ├── seo/                    SEO manager, social media links
│   ├── communication/          Response templates, email & WhatsApp logs
│   ├── administration/         Admin users, roles, activity logs, settings, change password
│   ├── notifications/          Topbar notifications data
│   └── resources/              Generic list engine (ResourceManager) used by most modules
│
├── config/                     navigation.ts (sidebar = single source of truth), site.ts
├── hooks/                      Shared React hooks
├── lib/                        Pure helpers: cn, formatting, CSV export, ids
└── types/                      Global type declarations
```

Each feature folder holds a `data.ts` (types + demo data) and one `*-screen.tsx` per screen.

## How a list module works

Most modules are a **config** passed to `ResourceManager` (`src/features/resources`), which provides search, a filter dropdown,
pagination, add/edit modal with validation, delete confirmation, a details view and CSV export.

To add a module:

1. Add the type and demo data to the feature's `data.ts`.
2. Create `<name>-screen.tsx` with a `ResourceConfig` (columns, form fields, defaults) and render `<ResourceManager config={…} />`.
3. Add `src/app/(dashboard)/<route>/page.tsx` rendering the screen.
4. Add the link to `NAV_SECTIONS` in `src/config/navigation.ts`.

Single-record screens (About Us, Social Media, Settings) use `ContentForm` instead.

## Connecting the backend

Swap the demo pieces — the screens don't need to change:

| Demo piece                                            | Replace with                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| `features/auth/services/auth-service.ts`              | Calls to the auth API                                          |
| `features/auth/lib/session.ts` (browser storage)      | httpOnly cookie from the API + a middleware check              |
| `features/*/data.ts` arrays                           | API responses (e.g. a small fetch layer in `lib/api.ts`)       |
| `useResourceList` (in-memory add/edit/delete)         | API create/update/delete calls                                 |
| `ContentForm` save (timeout)                          | API update call                                                |
| `ImageUpload` (local preview URL)                     | Upload endpoint returning the stored file URL                  |

## Images

- `public/images/brand/` — Design House logo used across the admin.
- `public/images/login/login-background.webp` — login background (Design House office).
- `public/images/login/bharat-reference/` — the Bharat Organic admin's login images, copied for reference only; not used by any screen.
- `public/images/demo/` — sample photos for the demo data.
