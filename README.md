# Bricks Maker Advertisement

Phase 1 foundation for the professional advertising workspace.

## Run

```powershell
npm install
npm run dev
```

The project is organized into:

- `frontend/` — React application, assets, pages, components, and browser services
- `backend/` — Express server, setup scripts, and backend checks
- `docs/` — developer documentation, security notes, and project charts
- `scripts/` — maintenance scripts for Wan2.1 setup and requirement updates

Copy `.env.example` to `.env` when connecting a backend. OAuth secrets, JWT
signing, encryption, authoritative rate limiting, and audit persistence must
run on the server; only public OAuth client IDs belong in Vite variables.

## Included

- Validated professional configuration and feature flags
- Advanced user, campaign, analytics, API and permission types
- Backend-ready OAuth/token/2FA client
- Cache and offline synchronization service
- Browser-safe security helpers
- Monitoring and health checks
- Five persistent professional/accessibility themes

## Maintenance

```powershell
npm run wan:check
npm run requirements:update
```

Developer documentation and generated project maps live in `docs/` so the
repository root stays focused on runnable project configuration.
