import { NextApiRequest, NextApiResponse } from 'next';
import { validateAdminSession } from '../../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const isAuthenticated = await validateAdminSession(req);
    
    return res.status(200).json({ 
      isAuthenticated 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
