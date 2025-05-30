import { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import formidable from 'formidable';
import { createReadStream } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => mimetype?.startsWith('image/') || false,
    });

    const [fields, files] = await form.parse(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate file type
    if (!imageFile.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = imageFile.originalFilename || 'image';
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `character-${timestamp}.${extension}`;

    // Read file and upload to Vercel Blob
    const fileStream = createReadStream(imageFile.filepath);
    const blob = await put(filename, fileStream, {
      access: 'public',
      contentType: imageFile.mimetype,
    });

    // Clean up temporary file
    try {
      const fs = await import('fs');
      fs.unlinkSync(imageFile.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary file:', cleanupError);
    }

    res.status(200).json({
      success: true,
      url: blob.url,
      filename: filename,
      size: imageFile.size,
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
