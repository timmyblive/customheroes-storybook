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
    
    // Get all reservations for this gift card
    const reservations = await sql`
      SELECT 
        id,
        session_id,
        reserved_amount,
        status,
        expires_at,
        created_at
      FROM gift_card_reservations 
      WHERE gift_card_id = ${giftCard.id}
      ORDER BY created_at DESC
    `;

    res.status(200).json({
      success: true,
      giftCard: {
        id: giftCard.id,
        code: giftCard.code,
        remainingAmount: giftCard.remaining_amount
      },
      reservations: reservations
    });
  } catch (error) {
    console.error('Error debugging reservations:', error);
    res.status(500).json({ 
      error: 'Failed to debug reservations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
