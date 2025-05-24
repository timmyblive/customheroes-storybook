/**
 * Next.js API route example for integrating with the Children's Book Generator ADK Agent.
 * 
 * This file would be placed in your Next.js project at:
 * /pages/api/generate-story.js
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the request data
    const {
      characterPhotos,
      storyDescription,
      selectedAgeGroup,
      selectedTheme,
      selectedPageCount,
    } = req.body;

    // Validate the request data
    if (!characterPhotos || !storyDescription || !selectedAgeGroup || !selectedTheme || !selectedPageCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Log the request
    console.log('Generating story with the following parameters:');
    console.log(`- Age Group: ${selectedAgeGroup}`);
    console.log(`- Theme: ${selectedTheme}`);
    console.log(`- Page Count: ${selectedPageCount}`);
    console.log(`- Characters: ${characterPhotos.map(p => p.name).join(', ')}`);

    // Call the ADK agent API
    const response = await fetch('http://localhost:3000/api/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        characterPhotos,
        storyDescription,
        selectedAgeGroup,
        selectedTheme,
        selectedPageCount,
      }),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate story');
    }

    // Get the response data
    const bookPreview = await response.json();

    // Return the book preview
    return res.status(200).json(bookPreview);
  } catch (error) {
    console.error('Error generating story:', error);
    return res.status(500).json({ error: 'Failed to generate story', details: error.message });
  }
}
