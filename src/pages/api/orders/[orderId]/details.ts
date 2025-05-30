import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderWithDetails } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Get order details from database
    const orderDetails = await getOrderWithDetails(orderId);
    
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Use the first result (should be unique by orderId)
    const order = orderDetails[0];
    
    // Return order data in the format expected by the frontend
    const orderData = {
      id: order.stripe_session_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      book_title: order.book_title || 'Your Custom Book',
      proof_url: order.proof_url,
      status: order.status || 'proof_sent'
    };

    res.status(200).json(orderData);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
