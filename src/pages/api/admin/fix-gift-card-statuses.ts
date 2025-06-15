import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { fixGiftCardStatuses } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email || session.user.email !== 'tim@customheroes.ai') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🔧 Admin requested gift card status fix...');
    
    const fixedCount = await fixGiftCardStatuses();
    
    console.log(`✅ Gift card status fix completed. ${fixedCount} statuses updated.`);
    
    res.status(200).json({ 
      success: true, 
      message: `Fixed ${fixedCount} gift card statuses`,
      fixedCount 
    });
  } catch (error) {
    console.error('❌ Error during gift card status fix:', error);
    res.status(500).json({ 
      error: 'Failed to fix gift card statuses',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
