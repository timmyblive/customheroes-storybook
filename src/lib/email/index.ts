// Email sending utility functions
import { Resend } from 'resend';
import { Order, BookOrder, Character } from '../database';

const resend = new Resend(process.env.RESEND_API_KEY);

interface GiftCardEmailParams {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  amount: number;
  giftCardCode: string;
  message?: string;
  design: string;
}

/**
 * Send a gift card email to a recipient
 */
export async function sendGiftCardEmail(params: GiftCardEmailParams): Promise<void> {
  const {
    recipientEmail,
    recipientName,
    senderName,
    amount,
    giftCardCode,
    message,
    design
  } = params;

  // Log the email details for debugging
  console.log(`Sending gift card email to ${recipientEmail}`);
  console.log(`Gift card code: ${giftCardCode}`);
  console.log(`Amount: $${amount.toFixed(2)}`);
  console.log(`From: ${senderName}`);
  console.log(`Message: ${message || 'No message'}`);
  
  // Prepare the gift card email template
  const logoUrl = 'https://wfw2amjvljwznu2k.public.blob.vercel-storage.com/Images/logo-EWu3uGFhlXwZzjQkUh58UDKbXc3sDg.png';
  const giftCardImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/images/gift-cards/${design}.png`;
  
  try {
    await resend.emails.send({
      from: 'gifts@customheroes.ai',
      to: recipientEmail,
      subject: `${senderName} sent you a CustomHeroes Gift Card!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>CustomHeroes Gift Card</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            <!-- Header with Logo -->
            <div style="text-align: center; padding: 20px; background: linear-gradient(to right, #f0f4ff, #e6f0ff);">
              <img src="${logoUrl}" alt="CustomHeroes Logo" style="max-width: 200px; height: auto;">
            </div>
            
            <!-- Gift Card Image -->
            <div style="text-align: center; padding: 20px;">
              <img src="${giftCardImageUrl}" alt="Gift Card Design" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            </div>
            
            <!-- Gift Card Content -->
            <div style="padding: 20px 30px;">
              <h1 style="color: #4a6ee0; margin-bottom: 20px; text-align: center;">You've Received a Gift Card!</h1>
              
              <p style="font-size: 16px;">Hello ${recipientName},</p>
              
              <p style="font-size: 16px;">${senderName} has sent you a CustomHeroes Gift Card worth <strong>$${amount.toFixed(2)}</strong>.</p>
              
              ${message ? `<p style="font-size: 16px; font-style: italic; background-color: #f7f7f7; padding: 15px; border-radius: 5px;">"${message}"</p>` : ''}
              
              <div style="background: linear-gradient(to right, #f0f4ff, #e6f0ff); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #333;">Your Gift Card Code:</p>
                <p style="font-size: 24px; letter-spacing: 3px; color: #4a6ee0; background-color: white; padding: 15px; border-radius: 5px; margin: 0; font-weight: bold;">${giftCardCode}</p>
              </div>
              
              <p style="font-size: 16px;">Use this code at checkout to create your own personalized storybook adventure. Your gift card never expires and can be used for any CustomHeroes product.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/create" 
                   style="background-color: #4a6ee0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Create Your Storybook Now
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f0f4ff; padding: 20px; text-align: center; font-size: 14px; color: #666;">
              <p>Thank you for being part of the CustomHeroes family!</p>
              <p>&copy; ${new Date().getFullYear()} CustomHeroes. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Gift card email sent successfully');
  } catch (error) {
    console.error('Error sending gift card email:', error);
    // Don't throw the error, just log it
  }
}

interface OrderConfirmationEmailParams {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  productType: string;
  totalAmount: number;
  bookTitle: string;
  characterName: string;
  estimatedDelivery: string;
  sessionId: string;
}

/**
 * Send an order confirmation email to a customer
 */
export async function sendOrderConfirmationEmail(params: OrderConfirmationEmailParams): Promise<void> {
  const {
    customerEmail,
    customerName,
    orderNumber,
    orderDate,
    productType,
    totalAmount,
    bookTitle,
    characterName,
    estimatedDelivery,
    sessionId
  } = params;

  // Log the email details for debugging
  console.log(`Sending order confirmation email to ${customerEmail}`);
  console.log(`Order number: ${orderNumber}`);
  console.log(`Product: ${productType}`);
  console.log(`Amount: $${(totalAmount / 100).toFixed(2)}`);
  
  // Prepare the order confirmation email template
  const logoUrl = 'https://wfw2amjvljwznu2k.public.blob.vercel-storage.com/Images/logo-EWu3uGFhlXwZzjQkUh58UDKbXc3sDg.png';
  const orderDetailsUrl = `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3001'}/create/confirmation?session_id=${sessionId}`;
  
  try {
    await resend.emails.send({
      from: 'orders@customheroes.ai',
      to: customerEmail,
      subject: `Your CustomHeroes Order Confirmation - #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>CustomHeroes Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
            <!-- Header with Logo -->
            <div style="text-align: center; padding: 20px; background: linear-gradient(to right, #f0f4ff, #e6f0ff);">
              <img src="${logoUrl}" alt="CustomHeroes Logo" style="max-width: 200px; height: auto;">
            </div>
            
            <!-- Order Confirmation Content -->
            <div style="padding: 20px 30px;">
              <h1 style="color: #4a6ee0; margin-bottom: 20px; text-align: center;">Order Confirmation</h1>
              
              <p style="font-size: 16px;">Hello ${customerName},</p>
              
              <p style="font-size: 16px;">Thank you for your order! We're excited to create your personalized storybook adventure.</p>
              
              <div style="background: linear-gradient(to right, #f0f4ff, #e6f0ff); padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h2 style="margin-top: 0; color: #333; font-size: 18px;">Order Summary</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Order Number:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Order Date:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Product:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${productType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Book Title:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${bookTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Main Character:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right;">${characterName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Total:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">$${(totalAmount / 100).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Estimated Delivery:</strong></td>
                    <td style="padding: 8px 0; text-align: right;">${estimatedDelivery}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 16px;">Our team is now working on creating your personalized storybook. We'll keep you updated on the progress.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${orderDetailsUrl}" 
                   style="background-color: #4a6ee0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                  View Order Details
                </a>
              </div>
              
              <p style="font-size: 16px;">If you have any questions about your order, please contact our customer support team at support@customheroes.ai.</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f0f4ff; padding: 20px; text-align: center; font-size: 14px; color: #666;">
              <p>Thank you for being part of the CustomHeroes family!</p>
              <p>&copy; ${new Date().getFullYear()} CustomHeroes. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw the error, just log it
  }
}
