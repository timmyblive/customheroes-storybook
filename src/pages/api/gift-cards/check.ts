import { NextApiRequest, NextApiResponse } from 'next';
import { getGiftCardByCode, getGiftCardAvailableBalance } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing gift card code' });
  }

  try {
    // Get gift card details
    const giftCard = await getGiftCardByCode(code);

    if (!giftCard) {
      return res.status(404).json({ error: 'Gift card not found' });
    }

    // Check if the gift card is active
    if (giftCard.status !== 'active') {
      return res.status(400).json({ 
        error: `Gift card is ${giftCard.status}`,
        status: giftCard.status
      });
    }

    // Check if the gift card has expired
    if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
      return res.status(400).json({ 
        error: 'Gift card has expired',
        status: 'expired'
      });
    }

    // Get available balance (remaining amount minus active reservations)
    const availableBalance = await getGiftCardAvailableBalance(giftCard.id);
    
    // Check if there's any available balance
    if (availableBalance <= 0) {
      return res.status(400).json({ 
        error: 'Gift card has no available balance',
        status: 'insufficient_balance'
      });
    }

    // Return gift card details with available balance
    return res.status(200).json({
      success: true,
      giftCard: {
        code: giftCard.code,
        remainingAmount: availableBalance, // Use available balance instead of raw remaining_amount
        currency: giftCard.currency,
        status: giftCard.status
      }
    });
  } catch (error) {
    console.error('Error checking gift card:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
