import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;
    console.log('Fetching order details for session:', session_id);

    // Check environment variables
    console.log('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length || 0
    });

    if (!session_id || typeof session_id !== 'string') {
      console.log('Invalid session_id:', session_id);
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Retrieve the checkout session from Stripe
    console.log('Retrieving session from Stripe...');
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    console.log('Session retrieved successfully:', session.id);
    console.log('Session metadata:', session.metadata);

    if (!session) {
      console.log('Session not found in Stripe');
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('Session retrieved successfully:', session.id);

    // Calculate estimated delivery based on package type
    const getEstimatedDelivery = (productType: string) => {
      const now = new Date();
      let businessDays = 15; // Default to max range

      switch (productType) {
        case 'deluxe':
          businessDays = 8; // Priority shipping: 5-8 business days (use max)
          break;
        case 'premium':
          businessDays = 11; // Expedited shipping: 8-11 business days (use max)
          break;
        case 'basic':
        default:
          businessDays = 15; // Standard shipping: 12-15 business days (use max)
          break;
      }

      // Add business days (skip weekends)
      let deliveryDate = new Date(now);
      let addedDays = 0;
      while (addedDays < businessDays) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        // Skip weekends
        if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
          addedDays++;
        }
      }

      return deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Extract product type from metadata
    const productType = session.metadata?.productType || 'basic';
    console.log('Product type:', productType);
    
    // Format the order data
    const orderData = {
      id: session.id,
      sessionId: session.id,
      customerEmail: session.customer_email || session.customer_details?.email || 'N/A',
      customerName: session.customer_details?.name || session.metadata?.customerName || 'N/A',
      productType: productType,
      bookTitle: session.metadata?.bookTitle || 'Custom Adventure',
      characterName: session.metadata?.characterName || 'Hero',
      total: session.amount_total || 0,
      status: session.payment_status,
      createdAt: new Date(session.created * 1000).toISOString(),
      date: new Date(session.created * 1000).toLocaleDateString(),
      estimatedDelivery: getEstimatedDelivery(productType),
      book: {
        title: session.metadata?.bookTitle || 'Custom Adventure',
        coverImage: '/images/sample-book-cover.png',
        pages: productType === 'deluxe' ? 30 : productType === 'premium' ? 25 : 20
      },
      shippingAddress: {
        name: session.customer_details?.name || 'N/A',
        line1: 'Address will be collected during fulfillment',
        line2: '',
        city: 'N/A',
        state: 'N/A',
        postalCode: 'N/A',
        country: 'N/A'
      },
      shippingMethod: productType === 'deluxe' 
        ? 'Priority shipping: 5-8 days'
        : productType === 'premium'
        ? 'Expedited shipping: 8-11 days'
        : 'Standard shipping: 12-15 days',
      lineItems: []
    };

    res.status(200).json(orderData);
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    // Check if it's a Stripe-specific error
    if (error?.type) {
      console.error('Stripe error type:', error.type);
      console.error('Stripe error code:', error.code);
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch order details',
      details: error?.message || 'Unknown error',
      type: error?.name || 'Unknown'
    });
  }
}
