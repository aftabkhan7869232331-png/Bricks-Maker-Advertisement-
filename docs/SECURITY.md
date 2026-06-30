# Security

The frontend never creates or verifies JWT signatures and never stores private
OAuth secrets. Production deployments must provide server endpoints for OAuth
PKCE completion, refresh-token rotation, 2FA, API keys, encryption, audit logs,
CORS, CSRF enforcement and rate limiting.

Prefer secure, SameSite, HttpOnly cookies for refresh tokens. The current local
storage access-token adapter is a development scaffold and should be replaced
with an in-memory token plus server-managed session before production.
