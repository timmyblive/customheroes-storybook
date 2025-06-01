import { NextApiRequest, NextApiResponse } from 'next';
import { getGiftCardByCode, getGiftCardAvailableBalance } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Gift card code is required' });
  }

  try {
    const giftCard = await getGiftCardByCode(code);
    
    if (!giftCard) {
      return res.status(404).json({ error: 'Gift card not found' });
    }

    const availableBalance = await getGiftCardAvailableBalance(giftCard.id);

    res.status(200).json({
      success: true,
      giftCardId: giftCard.id,
      remainingAmount: giftCard.remaining_amount,
      availableBalance: availableBalance,
      difference: giftCard.remaining_amount - availableBalance
    });
  } catch (error) {
    console.error('Error testing balance:', error);
    res.status(500).json({ 
      error: 'Failed to test balance',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
