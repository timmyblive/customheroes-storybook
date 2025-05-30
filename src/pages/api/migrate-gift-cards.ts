import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Create gift_cards table
    await sql`
      CREATE TABLE IF NOT EXISTS gift_cards (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        initial_amount INTEGER NOT NULL,
        remaining_amount INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE,
        recipient_email VARCHAR(255),
        recipient_name VARCHAR(255),
        sender_name VARCHAR(255),
        sender_email VARCHAR(255),
        message TEXT,
        last_used_at TIMESTAMP WITH TIME ZONE,
        stripe_payment_id VARCHAR(255)
      )
    `;

    // Create gift_card_transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS gift_card_transactions (
        id SERIAL PRIMARY KEY,
        gift_card_id INTEGER REFERENCES gift_cards(id),
        order_id VARCHAR(255),
        amount INTEGER NOT NULL,
        transaction_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return res.status(200).json({ message: 'Gift card tables created successfully' });
  } catch (error) {
    console.error('Error creating gift card tables:', error);
    return res.status(500).json({ error: 'Failed to create gift card tables' });
  }
}
