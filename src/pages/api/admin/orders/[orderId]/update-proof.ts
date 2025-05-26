import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;
    const { proofUrl, status = 'uploaded', revisionCount = 0 } = req.body;

    if (!orderId || !proofUrl) {
      return res.status(400).json({ error: 'Order ID and proof URL are required' });
    }
    
    // Ensure orderId is a string
    const orderIdString = Array.isArray(orderId) ? orderId[0] : orderId;

    // TODO: In a real implementation, this would update the database
    // For example:
    // await db.collection('orders').updateOne(
    //   { id: orderIdString },
    //   { $set: { 
    //     'proof.url': proofUrl,
    //     'proof.status': status,
    //     'proof.uploadedAt': new Date().toISOString(),
    //     'proof.revisionCount': revisionCount
    //   }}
    // );
    
    // For now, we'll simulate a successful update
    const updatedProof = {
      url: proofUrl,
      status,
      uploadedAt: new Date().toISOString(),
      revisionCount: parseInt(revisionCount.toString(), 10),
      lastUpdated: new Date().toISOString()
    };

    console.log(`Updated proof for order ${orderIdString}:`, updatedProof);
    console.log(`Revision count: ${revisionCount}`);

    res.status(200).json({ 
      success: true, 
      proof: updatedProof,
      isRevision: revisionCount > 0
    });

  } catch (error) {
    console.error('Error updating proof:', error);
    res.status(500).json({ error: 'Failed to update proof' });
  }
}
