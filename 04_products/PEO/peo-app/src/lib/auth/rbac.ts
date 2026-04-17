import type { UserRole } from "@prisma/client";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  anonymous_visitor: 0,
  free_user: 1,
  seller_applicant: 2,
  seller_verified: 3,
  investor_basic: 4,
  investor_advanced: 5,
  vendor: 6,
  admin_internal: 10,
};

export function hasRole(userRole: UserRole, required: UserRole | UserRole[]): boolean {
  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredRoles = Array.isArray(required) ? required : [required];
  const requiredLevel = Math.min(...requiredRoles.map((r) => ROLE_HIERARCHY[r]));
  return userLevel >= requiredLevel;
}

export function requireRole(userRole: UserRole, required: UserRole | UserRole[]): boolean {
  return hasRole(userRole, required);
}

export const SELLER_ROLES: UserRole[] = ["seller_applicant", "seller_verified", "admin_internal"];
export const INVESTOR_ROLES: UserRole[] = ["investor_basic", "investor_advanced", "admin_internal"];
export const VENDOR_ROLES: UserRole[] = ["vendor", "admin_internal"];
export const ADMIN_ROLES: UserRole[] = ["admin_internal"];
