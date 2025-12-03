'use client';

import { useAdminAuthStore } from '@/store/adminAuthStore';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Component to conditionally render based on user permissions
 * @param permission - Single permission to check
 * @param permissions - Array of permissions to check
 * @param requireAll - If true, requires all permissions. If false, requires any permission (default: false)
 * @param fallback - Optional component to render when permission is denied
 * @param children - Content to render when permission is granted
 */
export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAdminAuthStore();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
