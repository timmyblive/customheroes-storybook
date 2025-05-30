import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';
import { updateOrderStatus, getOrderWithDetails, updateGiftCardBalance, getGiftCardByCode, recordGiftCardTransaction } from '../../../lib/database';
import { buffer } from 'micro';

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔔 Stripe webhook received:', req.method);
  
  if (req.method !== 'POST') {
    console.log('❌ Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('✅ Webhook signature verified. Event type:', event.type);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    console.log('🔄 Processing event:', event.type);
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('💳 Payment successful for session:', session.id);
        console.log('📋 Session metadata:', JSON.stringify(session.metadata, null, 2));
        
        // Update order status to completed
        await updateOrderStatus(session.id, 'completed');
        console.log('✅ Order status updated to completed');
        
        // Process gift card redemption if applicable
        const appliedGiftCardCode = session.metadata?.appliedGiftCardCode;
        const appliedGiftCardDiscount = session.metadata?.appliedGiftCardDiscount;
        
        console.log('🎁 Gift card check:');
        console.log('  - Code:', appliedGiftCardCode);
        console.log('  - Discount:', appliedGiftCardDiscount);
        
        if (appliedGiftCardCode && appliedGiftCardDiscount) {
          console.log('🔄 Processing gift card redemption...');
          try {
            console.log(`💰 Processing gift card redemption: ${appliedGiftCardCode} for $${(parseInt(appliedGiftCardDiscount) / 100).toFixed(2)}`);
            
            // Get the gift card details
            const giftCard = await getGiftCardByCode(appliedGiftCardCode);
            console.log('🎫 Gift card found:', giftCard ? `ID: ${giftCard.id}, Balance: $${(giftCard.remaining_amount / 100).toFixed(2)}` : 'NOT FOUND');
            
            if (giftCard) {
              // Calculate new remaining amount
              const discountAmount = parseInt(appliedGiftCardDiscount);
              const newRemainingAmount = Math.max(0, giftCard.remaining_amount - discountAmount);
              
              console.log(`💸 Updating balance: $${(giftCard.remaining_amount / 100).toFixed(2)} - $${(discountAmount / 100).toFixed(2)} = $${(newRemainingAmount / 100).toFixed(2)}`);
              
              // Update gift card balance
              await updateGiftCardBalance(giftCard.id, newRemainingAmount);
              console.log('✅ Gift card balance updated');
              
              // Record the transaction
              await recordGiftCardTransaction(
                giftCard.id,
                discountAmount,
                'redemption',
                session.id
              );
              console.log('✅ Gift card transaction recorded');
              
              console.log(`🎉 Gift card ${appliedGiftCardCode} updated successfully. New balance: $${(newRemainingAmount / 100).toFixed(2)}`);
            } else {
              console.error('❌ Gift card not found:', appliedGiftCardCode);
            }
          } catch (error) {
            console.error('💥 Error processing gift card redemption:', error);
            // Don't fail the webhook for gift card errors
          }
        } else {
          console.log('ℹ️ No gift card applied to this order');
        }
        
        // Get complete order details for logging/processing
        const orderDetails = await getOrderWithDetails(session.id);
        console.log('Order completed:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          orderDetails: orderDetails[0], // First row contains the main order info
        });
        
        // Here you could trigger additional processes:
        // - Send confirmation email
        // - Start book generation process
        // - Send to fulfillment system
        // - Update inventory
        
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update order status to failed if we can find it
        if (failedPayment.metadata?.sessionId) {
          await updateOrderStatus(failedPayment.metadata.sessionId, 'failed');
        }
        
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        console.log('Checkout session expired:', expiredSession.id);
        
        // Update order status to failed
        await updateOrderStatus(expiredSession.id, 'failed');
        
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
