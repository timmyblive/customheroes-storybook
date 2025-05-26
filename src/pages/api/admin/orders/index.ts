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
    
    // Get all orders with customer and book details
    const orders = await sql`
      SELECT 
        o.*,
        c.email as customer_email,
        c.name as customer_name,
        bo.title as book_title,
        bo.package_type,
        bo.art_style,
        bo.personal_message,
        ch.name as character_name,
        ch.age as character_age,
        ch.photo_url as character_photo_url
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN book_orders bo ON bo.order_id = o.id
      LEFT JOIN characters ch ON ch.book_order_id = bo.id
      ORDER BY o.created_at DESC
    `;

    // Transform database results to match our Order interface
    const transformedOrders = orders.map(dbOrder => ({
      id: dbOrder.stripe_session_id,
      customerEmail: dbOrder.customer_email,
      customerName: dbOrder.customer_name,
      productType: dbOrder.package_type,
      bookTitle: dbOrder.book_title,
      characterName: dbOrder.character_name,
      total: dbOrder.amount,
      status: dbOrder.status === 'completed' ? 'proof_generation' : dbOrder.status,
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      book: {
        title: dbOrder.book_title,
        coverImage: '/images/sample-cover.jpg',
        pages: 24,
        pdfUrl: undefined
      },
      shippingAddress: {
        name: dbOrder.customer_name,
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US'
      },
      shippingMethod: 'Standard Shipping',
      estimatedDelivery: undefined,
      proof: undefined,
      payment: {
        stripeSessionId: dbOrder.stripe_session_id,
        amount: dbOrder.amount,
        currency: dbOrder.currency,
        status: dbOrder.status === 'completed' ? 'paid' : 'pending'
      }
    }));

    res.status(200).json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
