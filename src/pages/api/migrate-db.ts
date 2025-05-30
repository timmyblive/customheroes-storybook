import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const createSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = createSql();
    
    // Add proof_url column to book_orders table if it doesn't exist
    await sql`
      ALTER TABLE book_orders 
      ADD COLUMN IF NOT EXISTS proof_url TEXT
    `;
    
    // Add revision_notes column to book_orders table if it doesn't exist
    await sql`
      ALTER TABLE book_orders 
      ADD COLUMN IF NOT EXISTS revision_notes TEXT
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
