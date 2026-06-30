# Frontend Folder Concepts

This frontend is the visual product layer for Bricks Maker Advertisement Pro. Its job is to give the user a polished, animated workspace for ad creation, campaign management, media generation, gallery browsing, growth tools, premium plans, and support.

## Current frontend structure

```txt
frontend/
  index.html
  vite.config.ts
  tsconfig.json
  public/
  src/
    App.tsx
    main.tsx
    index.css
    ThemeContext.tsx
    accessibility/
    assets/
    components/
    components/home/
    components/shell/
    config/
    constants/
    context/
    hooks/
    pages/
    services/
    types/
    utils/
```

## Folder responsibilities

### `src/pages`

Page-level route/view files. These should stay thin and call the matching visual component.

Examples:

- `Dashboard.tsx` loads dashboard experience.
- `AdsPage.tsx` loads ad/flyer creator.
- `VideoPage.tsx` loads video studio.
- `GalleryPage.tsx` loads gallery.
- `GrowthPage.tsx` loads growth/marketing tools.
- `PremiumPage.tsx` loads premium subscription UI.
- `SupportPage.tsx` loads help/support UI.

### `src/components`

Main reusable UI and feature screens. This is where most visual concepts currently live.

Concept mapping:

- `TopBar.tsx` = brand header, theme selector, premium top controls.
- `Navbar.tsx` = main navigation tabs.
- `Footer.tsx` = product footer.
- `AdsView.tsx` = flyer/ad/pamphlet builder.
- `VideoView.tsx` = video creation workspace.
- `CaptionView.tsx` = caption/subtitle tools.
- `AnalyticsView.tsx` = metrics and campaign charts.
- `GalleryView.tsx` = asset/template/media gallery.
- `GrowthView.tsx` = business growth and campaign channels.
- `PremiumView.tsx` = subscription/pricing/value proposition.
- `ProjectsView.tsx` = project/templates workspace.
- `StudioView.tsx` = design/studio workspace.
- `SupportView.tsx` = support center and contact flow.

### `src/components/shell`

Advanced dashboard shell components. Use this folder when the app becomes a deeper admin/dashboard layout with sidebar navigation, search, user menu, and nested workspace pages.

### `src/components/home`

Homepage-specific components. Keep marketing landing page sections here instead of mixing them into dashboard or global components.

### `src/services`

Frontend API clients and browser-side service helpers.

Concept mapping:

- `auth.ts` / `auth.service.ts` = authentication client.
- `data.service.ts` = generic API/cache/offline queue client.
- `wan21Service.ts` = Wan2.1 video engine API client.
- `monitoring.ts` = frontend event/error reporting.
- `security.ts` = audit/security helpers.
- `serviceWorker.ts` = offline/cache registration.

Rule: UI components should call services, not raw backend logic.

### `src/hooks`

Reusable React logic.

Examples:

- `useGemini.ts` = AI copy suggestion hook.
- `useHomePage.ts` = homepage campaign calculations.
- `useOnlineStatus.ts` = online/offline status.
- `useServiceWorker.ts` = service worker readiness.

### `src/config`

Runtime configuration and feature flags.

Main file:

- `wan21.config.ts` = app config, API base URL, feature flags, Wan2.1 settings.

### `src/context` and `src/ThemeContext.tsx`

Theme and app-wide state providers. Keep global visual settings here, especially color tokens, animation mode, layout mode, and accessibility controls.

### `src/types`

Shared TypeScript models for users, campaigns, API responses, analytics, media, support tickets, and projects.

### `src/accessibility`

Accessibility helpers such as text-to-speech and voice command UI.

### `src/assets`

Static assets imported by React code, such as the brand logo.

### `src/utils`

Small pure helper functions. Avoid putting API calls or UI components here.

## Recommended future frontend organization

As the app grows, move big feature screens into `src/features`:

```txt
src/features/
  ads/
  analytics/
  dashboard/
  gallery/
  growth/
  premium/
  projects/
  studio/
  support/
  video/
```

Each feature can later contain:

```txt
feature-name/
  components/
  hooks/
  services/
  types.ts
  index.ts
```

For now, the current structure builds successfully, so the next refactor should be done feature-by-feature, not all at once.
