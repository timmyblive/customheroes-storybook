import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderWithDetails, updateOrderStatus } from '../../../../lib/database';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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
    
    // Update order status in database to 'proof_approved'
    await updateOrderStatus(orderId, 'proof_approved');
    console.log(`Order ${orderId} approved by customer`);

    // Send notification email to admin
    const logoUrl = 'https://wfw2amjvljwznu2k.public.blob.vercel-storage.com/Images/logo-EWu3uGFhlXwZzjQkUh58UDKbXc3sDg.png';
    
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'admin@customheroes.com', // Replace with actual admin email
        subject: `✅ Proof Approved - ${order.book_title} (Order: ${orderId})`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Proof Approved</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${logoUrl}" alt="CustomHeroes Logo" style="max-width: 200px; height: auto;">
              </div>
              
              <h1 style="color: #10b981;">✅ Proof Approved!</h1>
              
              <p><strong>Customer:</strong> ${order.customer_name}</p>
              <p><strong>Email:</strong> ${order.customer_email}</p>
              <p><strong>Book Title:</strong> ${order.book_title}</p>
              <p><strong>Order ID:</strong> ${orderId}</p>
              
              <div style="background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; color: #166534; font-weight: bold;">
                  The customer has approved their book proof. You can now proceed with printing and fulfillment.
                </p>
              </div>
              
              <p>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/admin/orders/${orderId}" 
                   style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Order Details
                </a>
              </p>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the approval if email fails
    }

    res.status(200).json({ 
      success: true, 
      message: 'Book approved successfully. We will begin printing your book!' 
    });
  } catch (error) {
    console.error('Error approving book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
