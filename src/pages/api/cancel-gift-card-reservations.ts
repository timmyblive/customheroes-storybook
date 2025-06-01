import { NextApiRequest, NextApiResponse } from 'next';
import { getGiftCardByCode } from '../../lib/database';
import { neon } from '@neondatabase/serverless';

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

    const sql = neon(process.env.DATABASE_URL!);
    
    // Cancel all active reservations for this gift card
    const result = await sql`
      UPDATE gift_card_reservations 
      SET status = 'cancelled'
      WHERE gift_card_id = ${giftCard.id} 
        AND status = 'active'
    `;

    res.status(200).json({
      success: true,
      message: `Cancelled ${result.length} active reservations for gift card ${code}`,
      cancelledCount: result.length
    });
  } catch (error) {
    console.error('Error cancelling gift card reservations:', error);
    res.status(500).json({ 
      error: 'Failed to cancel reservations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
