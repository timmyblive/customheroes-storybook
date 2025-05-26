import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderWithDetails } from '../../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Get order details from database using Stripe session ID
    // (Admin dashboard uses Stripe session IDs as order IDs)
    const orderDetails = await getOrderWithDetails(orderId);
    
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Transform database result to match our Order interface
    const dbOrder = orderDetails[0];
    
    const order = {
      id: dbOrder.stripe_session_id,
      customerEmail: dbOrder.customer_email,
      customerName: dbOrder.customer_name,
      productType: dbOrder.package_type,
      bookTitle: dbOrder.book_title,
      characterName: dbOrder.character_name,
      total: dbOrder.amount,
      status: dbOrder.status === 'completed' ? 'proof_generation' : dbOrder.status, // Map to our order status
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      book: {
        title: dbOrder.book_title,
        coverImage: '/images/sample-cover.jpg', // Default cover image
        pages: 24, // Default page count
        pdfUrl: undefined // Will be set when book is generated
      },
      shippingAddress: {
        name: dbOrder.customer_name,
        line1: '', // These would need to be added to database schema
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US'
      },
      shippingMethod: 'Standard Shipping',
      estimatedDelivery: undefined,
      proof: undefined, // Will be set when proof is uploaded
      payment: {
        stripeSessionId: dbOrder.stripe_session_id,
        amount: dbOrder.amount,
        currency: dbOrder.currency,
        status: dbOrder.status === 'completed' ? 'paid' : 'pending'
      }
    };

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
