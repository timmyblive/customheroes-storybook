import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Get the admin password hash from environment variables
    let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    // For development, use a hardcoded hash for 'admin123' if env var is not set
    if (!adminPasswordHash && process.env.NODE_ENV === 'development') {
      console.log('Using development mode password hash');
      adminPasswordHash = '$2b$10$GMPJzZMDHdWClei3wamkcuzPlt24dcLnX9eU1vEfmv6LjhscdMzoa';
    } else if (!adminPasswordHash) {
      console.error('ADMIN_PASSWORD_HASH environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Received password:', password);
    console.log('Stored hash:', adminPasswordHash);
    
    // Verify the password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    console.log('Password validation result:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-change-this';
    const token = jwt.sign(
      { 
        isAdmin: true, 
        loginTime: Date.now() 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful' 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
