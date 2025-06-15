// Quick test script to check gift card statuses
const { createSql } = require('./src/lib/database');

async function checkGiftCardStatuses() {
  try {
    const sql = createSql();
    
    console.log('🔍 Checking gift card statuses...\n');
    
    // Get all gift cards
    const giftCards = await sql`
      SELECT 
        id,
        code,
        initial_amount,
        remaining_amount,
        status,
        last_used_at,
        created_at
      FROM gift_cards 
      ORDER BY created_at DESC
    `;
    
    console.log(`📊 Found ${giftCards.length} gift cards:\n`);
    
    giftCards.forEach(card => {
      const remaining = (card.remaining_amount / 100).toFixed(2);
      const initial = (card.initial_amount / 100).toFixed(2);
      const shouldBeRedeemed = card.remaining_amount <= 0 && card.status !== 'redeemed';
      
      console.log(`${shouldBeRedeemed ? '🚨' : '✅'} ${card.code}:`);
      console.log(`   Status: ${card.status}`);
      console.log(`   Balance: $${remaining} / $${initial}`);
      console.log(`   Last Used: ${card.last_used_at || 'Never'}`);
      if (shouldBeRedeemed) {
        console.log(`   ⚠️  SHOULD BE REDEEMED BUT ISN'T!`);
      }
      console.log('');
    });
    
    // Check reservations
    const reservations = await sql`
      SELECT 
        r.*,
        g.code as gift_card_code
      FROM gift_card_reservations r
      JOIN gift_cards g ON r.gift_card_id = g.id
      WHERE r.status = 'active'
      ORDER BY r.created_at DESC
    `;
    
    console.log(`🎫 Active reservations: ${reservations.length}\n`);
    
    reservations.forEach(res => {
      const amount = (res.reserved_amount / 100).toFixed(2);
      console.log(`- ${res.gift_card_code}: $${amount} reserved (Session: ${res.session_id})`);
    });
    
    await sql.end();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkGiftCardStatuses();
