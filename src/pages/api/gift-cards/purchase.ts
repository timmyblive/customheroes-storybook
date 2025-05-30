import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';
import { createGiftCard, recordGiftCardTransaction } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount,
      design,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      message,
      deliveryDate
    } = req.body;

    // Validate amount
    if (!amount || amount < 500 || amount > 50000) {
      return res.status(400).json({ error: 'Gift card amount must be between $5 and $500' });
    }

    // Validate required fields
    if (!recipientName || !recipientEmail || !senderName || !senderEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `CustomHeroes Gift Card - $${(amount / 100).toFixed(2)}`,
              description: `Gift card for ${recipientName}`,
              images: [`https://customheroes.com/images/gift-cards/${design}.png`], // You'll need to create these images
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/gift-cards/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/products/gift-cards`,
      metadata: {
        type: 'gift_card',
        design,
        recipientName,
        recipientEmail,
        senderName,
        senderEmail,
        message: message || '',
        deliveryDate: deliveryDate || '',
        amount: amount.toString(),
      },
    });

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Error creating gift card checkout session:', error);
    return res.status(500).json({ error: 'Failed to create gift card checkout session' });
  }
}
