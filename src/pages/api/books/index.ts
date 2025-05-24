import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:9000';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Define types for formidable files
interface FormidableFile {
  filepath: string;
  originalFilename?: string;
  mimetype?: string;
  [key: string]: unknown;
}

type FormidableFiles = {
  [key: string]: FormidableFile | FormidableFile[];
};

type FormidableFields = {
  [key: string]: string | string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('--- API HANDLER /api/books INVOKED ---', new Date().toISOString());
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Received request to /api/books');
    
    // Parse the incoming form data
    const { fields, files } = await parseFormData(req);
    
    console.log('Parsed form data:', { 
      fieldKeys: Object.keys(fields),
      fileKeys: Object.keys(files)
    });
    
    // Create a new form data to forward to the AI service
    const formData = new FormData();
    
    // Add all fields
    Object.keys(fields).forEach(key => {
      const valueArray = fields[key] as string[];
      const baseKey = key.replace(/_\d+$/, ''); // Remove trailing _index if present

      if (valueArray && valueArray.length > 0) {
        if (valueArray.length === 1) {
          // For single-value fields (formidable might add _0, so use baseKey)
          formData.append(baseKey, valueArray[0]);
        } else {
          // For actual multi-value fields, append each value with the same baseKey
          valueArray.forEach(v => {
            formData.append(baseKey, v);
          });
        }
      }
    });
    
    // Add all files PRESERVING ORIGINAL KEYS (Simplified)
    for (const key in files) {
      const fileEntry = files[key];
      // formidable usually returns a single File object for keys like 'field[0]', 'field[1]'
      // If it's an array (less likely here), take the first file.
      const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

      if (file) {
        console.log(`Appending file: key='${key}'`);
        formData.append(key, fs.createReadStream(file.filepath), {
          filename: file.originalFilename || 'file',
          contentType: file.mimetype || 'application/octet-stream',
        });
      } else {
        console.warn(`Skipping empty file entry for key: ${key}`);
      }
    }
    
    console.log('Forwarding request to AI service:', `${AI_SERVICE_URL}/api/books`);
    
    // Forward the request to the AI service
    const aiResponse = await fetch(`${AI_SERVICE_URL}/api/books`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

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
    console.log('Successful response from AI service');
    return res.status(200).json(data);
  } catch (error: unknown) {
    console.error('Error proxying request to AI service:', error);
    return res.status(500).json({ message: error instanceof Error ? error.message : String(error) || 'Internal server error' });
  }
}

// Helper function to parse form data
function parseFormData(req: NextApiRequest): Promise<{ fields: FormidableFields; files: FormidableFiles }> {
  return new Promise((resolve, reject) => {
    const options = {
      multiples: true,
      keepExtensions: true,
    };
    
    const form = formidable(options);
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      // Cast the types to our custom interfaces
      resolve({ 
        fields: fields as unknown as FormidableFields, 
        files: files as unknown as FormidableFiles 
      });
    });
  });
}
