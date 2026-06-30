export type PermissionKey =
  | "campaign:read"
  | "campaign:write"
  | "campaign:delete"
  | "analytics:read"
  | "team:manage"
  | "api:manage"
  | "billing:manage";

export type SubscriptionTier = "free" | "pro" | "enterprise";

export const TIER_PERMISSIONS: Record<SubscriptionTier, PermissionKey[]> = {
  free: ["campaign:read"],
  pro: ["campaign:read", "campaign:write", "analytics:read", "api:manage"],
  enterprise: [
    "campaign:read", "campaign:write", "campaign:delete",
    "analytics:read", "team:manage", "api:manage", "billing:manage",
  ],
};

export const hasPermission = (
  permissions: PermissionKey[],
  required: PermissionKey,
): boolean => permissions.includes(required);
