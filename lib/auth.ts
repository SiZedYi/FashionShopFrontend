
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export interface DecodedAdminToken {
  sub: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Decode admin token from cookies (client-side)
 */
export function decodeAdminToken(): DecodedAdminToken | null {
  try {
    const token = Cookies.get('admin_token');
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedAdminToken>(token);
    return decoded;
  } catch (error) {
    console.error('Failed to decode admin token:', error);
    return null;
  }
}

/**
 * Decode admin token from string (for server-side use)
 */
export function decodeAdminTokenFromString(token: string): DecodedAdminToken | null {
  try {
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedAdminToken>(token);
    return decoded;
  } catch (error) {
    console.error('Failed to decode admin token:', error);
    return null;
  }
}

/**
 * Check if user has specific permission (client-side)
 */
export function hasPermission(permission: string): boolean {
  const decoded = decodeAdminToken();
  if (!decoded || !decoded.permissions) return false;
  
  return decoded.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions (client-side)
 */
export function hasAnyPermission(permissions: string[]): boolean {
  const decoded = decodeAdminToken();
  if (!decoded || !decoded.permissions) return false;
  
  return permissions.some(p => decoded.permissions.includes(p));
}

/**
 * Check if user has all of the specified permissions (client-side)
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const decoded = decodeAdminToken();
  if (!decoded || !decoded.permissions) return false;
  
  return permissions.every(p => decoded.permissions.includes(p));
}

/**
 * Check if user has specific permission (for server-side use with token string)
 */
export function hasPermissionFromToken(token: string, permission: string): boolean {
  const decoded = decodeAdminTokenFromString(token);
  if (!decoded || !decoded.permissions) return false;
  
  return decoded.permissions.includes(permission);
}

/**
 * Check if user has permission for a resource action (with MANAGE fallback)
 * @param token - JWT token string
 * @param resource - Resource name (e.g., 'PRODUCTS', 'ORDERS')
 * @param action - Action type (e.g., 'READ', 'WRITE', 'DELETE')
 */
export function canAccessResource(token: string, resource: string, action: string): boolean {
  const decoded = decodeAdminTokenFromString(token);
  if (!decoded || !decoded.permissions) return false;
  
  const managePermission = `MANAGE_${resource}`;
  const specificPermission = `${action}_${resource}`;
  
  return decoded.permissions.includes(managePermission) || decoded.permissions.includes(specificPermission);
}

/**
 * Check if user has any of the specified permissions (for server-side use with token string)
 */
export function hasAnyPermissionFromToken(token: string, permissions: string[]): boolean {
  const decoded = decodeAdminTokenFromString(token);
  if (!decoded || !decoded.permissions) return false;
  
  return permissions.some(p => decoded.permissions.includes(p));
}

/**
 * Check if user has all of the specified permissions (for server-side use with token string)
 */
export function hasAllPermissionsFromToken(token: string, permissions: string[]): boolean {
  const decoded = decodeAdminTokenFromString(token);
  if (!decoded || !decoded.permissions) return false;
  
  return permissions.every(p => decoded.permissions.includes(p));
}

/**
 * Get all permissions from token (client-side)
 */
export function getPermissions(): string[] {
  const decoded = decodeAdminToken();
  return decoded?.permissions || [];
}

/**
 * Get all permissions from token string (for server-side use)
 */
export function getPermissionsFromToken(token: string): string[] {
  const decoded = decodeAdminTokenFromString(token);
  return decoded?.permissions || [];
}
