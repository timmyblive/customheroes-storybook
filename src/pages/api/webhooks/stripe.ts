import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../lib/stripe';
import Stripe from 'stripe';
import { updateOrderStatus, getOrderWithDetails, confirmGiftCardReservation, createOrUpdateCustomer } from '../../../lib/database';
import { sendOrderConfirmationEmail } from '../../../lib/email';
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
        
        // Capture shipping information from Stripe session
        // Type assertion to access Stripe Checkout Session properties
        const checkoutSession = session as Stripe.Checkout.Session & {
          shipping?: {
            address?: {
              line1?: string;
              line2?: string;
              city?: string;
              state?: string;
              postal_code?: string;
              country?: string;
            };
            name?: string;
          };
          customer_details?: {
            email?: string;
            name?: string;
            phone?: string;
          };
        };
        
        if (checkoutSession.shipping) {
          console.log('📦 Shipping information received from Stripe');
          try {
            const customerEmail = checkoutSession.customer_details?.email;
            const customerName = checkoutSession.customer_details?.name;
            
            if (customerEmail && customerName) {
              // Extract shipping details from Stripe session
              const addressLine1 = checkoutSession.shipping.address?.line1;
              const addressLine2 = checkoutSession.shipping.address?.line2;
              const city = checkoutSession.shipping.address?.city;
              const state = checkoutSession.shipping.address?.state;
              const postalCode = checkoutSession.shipping.address?.postal_code;
              const country = checkoutSession.shipping.address?.country;
              const phone = checkoutSession.customer_details?.phone;
              
              // Update customer with shipping information from Stripe
              await createOrUpdateCustomer(
                customerEmail,
                customerName,
                phone || undefined,
                addressLine1 || undefined,
                addressLine2 || undefined,
                city || undefined,
                state || undefined,
                postalCode || undefined,
                country || undefined
              );
              console.log('✅ Customer updated with shipping information from Stripe');
            } else {
              console.warn('⚠️ Missing customer email or name in session');
            }
          } catch (error) {
            console.error('❌ Error updating customer with shipping information:', error);
            // Don't fail the webhook for customer update errors
          }
        } else {
          console.log('ℹ️ No shipping information in Stripe session');
        }
        
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
            
            // Confirm the gift card reservation (this will update balance and create transaction)
            const result = await confirmGiftCardReservation(session.id);
            
            if (result) {
              console.log(`✅ Gift card reservation confirmed for session ${session.id}`);
              console.log(`🎉 Gift card ${appliedGiftCardCode} redeemed successfully. Amount: $${(result.reservation.reserved_amount / 100).toFixed(2)}`);
            } else {
              console.error('❌ No active reservation found for session:', session.id);
            }
          } catch (error) {
            console.error('💥 Error confirming gift card reservation:', error);
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
        
        // Send order confirmation email
        try {
          if (orderDetails && orderDetails.length > 0 && session.customer_email) {
            const order = orderDetails[0];
            const bookOrder = orderDetails[0].book_orders?.[0] || {};
            const character = orderDetails[0].characters?.[0] || {};
            
            // Calculate estimated delivery date (2 weeks from now)
            const estimatedDelivery = new Date();
            estimatedDelivery.setDate(estimatedDelivery.getDate() + 14);
            const formattedDeliveryDate = estimatedDelivery.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            // Format order date
            const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            // Send the email
            await sendOrderConfirmationEmail({
              customerEmail: session.customer_email,
              customerName: order.customer_name || 'Valued Customer',
              orderNumber: order.id.substring(0, 8).toUpperCase(), // Use first 8 chars of order ID
              orderDate: orderDate,
              productType: bookOrder.product_type || 'Custom Storybook',
              totalAmount: session.amount_total || 0,
              bookTitle: bookOrder.book_title || 'Your Custom Story',
              characterName: character.character_name || 'Your Character',
              estimatedDelivery: formattedDeliveryDate,
              sessionId: session.id
            });
            
            console.log('✅ Order confirmation email sent to', session.customer_email);
          } else {
            console.warn('⚠️ Could not send order confirmation email - missing order details or customer email');
          }
        } catch (emailError) {
          console.error('❌ Error sending order confirmation email:', emailError);
          // Don't fail the webhook for email errors
        }
        
        // Here you could trigger additional processes:
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
