import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:9000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { bookId, pageNumber } = req.query;

  if (!bookId || Array.isArray(bookId) || !pageNumber || Array.isArray(pageNumber)) {
    return res.status(400).json({ message: 'Invalid book ID or page number' });
  }

  try {
    console.log(`Fetching image for book ID: ${bookId}, page: ${pageNumber}`);
    
    // Forward the request to the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/api/books/${bookId}/pages/${pageNumber}/image`);

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI service error response:', {
        status: aiResponse.status,
        statusText: aiResponse.statusText,
        body: errorText
      });
      throw new Error(`AI service error: ${aiResponse.status} ${aiResponse.statusText}`);
    }

    // Get the content type from the AI service response
    const contentType = aiResponse.headers.get('content-type');
    
    // Set the content type in our response
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Get the image data as a buffer
    const imageBuffer = await aiResponse.buffer();
    
    // Send the image data
    console.log(`Successfully fetched image for book ID: ${bookId}, page: ${pageNumber}`);
    res.send(imageBuffer);
  } catch (error: unknown) {
    console.error(`Error fetching image for book ID ${bookId}, page ${pageNumber}:`, error);
    return res.status(500).json({ message: error instanceof Error ? error.message : String(error) || 'Internal server error' });
  }
}
