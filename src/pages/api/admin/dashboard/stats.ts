import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import { validateAdminSession } from '../../../../lib/auth';

const createSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate admin session
  const isAdmin = await validateAdminSession(req);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const sql = createSql();

      // Get total orders count
      const totalOrdersResult = await sql`
        SELECT COUNT(*) as count FROM orders
      `;
      const totalOrders = parseInt(totalOrdersResult[0].count, 10);

      // Get pending orders count (orders that need proof review)
      const pendingOrdersResult = await sql`
        SELECT COUNT(*) as count 
        FROM orders o
        JOIN book_orders bo ON o.id = bo.order_id
        WHERE o.status = 'completed' AND (bo.proof_url IS NULL OR bo.proof_url = '')
      `;
      const pendingOrders = parseInt(pendingOrdersResult[0].count, 10);

      // Get total gift cards count
      const totalGiftCardsResult = await sql`
        SELECT COUNT(*) as count FROM gift_cards
      `;
      const totalGiftCards = parseInt(totalGiftCardsResult[0].count, 10);

      // Get active gift cards count (not expired, not fully redeemed)
      const activeGiftCardsResult = await sql`
        SELECT COUNT(*) as count 
        FROM gift_cards 
        WHERE status = 'active' AND remaining_amount > 0
        AND (expires_at IS NULL OR expires_at > NOW())
      `;
      const activeGiftCards = parseInt(activeGiftCardsResult[0].count, 10);

      // Get total revenue from completed orders
      const totalRevenueResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as total 
        FROM orders 
        WHERE status = 'completed'
      `;
      const totalRevenue = parseFloat(totalRevenueResult[0].total) / 100; // Convert from cents to dollars

      // Get recent orders for activity feed
      const recentOrdersResult = await sql`
        SELECT o.id, o.created_at, o.amount, c.name as customer_name, bo.title
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN book_orders bo ON o.id = bo.order_id
        WHERE o.status = 'completed'
        ORDER BY o.created_at DESC
        LIMIT 5
      `;

      // Get recent gift cards
      const recentGiftCardsResult = await sql`
        SELECT id, code, initial_amount, created_at, recipient_name, sender_name
        FROM gift_cards
        ORDER BY created_at DESC
        LIMIT 5
      `;

      return res.status(200).json({
        stats: {
          totalOrders,
          pendingOrders,
          totalGiftCards,
          activeGiftCards,
          totalRevenue
        },
        recentActivity: {
          orders: recentOrdersResult.map(order => ({
            ...order,
            amount: order.amount / 100 // Convert from cents to dollars
          })),
          giftCards: recentGiftCardsResult.map(card => ({
            ...card,
            initial_amount: card.initial_amount / 100 // Convert from cents to dollars
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
