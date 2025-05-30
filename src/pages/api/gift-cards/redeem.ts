import { NextApiRequest, NextApiResponse } from 'next';
import { getGiftCardByCode, updateGiftCardBalance, recordGiftCardTransaction } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, amount, orderId } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing gift card code' });
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid redemption amount' });
  }

  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'Missing order ID' });
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

    // Check if the gift card has enough balance
    if (giftCard.remaining_amount < amount) {
      return res.status(400).json({ 
        error: 'Insufficient gift card balance',
        remainingAmount: giftCard.remaining_amount
      });
    }

    // Calculate new balance
    const newRemainingAmount = giftCard.remaining_amount - amount;

    // Update gift card balance
    const updatedGiftCard = await updateGiftCardBalance(
      giftCard.id,
      newRemainingAmount
    );

    // Record the transaction
    await recordGiftCardTransaction(
      giftCard.id,
      amount,
      'redemption',
      orderId
    );

    // Return updated gift card details
    return res.status(200).json({
      success: true,
      giftCard: {
        code: updatedGiftCard.code,
        remainingAmount: updatedGiftCard.remaining_amount,
        currency: updatedGiftCard.currency,
        status: updatedGiftCard.status
      }
    });
  } catch (error) {
    console.error('Error redeeming gift card:', error);
    return res.status(500).json({ error: 'Failed to redeem gift card' });
  }
}
