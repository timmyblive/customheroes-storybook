/**
 * Next.js component example for integrating with the Children's Book Generator ADK Agent.
 * 
 * This file would be placed in your Next.js project at:
 * /components/BookGenerator.jsx
 */

import { useState } from 'react';
import Image from 'next/image';

const BookGenerator = () => {
  // State for form inputs
  const [characterPhotos, setCharacterPhotos] = useState([]);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('6-8');
  const [selectedTheme, setSelectedTheme] = useState('adventure');
  const [selectedPageCount, setSelectedPageCount] = useState(10);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookPreview, setBookPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: Loading, 3: Preview
  
  // Handle character photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a blob URL for the file (in a real app, you'd upload this to a server)
    const url = URL.createObjectURL(file);
    
    // Add the photo to the list
    setCharacterPhotos([
      ...characterPhotos,
      {
        file,
        url,
        name: '',
        relationship: ''
      }
    ]);
  };
  
  // Handle character name and relationship change
  const handleCharacterChange = (index, field, value) => {
    const updatedPhotos = [...characterPhotos];
    updatedPhotos[index][field] = value;
    setCharacterPhotos(updatedPhotos);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (characterPhotos.length === 0) {
      setError('Please add at least one character photo');
      return;
    }
    
    if (characterPhotos.some(photo => !photo.name)) {
      setError('Please provide a name for each character');
      return;
    }
    
    if (!storyDescription) {
      setError('Please provide a story description');
      return;
    }
    
    // Clear error and set loading state
    setError(null);
    setIsLoading(true);
    setCurrentStep(2);
    
    try {
      // Prepare the payload
      const payload = {
        characterPhotos: characterPhotos.map(p => ({
          url: p.url, // In a real app, this would be a URL to the uploaded image
          name: p.name,
          relationship: p.relationship
        })),
        storyDescription,
        selectedAgeGroup,
        selectedTheme,
        selectedPageCount: parseInt(selectedPageCount, 10)
      };
      
      // Call the API route
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate story');
      }
      
      // Get the book preview
      const data = await response.json();
      setBookPreview(data);
      
      // Move to the preview step
      setCurrentStep(3);
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error.message || 'Failed to generate story');
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render the input form
  const renderInputForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Character Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characterPhotos.map((photo, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="relative w-full h-40 mb-2">
                <Image
                  src={photo.url}
                  alt={photo.name || 'Character'}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
              <input
                type="text"
                placeholder="Character Name"
                value={photo.name}
                onChange={(e) => handleCharacterChange(index, 'name', e.target.value)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="text"
                placeholder="Relationship (optional)"
                value={photo.relationship}
                onChange={(e) => handleCharacterChange(index, 'relationship', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <div className="border border-dashed p-4 rounded-lg flex items-center justify-center">
            <label className="cursor-pointer text-center">
              <div className="text-4xl mb-2">+</div>
              <div>Add Character</div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Story Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Story Description</label>
            <textarea
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Describe the story you want to create..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Age Group</label>
              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="3-5">3-5 years</option>
                <option value="6-8">6-8 years</option>
                <option value="9-12">9-12 years</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="adventure">Adventure</option>
                <option value="friendship">Friendship</option>
                <option value="learning">Learning</option>
                <option value="family">Family</option>
                <option value="nature">Nature</option>
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Science Fiction</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Page Count</label>
              <select
                value={selectedPageCount}
                onChange={(e) => setSelectedPageCount(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="5">5 pages</option>
                <option value="10">10 pages</option>
                <option value="15">15 pages</option>
                <option value="20">20 pages</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Generate Book Preview
        </button>
      </div>
    </form>
  );
  
  // Render the loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <h2 className="text-xl font-semibold">Generating Your Book...</h2>
      <p className="text-gray-500 mt-2">This may take a minute or two.</p>
    </div>
  );
  
  // Render the book preview
  const renderBookPreview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{bookPreview.title}</h2>
        <button
          onClick={() => setCurrentStep(1)}
          className="text-blue-500 hover:text-blue-600"
        >
          Edit Story
        </button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full h-64">
          <Image
            src={bookPreview.coverImageUrl}
            alt={bookPreview.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      
      <div className="space-y-8">
        {bookPreview.pages.map((page) => (
          <div key={page.pageNumber} className="border rounded-lg overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Page {page.pageNumber}</h3>
              <p>{page.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      {bookPreview.previewUrl && (
        <div className="flex justify-center">
          <a
            href={bookPreview.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            View Full Preview
          </a>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Children's Book Generator</h1>
      
      {currentStep === 1 && renderInputForm()}
      {currentStep === 2 && renderLoading()}
      {currentStep === 3 && renderBookPreview()}
    </div>
  );
};

export default BookGenerator;

