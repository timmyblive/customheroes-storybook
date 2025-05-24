import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import TextArea from '../../components/ui/TextArea';
import ProgressBar from '../../components/ui/ProgressBar';
import Card from '../../components/ui/Card';
import ErrorMessage from '../../components/ui/ErrorMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Image from 'next/image';
import { getBook, getPageImageUrl } from '../../utils/bookService';

interface Page {
  id: number;
  text: string;
  image: string;
  // Add other potential page properties if known, e.g., pageNumber: number;
}

interface Story {
  title: string;
  coverImage?: string; // Optional if not always present initially
  pages: Page[];
  // Add other potential story properties, e.g., author: string, genre: string etc.
}

// Define the steps for the creation process
const steps = [
  { title: 'Upload Photos' },
  { title: 'Describe Story' },
  { title: 'Preview & Edit' },
  { title: 'Customize Book' },
  { title: 'Review & Order' }
];

// Mock data for demonstration
const mockStory = {
  title: "Emma's Magical Adventure",
  pages: [
    {
      id: 1,
      text: "Once upon a time, there was a brave girl named Emma. She lived in a cozy house with her family and her fluffy cat, Whiskers.",
      image: "/globe.svg"
    },
    {
      id: 2,
      text: "One sunny morning, Emma discovered a mysterious map in her backyard. The map showed a path to a magical forest that no one had ever seen before.",
      image: "/globe.svg"
    },
    {
      id: 3,
      text: "Emma decided to follow the map. She packed her backpack with snacks, a water bottle, and her favorite teddy bear for company.",
      image: "/globe.svg"
    },
    {
      id: 4,
      text: "As Emma entered the forest, the trees seemed to whisper her name. Colorful butterflies guided her deeper into the magical woods.",
      image: "/globe.svg"
    },
    {
      id: 5,
      text: "Suddenly, Emma met a friendly talking fox with bright blue eyes. 'Hello, Emma!' said the fox. 'I've been waiting for you!'",
      image: "/globe.svg"
    }
  ]
};

export default function StoryPreview() {
  const router = useRouter();
  const { bookId } = router.query;
  
  const [currentStep] = useState(3); // Preview & Edit is step 3
  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch book data when component mounts and bookId is available
  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          setIsLoadingBook(true);
          setError(null);
          const bookData = await getBook(bookId as string);
          setStory(bookData);
          setIsLoadingBook(false);
        } catch (err: unknown) {
          console.error('Error fetching book:', err);
          setError(err instanceof Error ? err.message : String(err) || 'Failed to load book data');
          setIsLoadingBook(false);
        }
      };
      
      fetchBook();
    } else if (!router.isReady) {
      // Router not ready yet, wait for it
    } else {
      // No bookId in URL, use mock data for development/testing
      setStory(mockStory);
      setIsLoadingBook(false);
    }
  }, [bookId, router.isReady]);
  
  // Initialize edited text when current page changes
  useEffect(() => {
    if (story?.pages?.[currentPage]) {
      setEditedText(story.pages[currentPage].text);
    }
  }, [currentPage, story?.pages]);

  // Handle text edit
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
  };

  // Save edited text
  const saveEdit = () => {
    if (!story) return;
    
    const updatedPages = [...story.pages];
    updatedPages[currentPage] = {
      ...updatedPages[currentPage],
      text: editedText
    };
    
    setStory({
      ...story,
      pages: updatedPages
    });
    
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEdit = () => {
    if (story?.pages?.[currentPage]) {
      setEditedText(story.pages[currentPage].text);
    }
    setIsEditing(false);
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to next page
  const nextPage = () => {
    if (story && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Regenerate current page
  const regeneratePage = () => {
    if (!story || !bookId) return;
    
    setIsRegenerating(true);
    
    // In a real implementation, this would call an API to regenerate the page
    // For now, we'll just simulate it
    setTimeout(() => {
      const updatedPages = [...story.pages];
      updatedPages[currentPage] = {
        ...updatedPages[currentPage],
        text: "This is a newly generated text for this page. The AI has created a different version based on your story description and characters."
      };
      
      setStory({
        ...story,
        pages: updatedPages
      });
      
      setEditedText(updatedPages[currentPage].text);
      setIsRegenerating(false);
    }, 2000);
  };

  // Continue to next step
  const handleContinue = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (bookId) {
        window.location.href = `/create/customize?bookId=${bookId}`;
      } else {
        window.location.href = '/create/customize';
      }
    }, 1500);
  };

  return (
    <Layout title="Preview Your Story - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-paper-white rounded-card shadow-level-3 overflow-hidden">
            {/* Header */}
            <div className="bg-brand-gradient text-white px-6 py-4 flex justify-between items-center">
              <h1 className="font-montserrat font-semibold text-lg">Create Your Storybook</h1>
              <span className="text-sm">Project #{bookId || Math.floor(Math.random() * 90000) + 10000}</span>
            </div>
            
            {/* Progress Bar */}
            <ProgressBar steps={steps} currentStep={currentStep} />
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="font-montserrat font-bold text-2xl mb-3 text-inkwell-black">
                  Step 3: Preview & Edit Your Story
                </h2>
                <p className="text-charcoal mb-6">
                  Review your personalized story and make any edits you&apos;d like. You can edit the text or regenerate any page.
                </p>
                
                {isLoadingBook ? (
                  <LoadingSpinner 
                    size="lg" 
                    message="Loading your story..." 
                    className="py-12" 
                  />
                ) : error ? (
                  <ErrorMessage 
                    title="Error Loading Story"
                    message={error}
                    actionText="Return to Creation"
                    onAction={() => router.push('/create')}
                    className="py-12"
                  />
                ) : story ? (
                  <>
                    {/* Story Title */}
                    <div className="mb-8 text-center">
                      <h3 className="font-literata font-bold text-3xl text-inkwell-black">{story.title}</h3>
                    </div>
                
                    {/* Story Preview */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                      {/* Page Image */}
                      <div className="lg:w-1/2">
                        <div className="bg-white rounded-card shadow-level-2 p-2 relative">
                          <Image 
                            src={bookId ? getPageImageUrl(bookId as string, story.pages[currentPage].id || currentPage + 1) : story.pages[currentPage].image} 
                            alt={`Page ${currentPage + 1}`} 
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={regeneratePage}
                            disabled={isRegenerating}
                          >
                            {isRegenerating ? 'Regenerating...' : 'Regenerate Image'}
                          </Button>
                          <span className="text-charcoal">
                            Page {currentPage + 1} of {story.pages.length}
                          </span>
                        </div>
                      </div>
                  
                      {/* Page Text */}
                      <div className="lg:w-1/2">
                        <Card className="h-full">
                          {isEditing ? (
                            <div className="h-full flex flex-col">
                              <TextArea
                                id="pageText"
                                value={editedText}
                                onChange={handleTextChange}
                                rows={8}
                                className="flex-grow"
                              />
                              <div className="mt-4 flex justify-end gap-2">
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={saveEdit}
                                >
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col">
                              <div className="flex-grow">
                                <p className="font-literata text-lg leading-relaxed">
                                  {story.pages[currentPage].text}
                                </p>
                              </div>
                              <div className="mt-4 flex justify-between items-center">
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  onClick={() => setIsEditing(true)}
                                >
                                  Edit Text
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  onClick={regeneratePage}
                                  disabled={isRegenerating}
                                >
                                  {isRegenerating ? 'Regenerating...' : 'Regenerate Text'}
                                </Button>
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mb-8">
                      <Button 
                        variant="secondary" 
                        onClick={prevPage}
                        disabled={currentPage === 0}
                      >
                        Previous Page
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={nextPage}
                        disabled={currentPage === story.pages.length - 1}
                      >
                        Next Page
                      </Button>
                    </div>
                    
                    {/* Story Controls */}
                    <div className="bg-blue-50 border border-story-blue/20 rounded-md p-4 mb-8">
                      <h4 className="font-semibold mb-2">Story Controls:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center"
                        >
                          <i className="fas fa-plus mr-2"></i>
                          Add Page
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center"
                          disabled={story?.pages?.length <= 1}
                        >
                          <i className="fas fa-trash-alt mr-2"></i>
                          Delete Page
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center"
                        >
                          <i className="fas fa-redo-alt mr-2"></i>
                          Regenerate All
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Edit Title
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-charcoal">No story data available.</p>
                  </div>
                )}
                
                {/* Continue Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                  <Button 
                    variant="secondary" 
                    href="/create"
                  >
                    Back to Story Details
                  </Button>
                  
                  <Button 
                    onClick={handleContinue}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Continue to Customize'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}