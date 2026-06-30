# Frontend + Backend Concept Map

This document explains where each major product concept belongs. It is the guide for keeping the project clean while we continue polishing.

## Product concepts

| Concept | Frontend location | Backend location | Notes |
|---|---|---|---|
| Topbar | `frontend/src/components/TopBar.tsx` | none | Visual shell only. |
| Navbar | `frontend/src/components/Navbar.tsx` | none | Visual navigation only. |
| Dashboard | `frontend/src/pages/Dashboard.tsx`, `frontend/src/components/home/HomePage.tsx` | `/api/campaigns`, `/api/analytics/summary` | Shows campaign summaries and actions. |
| Ads/Flyer Builder | `frontend/src/pages/AdsPage.tsx`, `frontend/src/components/AdsView.tsx` | AI endpoints, campaigns endpoints | Creates ad/pamphlet content and saves campaigns. |
| Video Studio | `frontend/src/pages/VideoPage.tsx`, `frontend/src/components/VideoView.tsx` | `/api/wan21/*` | Video generation and Wan2.1 checks. |
| Caption Studio | `frontend/src/pages/CaptionPage.tsx`, `frontend/src/components/CaptionView.tsx` | future caption endpoint | Currently mostly frontend. |
| Analytics | `frontend/src/pages/AnalyticsPage.tsx`, `frontend/src/components/AnalyticsView.tsx` | `/api/analytics/summary`, monitoring endpoints | Metrics, charts, performance. |
| Gallery | `frontend/src/pages/GalleryPage.tsx`, `frontend/src/components/GalleryView.tsx` | future `/api/media` persistence | Templates, images, audio, video assets. |
| Growth | `frontend/src/pages/GrowthPage.tsx`, `frontend/src/components/GrowthView.tsx` | future campaign/channel endpoints | Marketing channels, campaigns, automation ideas. |
| Premium | `frontend/src/pages/PremiumPage.tsx`, `frontend/src/components/PremiumView.tsx` | `/api/subscriptions` | Plan display and future billing. |
| Projects/Templates | `frontend/src/pages/ProjectsPage.tsx`, `frontend/src/components/ProjectsView.tsx` | `/api/campaigns`, future `/api/projects` | Project intake and template planning. |
| Studio | `frontend/src/pages/StudioPage.tsx`, `frontend/src/components/StudioView.tsx` | future `/api/studio/projects` | Design workspace. |
| Support | `frontend/src/pages/SupportPage.tsx`, `frontend/src/components/SupportView.tsx` | `/api/support/tickets` | Help center and tickets. |
| Auth | `frontend/src/services/auth.ts` | `/api/auth/*`, `/api/users/me` | Currently demo/session backend. |
| Monitoring | `frontend/src/services/monitoring.ts` | `/api/monitoring/*` | Error and event tracking. |
| Theme/Animation | `frontend/src/index.css`, `frontend/src/ThemeContext.tsx` | none | Global visual polish. |

## Build/run concepts

### Frontend-only development

```txt
npm run dev:frontend
```

Runs Vite on:

```txt
http://localhost:3000
```

Vite proxies `/api` to the backend:

```txt
http://localhost:4000
```

### Full backend + frontend middleware

```txt
npm run dev
```

Runs Express on:

```txt
http://localhost:4000
```

In development, Express also mounts Vite middleware so the app can be opened from the backend server.

### Production build

```txt
npm run build
```

Build output:

```txt
dist/
```

## Next polish order

1. Keep frontend structure stable.
2. Split `backend/server.ts` into route/service files.
3. Add persistent storage.
4. Connect campaigns/support/media to real storage.
5. Polish animations, responsive spacing, loading states, and empty states.
6. Add real auth only after the product flow is stable.
