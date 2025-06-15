import { NextApiRequest, NextApiResponse } from 'next';
import { getAllGiftCards, fixGiftCardStatuses } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Debugging gift card statuses...');
    
    // Get all gift cards to see current state
    const allGiftCards = await getAllGiftCards();
    
    console.log('📊 Current gift card statuses:');
    allGiftCards.forEach(card => {
      console.log(`- ${card.code}: $${(card.remaining_amount / 100).toFixed(2)} remaining, status: ${card.status}`);
    });
    
    // Check for any that should be redeemed but aren't
    const shouldBeRedeemed = allGiftCards.filter(card => 
      card.remaining_amount <= 0 && card.status !== 'redeemed'
    );
    
    console.log(`🚨 Found ${shouldBeRedeemed.length} gift cards that should be redeemed but aren't:`);
    shouldBeRedeemed.forEach(card => {
      console.log(`- ${card.code}: $${(card.remaining_amount / 100).toFixed(2)} remaining, status: ${card.status} (should be redeemed)`);
    });
    
    // Auto-fix if requested
    let fixedCount = 0;
    if (req.query.fix === 'true') {
      console.log('🔧 Auto-fixing gift card statuses...');
      fixedCount = await fixGiftCardStatuses();
      console.log(`✅ Fixed ${fixedCount} gift card statuses`);
    }
    
    res.status(200).json({ 
      success: true,
      totalGiftCards: allGiftCards.length,
      shouldBeRedeemed: shouldBeRedeemed.length,
      fixedCount,
      giftCards: allGiftCards.map(card => ({
        code: card.code,
        remainingAmount: card.remaining_amount,
        status: card.status,
        lastUsed: card.last_used_at
      }))
    });
  } catch (error) {
    console.error('❌ Error debugging gift card statuses:', error);
    res.status(500).json({ 
      error: 'Failed to debug gift card statuses',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
