export const PERMISSION_ENTITIES = [
  "products",
  "orders",
  "tags",
  "categories",
  "returns",
] as const;

export type PermissionEntities = (typeof PERMISSION_ENTITIES)[number];
