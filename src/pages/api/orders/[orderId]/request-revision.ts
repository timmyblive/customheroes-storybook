import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderWithDetails, updateOrderStatus, updateRevisionNotes } from '../../../../lib/database';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;
  const { notes } = req.body;

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
    return res.status(400).json({ error: 'Revision notes are required' });
  }

  try {
    // Get order details from database
    const orderDetails = await getOrderWithDetails(orderId);
    
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderDetails[0];
    
    // Update order status in database to 'proof_revision'
    await updateOrderStatus(orderId, 'proof_revision');
    
    // Store revision notes in database
    await updateRevisionNotes(orderId, notes);
    console.log(`Revision requested for order ${orderId}:`, notes);

    // Send notification email to admin with revision details
    const logoUrl = 'https://wfw2amjvljwznu2k.public.blob.vercel-storage.com/Images/logo-EWu3uGFhlXwZzjQkUh58UDKbXc3sDg.png';
    
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'admin@customheroes.com', // Replace with actual admin email
        subject: `✏️ Revision Requested - ${order.book_title} (Order: ${orderId})`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Revision Requested</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${logoUrl}" alt="CustomHeroes Logo" style="max-width: 200px; height: auto;">
              </div>
              
              <h1 style="color: #f59e0b;">✏️ Revision Requested</h1>
              
              <p><strong>Customer:</strong> ${order.customer_name}</p>
              <p><strong>Email:</strong> ${order.customer_email}</p>
              <p><strong>Book Title:</strong> ${order.book_title}</p>
              <p><strong>Order ID:</strong> ${orderId}</p>
              
              <div style="background: #fefce8; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #92400e;">Customer's Revision Notes:</h3>
                <p style="margin-bottom: 0; white-space: pre-wrap; background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  ${notes}
                </p>
              </div>
              
              <p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/admin/orders/${orderId}" 
                   style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Order & Make Revisions
                </a>
              </p>
              
              <div style="background: #f3f4f6; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  <strong>Next Steps:</strong> Review the customer's feedback, make the necessary changes to the book, 
                  upload the revised proof, and send it back to the customer for approval.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: order.customer_email,
        subject: `✏️ Revision Request Received - ${order.book_title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Revision Request Received</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${logoUrl}" alt="CustomHeroes Logo" style="max-width: 200px; height: auto;">
              </div>
              
              <h1 style="color: #f59e0b;">✏️ Revision Request Received</h1>
              
              <p>Hello ${order.customer_name},</p>
              
              <p>
                Thank you for your feedback on your book "<strong>${order.book_title}</strong>". 
                We've received your revision request and our team will make the necessary changes.
              </p>
              
              <div style="background: #fefce8; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #92400e;">Your Revision Notes:</h3>
                <p style="margin-bottom: 0; white-space: pre-wrap; background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  ${notes}
                </p>
              </div>
              
              <p>
                <strong>What happens next?</strong><br>
                Our team will carefully review your feedback and make the requested changes. 
                Once the revised proof is ready, we'll send you a new email with the updated version for your approval.
              </p>
              
              <p>
                <strong>Estimated timeline:</strong> 1-2 business days
              </p>
              
              <div style="background: #f3f4f6; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  If you have any questions or need to add additional feedback, please reply to this email 
                  or contact our support team.
                </p>
              </div>
              
              <p style="text-align: center; margin-top: 30px;">
                Thank you for choosing CustomHeroes! 🌟
              </p>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Error sending customer confirmation:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({ 
      success: true, 
      message: 'Revision request submitted successfully. We will make the changes and send you a new proof!' 
    });
  } catch (error) {
    console.error('Error processing revision request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
