import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing session ID' });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(id);

    // Check if this is a gift card purchase
    if (session.metadata?.type !== 'gift_card') {
      return res.status(400).json({ error: 'Not a gift card session' });
    }

    // Return the gift card purchase details
    return res.status(200).json({
      success: true,
      purchaseDetails: {
        recipientName: session.metadata.recipientName,
        recipientEmail: session.metadata.recipientEmail,
        amount: parseInt(session.metadata.amount, 10),
        deliveryDate: session.metadata.deliveryDate || undefined,
      }
    });
  } catch (error) {
    console.error('Error retrieving gift card session:', error);
    return res.status(500).json({ error: 'Failed to retrieve gift card session' });
  }
}
