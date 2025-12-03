'use client';

import { useAdminAuthStore } from '@/store/adminAuthStore';

/**
 * Hook to check user permissions
 */
export function usePermission() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, getPermissions } = useAdminAuthStore();

  /**
   * Check if user has permission for a resource action
   * Supports both specific permission and MANAGE_* permission
   * @param resource - Resource name (e.g., 'PRODUCTS', 'ORDERS')
   * @param action - Action type (e.g., 'READ', 'WRITE', 'DELETE')
   */
  const canAccess = (resource: string, action: string): boolean => {
    const managePermission = `MANAGE_${resource}`;
    const specificPermission = `${action}_${resource}`;
    
    return hasPermission(managePermission) || hasPermission(specificPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissions,
    /**
     * Check if user can perform a specific action
     */
    can: hasPermission,
    /**
     * Check if user cannot perform a specific action
     */
    cannot: (permission: string) => !hasPermission(permission),
    /**
     * Check resource-level access with MANAGE fallback
     */
    canAccess,
  };
}
