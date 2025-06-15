import { NextApiRequest, NextApiResponse } from 'next';
import { createSql } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = createSql();
    
    console.log('🔍 Debugging gift card transactions and reservations...');
    
    // Check gift card transactions
    const transactions = await sql`
      SELECT 
        t.*,
        g.code as gift_card_code
      FROM gift_card_transactions t
      JOIN gift_cards g ON t.gift_card_id = g.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `;
    
    console.log(`💳 Recent transactions: ${transactions.length}`);
    transactions.forEach(tx => {
      console.log(`- ${tx.gift_card_code}: ${tx.transaction_type} $${(tx.amount / 100).toFixed(2)} (${tx.created_at})`);
    });
    
    // Check reservations
    const reservations = await sql`
      SELECT 
        r.*,
        g.code as gift_card_code
      FROM gift_card_reservations r
      JOIN gift_cards g ON r.gift_card_id = g.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    
    console.log(`🎫 Recent reservations: ${reservations.length}`);
    reservations.forEach(res => {
      console.log(`- ${res.gift_card_code}: ${res.status} $${(res.reserved_amount / 100).toFixed(2)} (Session: ${res.session_id})`);
    });
    
    // Check orders that might have used gift cards
    const orders = await sql`
      SELECT 
        id,
        stripe_session_id,
        total_amount,
        status,
        created_at
      FROM orders
      WHERE stripe_session_id IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    console.log(`📦 Recent orders: ${orders.length}`);
    orders.forEach(order => {
      console.log(`- Order ${order.id}: $${(order.total_amount / 100).toFixed(2)} (${order.status}) - Session: ${order.stripe_session_id}`);
    });
    
    await sql.end();
    
    res.status(200).json({ 
      success: true,
      transactions: transactions.map(tx => ({
        giftCardCode: tx.gift_card_code,
        type: tx.transaction_type,
        amount: tx.amount,
        createdAt: tx.created_at
      })),
      reservations: reservations.map(res => ({
        giftCardCode: res.gift_card_code,
        status: res.status,
        amount: res.reserved_amount,
        sessionId: res.session_id,
        createdAt: res.created_at
      })),
      orders: orders.map(order => ({
        id: order.id,
        sessionId: order.stripe_session_id,
        amount: order.total_amount,
        status: order.status,
        createdAt: order.created_at
      }))
    });
  } catch (error) {
    console.error('❌ Error debugging transactions:', error);
    res.status(500).json({ 
      error: 'Failed to debug transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
