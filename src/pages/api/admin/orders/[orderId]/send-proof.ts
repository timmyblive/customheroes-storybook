import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { getOrderWithDetails, updateProofUrl, updateOrderStatus } from '../../../../../lib/database';

/**
 * API endpoint to send a proof email to a customer.
 *
 * @param {NextApiRequest} req - The incoming request.
 * @param {NextApiResponse} res - The outgoing response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if the RESEND_API_KEY environment variable is set
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { orderId } = req.query;
  const { proofUrl, isRevision = false, isResend = false } = req.body;

  if (!orderId || !proofUrl) {
    return res.status(400).json({ error: 'Order ID and proof URL are required' });
  }

  // Ensure orderId is a string
  const orderIdString = Array.isArray(orderId) ? orderId[0] : orderId;

  try {
    // Get real order details from database using Stripe session ID
    // (Admin dashboard uses Stripe session IDs as order IDs)
    const orderDetails = await getOrderWithDetails(orderIdString);
    
    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Use the first result (should be unique by orderId)
    const order = orderDetails[0];
    const customerEmail = order.customer_email;
    const customerName = order.customer_name;
    const bookTitle = order.book_title || 'Your Custom Book';

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email not found for this order' });
    }

    console.log(`Sending proof email to: ${customerEmail} for order: ${orderId}`);

    // Create base URL for the site
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Create approval URL for customer to review the proof
    const approvalUrl = `${baseUrl}/proof/${orderId}`;
    
    // Logo URL for the email
    const logoUrl = 'https://wfw2amjvljwznu2k.public.blob.vercel-storage.com/Images/logo-EWu3uGFhlXwZzjQkUh58UDKbXc3sDg.png';

    // Send the email using Resend
    const emailResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // Using Resend's onboarding domain for testing
      to: customerEmail,
      subject: isResend
        ? `📖 RESENT: Your "${bookTitle}" Proof for Review`
        : isRevision 
          ? `📖 Your Revised "${bookTitle}" Proof is Ready for Review!` 
          : `📖 Your "${bookTitle}" Proof is Ready for Review!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Book Proof is Ready!</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
            
            <!-- Header Section -->
            <div style="background-color: white; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <img src="${logoUrl}" alt="CustomHeroes Logo" style="max-width: 200px; height: auto;">
              <h1 style="color: #1e293b; margin-top: 20px; font-size: 24px; font-weight: bold;">
                ${isResend ? 'Your Book Proof (Resent)' : isRevision ? 'Your Revised Book Proof is Ready!' : 'Your Book Proof is Ready!'}
              </h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <p style="font-size: 18px; color: #334155; margin-top: 0;">
                Hello ${customerName},
              </p>
              
              <p style="font-size: 16px; color: #334155;">
                ${isResend 
                  ? "We're <strong>resending this proof</strong> to ensure you have access to it. If you've already reviewed this proof, no further action is needed."
                  : isRevision 
                    ? "We've created a <strong>revised proof</strong> of your book based on your feedback. Please review it carefully to ensure all requested changes have been made."
                    : "We've created a proof of your book and it's ready for your review!"}
              </p>
              
              <p style="font-size: 16px; color: #475569; line-height: 1.7; margin: 0 0 30px 0;">
                🌟 Great news! Your personalized book <strong style="color: #4f46e5;">"${bookTitle}"</strong> has been carefully crafted and is ready for your review. 
                Our team has put together a beautiful story featuring your characters and we can't wait for you to see it!
              </p>

              <!-- Step 1: View Proof -->
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center; font-weight: bold;">
                  <span style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; margin-right: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);">1</span>
                  📖 View Your Book Proof
                </h3>
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                  Click the button below to open your book proof PDF. Take your time to review each page carefully and enjoy your personalized story!
                </p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${proofUrl}" target="_blank"
                     style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 18px 35px; 
                            text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);">
                    📖 View Your Book Proof
                  </a>
                </div>
              </div>

              <!-- Step 2: Review Instructions -->
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #92400e; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center; font-weight: bold;">
                  <span style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; margin-right: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);">2</span>
                  🔍 Review Your Book
                </h3>
                <ul style="color: #374151; margin: 0; padding-left: 0; list-style: none;">
                  <li style="margin-bottom: 12px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span><strong>Character Names:</strong> Check that all character names are spelled correctly</li>
                  <li style="margin-bottom: 12px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span><strong>Story Flow:</strong> Make sure the story makes sense and flows naturally</li>
                  <li style="margin-bottom: 12px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span><strong>Illustrations:</strong> Verify that the images match your expectations</li>
                  <li style="margin-bottom: 12px; padding-left: 25px; position: relative;"><span style="position: absolute; left: 0; color: #10b981; font-weight: bold;">✓</span><strong>Text:</strong> Look for any typos or grammatical errors</li>
                </ul>
              </div>

              <!-- Step 3: Approve or Request Changes -->
              <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border: 2px solid #8b5cf6; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #6b21a8; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center; font-weight: bold;">
                  <span style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; margin-right: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);">3</span>
                  ⚡ Approve or Request Changes
                </h3>
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                  After reviewing your book, please let us know if you're ready to proceed with printing or if you need any changes:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${approvalUrl}?action=approve" target="_blank"
                     style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 18px 35px; 
                            text-decoration: none; border-radius: 12px; font-weight: bold; margin: 10px 8px; font-size: 16px; box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);">
                    ✅ Approve & Print My Book
                  </a>
                  <br>
                  <a href="${approvalUrl}?action=revise" target="_blank"
                     style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 18px 35px; 
                            text-decoration: none; border-radius: 12px; font-weight: bold; margin: 10px 8px; font-size: 16px; box-shadow: 0 6px 12px rgba(245, 158, 11, 0.3);">
                    ✏️ Request Changes
                  </a>
                </div>
              </div>

              <div style="border-top: 2px solid #e2e8f0; padding-top: 25px; margin-top: 35px; text-align: center;">
                <p style="font-size: 16px; color: #475569; margin: 0 0 15px 0;">
                  <strong style="color: #4f46e5;">Need help?</strong> Reply to this email or contact our support team.
                </p>
                <p style="font-size: 16px; color: #475569; margin: 0;">
                  We're excited to bring your story to life! 🌟✨📚
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; text-align: center; border-top: 2px solid #e2e8f0;">
              <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">
                &copy; 2024 CustomHeroes - Creating Personalized Adventures 
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Email sent successfully:', emailResult);

    // Create a new send record
    const sendRecord = {
      id: `send_${Date.now()}`,
      proofUrl,
      sentAt: new Date().toISOString(),
      sentBy: 'admin', // In a real app, this would be the current user
      isRevision,
      isResend,
      revisionNumber: isRevision ? (order.proof_revision_count || 1) : 0,
      emailStatus: 'sent',
      emailId: emailResult.data?.id || 'unknown'
    };

    // Update order with proof info and send history
    try {
      // Save proof URL to database if this is not a resend
      if (!isResend) {
        await updateProofUrl(orderIdString, proofUrl);
        console.log(`Updated proof URL for order ${orderId}`);
      }
      
      // Update order status to 'proof_sent'
      await updateOrderStatus(orderIdString, 'proof_sent');
      console.log(`Updated order ${orderId} status to proof_sent`);
      
    } catch (dbError) {
      console.error('Error updating database:', dbError);
      // Don't fail the API call if database update fails, email was already sent
    }

    // Return success response
    return res.status(200).json({
      success: true,
      sentTo: customerEmail,
      sendRecord,
      isResend
    });

  } catch (error) {
    console.error('Error sending proof email:', error);
    res.status(500).json({
      error: 'Failed to send proof email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
