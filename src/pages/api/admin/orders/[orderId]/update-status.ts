import { NextApiRequest, NextApiResponse } from 'next';
import { OrderStatus } from '../../../../../types/order';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;
  const { status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ 
      error: 'Order ID and status are required' 
    });
  }

  // Validate status
  const validStatuses: OrderStatus[] = [
    'completed',
    'proof_generation',
    'proof_sent',
    'proof_approved',
    'proof_revision',
    'printing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Invalid status provided' 
    });
  }

  try {
    // TODO: Update order status in database
    // const order = await updateOrderStatus(orderId, status);

    // Mock response for demonstration
    const updatedOrder = {
      id: orderId,
      status: status,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({ 
      success: true, 
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
}
