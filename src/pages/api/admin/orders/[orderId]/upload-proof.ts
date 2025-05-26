import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.query;
  const { file, filename } = req.body;

  if (!orderId) {
    return res.status(400).json({ 
      error: 'Order ID is required' 
    });
  }

  if (!file || !filename) {
    return res.status(400).json({ 
      error: 'File and filename are required' 
    });
  }

  try {
    // Validate file type
    if (!filename.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ 
        error: 'Only PDF files are allowed' 
      });
    }

    // Convert base64 to buffer
    const base64Data = file.split(',')[1]; // Remove data:application/pdf;base64, prefix
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Validate file size (10MB limit)
    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        error: 'File size must be less than 10MB' 
      });
    }

    // Create structured filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const structuredFilename = `${timestamp}_${filename}`;

    // Upload to Vercel Blob
    const blob = await put(`proofs/${orderId}/${structuredFilename}`, fileBuffer, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log(`PDF uploaded successfully for order ${orderId}: ${blob.url}`);

    return res.status(200).json({
      success: true,
      url: blob.url,
      filename: structuredFilename,
      orderId,
      size: fileBuffer.length
    });

  } catch (error) {
    console.error('Error uploading proof PDF:', error);
    return res.status(500).json({ 
      error: 'Failed to upload PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Increase the body size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
