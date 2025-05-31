import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

/**
 * Validates admin session for API routes
 * Uses JWT tokens stored in HTTP-only cookies for security
 */
export async function validateAdminSession(req: NextApiRequest): Promise<boolean> {
  try {
    // Get the admin token from cookies
    const adminToken = req.cookies?.adminToken;
    
    if (!adminToken) {
      return false;
    }
    
    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-change-this';
    
    try {
      const decoded = jwt.verify(adminToken, jwtSecret) as any;
      return decoded.isAdmin === true;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return false;
    }
  } catch (error) {
    console.error('Error validating admin session:', error);
    return false;
  }
}

/**
 * Middleware to require admin authentication
 * Returns true if authenticated, false otherwise
 */
export function requireAdmin(req: NextApiRequest): boolean {
  const adminToken = req.cookies?.adminToken;
  if (!adminToken) {
    return false;
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-change-this';
    const decoded = jwt.verify(adminToken, jwtSecret) as any;
    return decoded.isAdmin === true;
  } catch {
    return false;
  }
}

/**
 * Client-side function to check if user is logged in as admin
 */
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/auth/check', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.isAuthenticated === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return false;
  }
}

/**
 * Get current admin user info (placeholder for future implementation)
 */
export async function getCurrentAdmin(req: NextApiRequest) {
  const isAdmin = await validateAdminSession(req);
  
  if (!isAdmin) {
    return null;
  }
  
  // Return basic admin info - expand this based on your needs
  return {
    id: 'admin',
    email: 'admin@customheroes.ai',
    role: 'admin'
  };
}
