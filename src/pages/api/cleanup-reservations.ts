import { NextApiRequest, NextApiResponse } from 'next';
import { cleanupExpiredReservations } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧹 Starting cleanup of expired gift card reservations...');
    
    const expiredCount = await cleanupExpiredReservations();
    
    console.log(`✅ Cleanup completed. ${expiredCount} expired reservations cleaned up.`);
    
    res.status(200).json({ 
      success: true, 
      message: `Cleaned up ${expiredCount} expired reservations`,
      expiredCount 
    });
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    res.status(500).json({ 
      error: 'Failed to cleanup expired reservations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
