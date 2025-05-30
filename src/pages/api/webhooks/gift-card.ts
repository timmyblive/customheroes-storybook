import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '../../../lib/stripe';
import { createGiftCard, recordGiftCardTransaction } from '../../../lib/database';
import { sendGiftCardEmail } from '../../../lib/email';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Check if this is a gift card purchase
    if (session.metadata?.type === 'gift_card') {
      try {
        const {
          design,
          recipientName,
          recipientEmail,
          senderName,
          senderEmail,
          message,
          deliveryDate,
          amount
        } = session.metadata;

        // Parse amount to integer
        const amountInCents = parseInt(amount, 10);
        
        // Create gift card in database
        const giftCard = await createGiftCard(
          amountInCents,
          'USD',
          recipientEmail,
          recipientName,
          senderName,
          senderEmail,
          message,
          deliveryDate ? new Date(deliveryDate) : undefined,
          session.id
        );
        
        // Record the transaction
        await recordGiftCardTransaction(
          giftCard.id,
          amountInCents,
          'purchase',
          session.id
        );
        
        // Send gift card email to recipient
        // If delivery date is specified and it's in the future, schedule the email
        const shouldSendNow = !deliveryDate || new Date(deliveryDate) <= new Date();
        
        if (shouldSendNow) {
          await sendGiftCardEmail({
            recipientEmail,
            recipientName,
            senderName,
            amount: amountInCents / 100, // Convert to dollars
            giftCardCode: giftCard.code,
            message: message || undefined,
            design
          });
        }
        // For scheduled emails, you would need to implement a scheduling system
        // This could be done with a cron job or a service like AWS SQS + Lambda
      } catch (error) {
        console.error('Error processing gift card purchase:', error);
        return res.status(500).json({ error: 'Failed to process gift card purchase' });
      }
    }
  }

  return res.status(200).json({ received: true });
}
