/**
 * Permission constants used throughout the application
 */

// Product permissions
export const WRITE_PRODUCTS = 'WRITE_PRODUCTS'; // Create & Update products
export const READ_PRODUCTS = 'READ_PRODUCTS'; // View products
export const DELETE_PRODUCTS = 'DELETE_PRODUCTS'; // Delete products
export const MANAGE_PRODUCTS = 'MANAGE_PRODUCTS'; // Full access to products (includes all above)

// Order permissions
export const READ_ORDERS = 'READ_ORDERS'; // View orders
export const UPDATE_ORDERS = 'UPDATE_ORDERS'; // Update order status
export const CANCEL_ORDERS = 'CANCEL_ORDERS'; // Cancel orders
export const MANAGE_ORDERS = 'MANAGE_ORDERS'; // Full access to orders (includes all above)

// Customer permissions
export const READ_CUSTOMERS = 'READ_CUSTOMERS'; // View customers
export const WRITE_CUSTOMERS = 'WRITE_CUSTOMERS'; // Create & Update customers
export const DELETE_CUSTOMERS = 'DELETE_CUSTOMERS'; // Delete customers
export const MANAGE_CUSTOMERS = 'MANAGE_CUSTOMERS'; // Full access to customers (includes all above)

// Category permissions
export const READ_CATEGORIES = 'READ_CATEGORIES'; // View categories
export const WRITE_CATEGORIES = 'WRITE_CATEGORIES'; // Create & Update categories
export const DELETE_CATEGORIES = 'DELETE_CATEGORIES'; // Delete categories
export const MANAGE_CATEGORIES = 'MANAGE_CATEGORIES'; // Full access to categories (includes all above)

// Blog permissions
export const READ_BLOGS = 'READ_BLOGS'; // View blogs
export const WRITE_BLOGS = 'WRITE_BLOGS'; // Create & Update blogs
export const DELETE_BLOGS = 'DELETE_BLOGS'; // Delete blogs
export const MANAGE_BLOGS = 'MANAGE_BLOGS'; // Full access to blogs (includes all above)

// Slider permissions
export const READ_SLIDERS = 'READ_SLIDERS'; // View sliders
export const WRITE_SLIDERS = 'WRITE_SLIDERS'; // Create & Update sliders
export const DELETE_SLIDERS = 'DELETE_SLIDERS'; // Delete sliders
export const MANAGE_SLIDERS = 'MANAGE_SLIDERS'; // Full access to sliders (includes all above)

// Role & Permission management
export const READ_ROLES = 'READ_ROLES'; // View roles
export const WRITE_ROLES = 'WRITE_ROLES'; // Create & Update roles
export const DELETE_ROLES = 'DELETE_ROLES'; // Delete roles
export const MANAGE_ROLES = 'MANAGE_ROLES'; // Full access to roles (includes all above)

export const READ_PERMISSIONS = 'READ_PERMISSIONS'; // View permissions
export const WRITE_PERMISSIONS = 'WRITE_PERMISSIONS'; // Create & Update permissions
export const DELETE_PERMISSIONS = 'DELETE_PERMISSIONS'; // Delete permissions
export const MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS'; // Full access to permissions (includes all above)

// Admin User permissions
export const READ_USERS = 'READ_USERS'; // View admin users
export const WRITE_USERS = 'WRITE_USERS'; // Create & Update admin users
export const DELETE_USERS = 'DELETE_USERS'; // Delete admin users
export const MANAGE_USERS = 'MANAGE_USERS'; // Full access to admin users (includes all above)

// Report/Analytics permissions
export const VIEW_REPORTS = 'VIEW_REPORTS'; // Access analytics and reports
export const VIEW_STATISTICS = 'VIEW_STATISTICS'; // View dashboard statistics
export const MANAGE_REPORTS = 'MANAGE_REPORTS'; // Full access to reports & analytics

/**
 * Permission groups for easier management
 */
export const PERMISSION_GROUPS = {
  PRODUCTS: [READ_PRODUCTS, WRITE_PRODUCTS, DELETE_PRODUCTS, MANAGE_PRODUCTS],
  ORDERS: [READ_ORDERS, UPDATE_ORDERS, CANCEL_ORDERS, MANAGE_ORDERS],
  CUSTOMERS: [READ_CUSTOMERS, WRITE_CUSTOMERS, DELETE_CUSTOMERS, MANAGE_CUSTOMERS],
  CATEGORIES: [READ_CATEGORIES, WRITE_CATEGORIES, DELETE_CATEGORIES, MANAGE_CATEGORIES],
  BLOGS: [READ_BLOGS, WRITE_BLOGS, DELETE_BLOGS, MANAGE_BLOGS],
  SLIDERS: [READ_SLIDERS, WRITE_SLIDERS, DELETE_SLIDERS, MANAGE_SLIDERS],
  ROLES: [READ_ROLES, WRITE_ROLES, DELETE_ROLES, MANAGE_ROLES],
  PERMISSIONS: [READ_PERMISSIONS, WRITE_PERMISSIONS, DELETE_PERMISSIONS, MANAGE_PERMISSIONS],
  USERS: [READ_USERS, WRITE_USERS, DELETE_USERS, MANAGE_USERS],
  ANALYTICS: [VIEW_REPORTS, VIEW_STATISTICS, MANAGE_REPORTS],
} as const;

/**
 * Helper function to check if user has manage permission or specific permission
 * @param userPermissions - Array of user's permissions
 * @param resource - Resource name (e.g., 'PRODUCTS', 'ORDERS')
 * @param action - Specific action (e.g., 'READ', 'WRITE', 'DELETE')
 * @returns boolean - Whether user has permission
 */
export function hasResourcePermission(
  userPermissions: string[],
  resource: string,
  action: string
): boolean {
  const managePermission = `MANAGE_${resource}`;
  const specificPermission = `${action}_${resource}`;
  
  return userPermissions.includes(managePermission) || userPermissions.includes(specificPermission);
}
