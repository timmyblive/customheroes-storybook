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

    const order = orderDetails[0];
    
    // Transform database data to match admin dashboard format (flat structure)
    const adminOrderData = {
      id: order.stripe_session_id,
      status: order.status,
      
      // Flat customer properties (not nested)
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      
      // Book information
      book: {
        title: order.book_title || `${order.character_name}'s Adventure`,
        pages: 24, // Default for now
        pdfUrl: order.proof_url || null
      },
      
      // Character information
      characterName: order.character_name,
      characterAge: order.character_age,
      characterPhotoUrl: order.character_photo_url,
      
      // Product details
      productType: order.package_type,
      artStyle: order.art_style,
      personalMessage: order.personal_message,
      
      // Payment information (flat structure)
      total: order.amount,
      currency: order.currency,
      payment: {
        amount: order.amount,
        currency: order.currency,
        status: 'completed', // Since we have the order, payment was successful
        method: 'card',
        stripeSessionId: order.stripe_session_id
      },
      
      // Timestamps
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      
      // Proof information
      proof: {
        status: order.status === 'proof_sent' ? 'sent' : 
               order.status === 'proof_approved' ? 'approved' :
               order.status === 'proof_revision' ? 'revision_requested' :
               order.proof_url ? 'uploaded' : null,
        url: order.proof_url,
        customerNotes: order.revision_notes || null,
        revisionCount: order.revision_notes ? 1 : 0,
        sendHistory: [] // Could be enhanced later
      },
      
      // Shipping information (placeholder since not in current schema)
      shipping: {
        carrier: null,
        trackingNumber: null,
        estimatedDelivery: null
      },
      
      // Shipping address (placeholder since not in current schema)
      shippingAddress: {
        name: order.customer_name,
        line1: 'Address not collected',
        line2: '',
        city: 'N/A',
        state: 'N/A',
        postalCode: 'N/A',
        country: 'US'
      }
    };

    res.status(200).json(adminOrderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
