import { NextApiRequest, NextApiResponse } from 'next';
import { confirmGiftCardReservation } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    console.log(`🔧 Manually confirming gift card reservation for session: ${sessionId}`);
    
    // Confirm the gift card reservation (this simulates what the webhook should do)
    const result = await confirmGiftCardReservation(sessionId);
    
    if (result) {
      console.log(`✅ Gift card reservation confirmed for session ${sessionId}`);
      console.log(`🎉 Gift card redeemed successfully. Amount: $${(result.reservation.reserved_amount / 100).toFixed(2)}`);
      
      res.status(200).json({ 
        success: true,
        message: 'Gift card reservation confirmed',
        result
      });
    } else {
      console.error('❌ No active reservation found for session:', sessionId);
      res.status(404).json({ 
        error: 'No active reservation found for this session',
        sessionId
      });
    }
  } catch (error) {
    console.error('💥 Error confirming gift card reservation:', error);
    res.status(500).json({ 
      error: 'Failed to confirm gift card reservation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
