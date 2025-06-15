import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('🔍 Checking database for gift card usage...');
    
    // Check gift card transactions
    const transactions = await sql`
      SELECT 
        t.*,
        g.code as gift_card_code
      FROM gift_card_transactions t
      JOIN gift_cards g ON t.gift_card_id = g.id
      ORDER BY t.created_at DESC
    `;
    
    console.log(`💳 Found ${transactions.length} transactions:`);
    transactions.forEach(tx => {
      console.log(`- ${tx.gift_card_code}: ${tx.transaction_type} $${(tx.amount / 100).toFixed(2)}`);
    });
    
    // Check reservations
    const reservations = await sql`
      SELECT 
        r.*,
        g.code as gift_card_code
      FROM gift_card_reservations r
      JOIN gift_cards g ON r.gift_card_id = g.id
      ORDER BY r.created_at DESC
    `;
    
    console.log(`🎫 Found ${reservations.length} reservations:`);
    reservations.forEach(res => {
      console.log(`- ${res.gift_card_code}: ${res.status} $${(res.reserved_amount / 100).toFixed(2)}`);
    });
    
    res.status(200).json({ 
      success: true,
      transactionCount: transactions.length,
      reservationCount: reservations.length,
      transactions,
      reservations
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Failed to check database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
