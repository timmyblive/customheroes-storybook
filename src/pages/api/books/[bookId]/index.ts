import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:9000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { bookId } = req.query;

  if (!bookId || Array.isArray(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  try {
    console.log(`Fetching book data for book ID: ${bookId}`);
    
    // Forward the request to the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/api/books/${bookId}`);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI service error response:', {
        status: aiResponse.status,
        statusText: aiResponse.statusText,
        body: errorText
      });
      throw new Error(`AI service error: ${aiResponse.status} ${aiResponse.statusText}`);
    }

    const data = await aiResponse.json();
    console.log(`Successfully fetched book data for book ID: ${bookId}`);
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error(`Error fetching book data for book ID ${bookId}:`, error);
    return res.status(500).json({ message: error instanceof Error ? error.message : String(error) || 'Internal server error' });
  }
}
