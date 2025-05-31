import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Send email to support team
    await resend.emails.send({
      from: 'CustomHeroes Contact Form <noreply@customheroes.ai>',
      to: ['support@customheroes.ai'],
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Information</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Message</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1565c0; font-size: 14px;">
                <strong>Reply to this customer:</strong> <a href="mailto:${email}" style="color: #1565c0;">${email}</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            <p>This email was sent from the CustomHeroes contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'CustomHeroes Support <support@customheroes.ai>',
      to: [email],
      subject: 'Thank you for contacting CustomHeroes!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
              
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out to CustomHeroes! We've received your message about "<strong>${subject}</strong>" and our team will review it carefully.
              </p>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50; margin: 20px 0;">
                <p style="margin: 0; color: #2e7d32; font-weight: bold;">What happens next?</p>
                <ul style="color: #2e7d32; margin: 10px 0; padding-left: 20px;">
                  <li>We'll review your message within 24-48 hours</li>
                  <li>A member of our support team will respond directly to this email</li>
                  <li>For urgent order-related matters, please include your order number</li>
                </ul>
              </div>
              
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
                In the meantime, you might find answers to common questions in our <a href="https://customheroes.ai/faq" style="color: #667eea; text-decoration: none;">FAQ section</a>.
              </p>
              
              <p style="color: #2c3e50; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>The CustomHeroes Team</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            <p>This is an automated confirmation. Please do not reply to this email.</p>
            <p>Visit us at <a href="https://customheroes.ai" style="color: #667eea;">customheroes.ai</a></p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}
