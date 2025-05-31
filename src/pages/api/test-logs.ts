import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Log environment variables
    console.log('Environment variables check:');
    console.log('- NEXT_PUBLIC_AI_SERVICE_URL:', process.env.NEXT_PUBLIC_AI_SERVICE_URL);
    console.log('- STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Return environment info
    res.status(200).json({
      success: true,
      environment: {
        nextPublicAiServiceUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'not set',
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
        deploymentUrl: req.headers.host,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test logs error:', error);
    res.status(500).json({ error: 'Test logs failed', details: error });
  }
}
