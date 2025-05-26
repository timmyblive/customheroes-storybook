import { NextApiRequest, NextApiResponse } from 'next';
import { validateAdminSession } from '../../../../lib/auth';
import { createGiftCard } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate admin session
  const isAdmin = await validateAdminSession(req);
  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      initialAmount,
      currency,
      recipientName,
      recipientEmail,
      senderName,
      senderEmail,
      message,
      expiresAt
    } = req.body;

    // Validate amount
    if (!initialAmount || typeof initialAmount !== 'number' || initialAmount < 500 || initialAmount > 50000) {
      return res.status(400).json({ error: 'Gift card amount must be between $5 and $500' });
    }

    // Validate currency
    if (!currency || currency !== 'USD') {
      return res.status(400).json({ error: 'Only USD currency is supported' });
    }

    // Create gift card
    const giftCard = await createGiftCard(
      initialAmount,
      currency,
      recipientEmail,
      recipientName,
      senderName,
      senderEmail,
      message,
      expiresAt ? new Date(expiresAt) : undefined
    );

    // If recipient email is provided, send the gift card email
    if (recipientEmail && recipientName) {
      try {
        const { sendGiftCardEmail } = require('../../../../lib/email');
        await sendGiftCardEmail({
          recipientEmail,
          recipientName,
          senderName: senderName || 'CustomHeroes',
          amount: initialAmount / 100,
          giftCardCode: giftCard.code,
          message: message || undefined,
          design: 'default'
        });
      } catch (emailError) {
        console.error('Error sending gift card email:', emailError);
        // Continue even if email fails
      }
    }

    return res.status(201).json({
      success: true,
      giftCard: {
        id: giftCard.id,
        code: giftCard.code,
        initialAmount: giftCard.initial_amount,
        remainingAmount: giftCard.remaining_amount,
        currency: giftCard.currency,
        status: giftCard.status
      }
    });
  } catch (error) {
    console.error('Error creating gift card:', error);
    return res.status(500).json({ error: 'Failed to create gift card' });
  }
}
