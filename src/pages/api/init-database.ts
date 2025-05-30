import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Add basic security - only allow in development or with a secret key
  const initSecret = req.headers['x-init-secret'] || req.body.secret;
  if (process.env.NODE_ENV === 'production' && initSecret !== process.env.DATABASE_INIT_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await initializeDatabase();
    res.status(200).json({ 
      success: true, 
      message: 'Database tables initialized successfully' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
