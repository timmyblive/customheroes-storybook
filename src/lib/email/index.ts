// Email sending utility functions
import { Resend } from 'resend';

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
