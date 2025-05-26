import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;
  const { carrier, trackingNumber, trackingUrl } = req.body;

  if (!orderId || !carrier || !trackingNumber) {
    return res.status(400).json({ 
      error: 'Order ID, carrier, and tracking number are required' 
    });
  }

  try {
    // TODO: Update order in database
    // const order = await updateOrderShipping(orderId, {
    //   carrier,
    //   trackingNumber,
    //   trackingUrl,
    //   status: 'shipped',
    //   shippedAt: new Date().toISOString()
    // });

    // Mock order data for demonstration
    const order = {
      id: orderId,
      customerEmail: 'john@example.com',
      customerName: 'John Smith',
      bookTitle: 'The Adventures of Alex',
      shipping: {
        carrier,
        trackingNumber,
        trackingUrl
      }
    };

    // Generate tracking URL if not provided
    let finalTrackingUrl = trackingUrl;
    if (!finalTrackingUrl) {
      switch (carrier.toLowerCase()) {
        case 'ups':
          finalTrackingUrl = `https://www.ups.com/track?track=yes&trackNums=${trackingNumber}`;
          break;
        case 'fedex':
          finalTrackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
          break;
        case 'usps':
          finalTrackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
          break;
        case 'dhl':
          finalTrackingUrl = `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`;
          break;
        default:
          finalTrackingUrl = '';
      }
    }

    // Send shipping notification email to customer
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'CustomHeroes <orders@customheroes.com>',
          to: [order.customerEmail],
          subject: `Your CustomHeroes book "${order.bookTitle}" has shipped! 📦`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2D5016; margin: 0;">CustomHeroes</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Where Every Child is the Hero</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #2D5016; margin: 0 0 15px 0;">📦 Your Book Has Shipped!</h2>
                <p style="color: #333; margin: 0;">
                  Great news, ${order.customerName}! Your personalized book "<strong>${order.bookTitle}</strong>" is on its way to you.
                </p>
              </div>
              
              <div style="background: white; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2D5016; margin: 0 0 15px 0;">Shipping Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Carrier:</td>
                    <td style="padding: 8px 0; color: #333;">${carrier}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Tracking Number:</td>
                    <td style="padding: 8px 0; color: #333; font-family: monospace;">${trackingNumber}</td>
                  </tr>
                  ${finalTrackingUrl ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-weight: bold;">Track Package:</td>
                    <td style="padding: 8px 0;">
                      <a href="${finalTrackingUrl}" style="color: #1B4D89; text-decoration: none;">
                        Click here to track your package →
                      </a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2D5016; margin: 0 0 10px 0;">📚 What to Expect</h3>
                <ul style="color: #333; margin: 0; padding-left: 20px;">
                  <li>Your book is carefully packaged to arrive in perfect condition</li>
                  <li>Delivery typically takes 3-7 business days depending on your location</li>
                  <li>You'll receive updates as your package moves through the shipping network</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                ${finalTrackingUrl ? `
                <a href="${finalTrackingUrl}" style="background: #2D5016; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Track Your Package
                </a>
                ` : ''}
              </div>
              
              <div style="border-top: 1px solid #e9ecef; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                <p>Thank you for choosing CustomHeroes! We hope you love your personalized adventure.</p>
                <p>
                  Questions? Reply to this email or visit 
                  <a href="https://customheroes.com/support" style="color: #1B4D89;">our support page</a>
                </p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send shipping notification email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Shipping information updated and customer notified',
      trackingUrl: finalTrackingUrl
    });

  } catch (error) {
    console.error('Error updating shipping information:', error);
    res.status(500).json({ error: 'Failed to update shipping information' });
  }
}
