import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Alter the orders table to increase stripe_session_id length
    await sql`
      ALTER TABLE orders 
      ALTER COLUMN stripe_session_id TYPE VARCHAR(500)
    `;
    
    console.log('Database migration completed successfully');
    res.status(200).json({ 
      success: true, 
      message: 'Database migration completed successfully' 
    });
    
  } catch (error) {
    console.error('Database migration error:', error);
    res.status(500).json({ 
      error: 'Database migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
