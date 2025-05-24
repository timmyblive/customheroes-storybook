import { useState, useRef, FormEvent } from 'react';
import Layout from '../../components/layout/Layout';
import { createBook, getBookStatus, getBook, getPageImageUrl } from '../../utils/bookService';

// Types for our component state
interface BookState {
  bookId: string | null;
  status: 'idle' | 'submitting' | 'processing' | 'completed' | 'failed';
  progress: number;
  error: string | null;
  bookData: any | null;
}

interface FormData {
  childName: string;
  childAge: string;
  theme: string;
  interests: string;
  characterDescription: string;
  styleReferencePhoto: File | null;
}

const availableStyles = [
  { name: 'Animated', path: '/styles/Animated.png' },
  { name: 'Cartoon', path: '/styles/Cartoon.png' },
  { name: 'Fantasy', path: '/styles/Fantasy.png' },
  { name: 'Sketch', path: '/styles/Sketch.png' },
  { name: 'Vintage', path: '/styles/Vintage.png' },
  { name: 'Watercolor', path: '/styles/Watercolor.png' },
];

export default function TestBookCreation() {
  // Form state
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('7');
  const [theme, setTheme] = useState('adventure');
  const [interests, setInterests] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  
  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Book generation state
  const [bookState, setBookState] = useState<BookState>({
    bookId: null,
    status: 'idle',
    progress: 0,
    error: null,
    bookData: null
  });
  
  // Status polling interval
  const [statusInterval, setStatusInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Selected style image path
  const [selectedStylePath, setSelectedStylePath] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      // Update state to show we're submitting
      setBookState({
        ...bookState,
        status: 'submitting',
        progress: 0,
        error: null,
        bookData: null
      });
      
      // Create form data
      const formData = new FormData();
      formData.append('child_name', childName);
      formData.append('child_age', childAge);
      formData.append('theme', theme);
      formData.append('interests', interests);
      formData.append('character_description', characterDescription);
      
      // Add photo if selected
      if (fileInputRef.current?.files?.[0]) {
        formData.append('photo', fileInputRef.current.files[0]);
      }
      
      // Add selected style reference photo
      if (selectedStylePath) {
        try {
          const response = await fetch(selectedStylePath);
          const blob = await response.blob();
          const fileName = selectedStylePath.split('/').pop() || 'style-reference.png';
          const styleFile = new File([blob], fileName, { type: blob.type });
          formData.append('styleReferencePhoto', styleFile);
        } catch (error: any) {
          console.error('Error fetching or processing style image:', error);
          setBookState({
            ...bookState,
            status: 'failed',
            error: 'Failed to process selected style image'
          });
          return;
        }
      }
      
      // Submit to API
      const result = await createBook(formData);
      
      // Update state with book ID
      setBookState({
        ...bookState,
        bookId: result.bookId,
        status: 'processing',
      });
      
      // Start polling for status
      const interval = setInterval(async () => {
        if (!result.bookId) return;
        
        try {
          const status = await getBookStatus(result.bookId);
          
          // Update progress
          setBookState(prev => ({
            ...prev,
            progress: status.progress,
            status: status.status as any
          }));
          
          // If completed or failed, stop polling and get book data
          if (status.status === 'completed') {
            clearInterval(interval);
            setStatusInterval(null);
            
            // Get the complete book data
            const bookData = await getBook(result.bookId);
            setBookState(prev => ({
              ...prev,
              bookData
            }));
          } else if (status.status === 'failed') {
            clearInterval(interval);
            setStatusInterval(null);
            setBookState(prev => ({
              ...prev,
              error: 'Book generation failed'
            }));
          }
        } catch (error) {
          console.error('Error polling status:', error);
        }
      }, 2000); // Poll every 2 seconds
      
      setStatusInterval(interval);
      
    } catch (error: any) {
      setBookState({
        ...bookState,
        status: 'failed',
        error: error.message || 'An error occurred'
      });
    }
  };
  
  // Clean up interval on unmount
  useState(() => {
    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [statusInterval]);
  
  return (
    <Layout title="Test Book Creation - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-paper-white rounded-card shadow-level-3 p-8">
            <h1 className="font-montserrat font-bold text-3xl mb-6 text-inkwell-black">
              Test Book Creation
            </h1>
            
            {/* Book creation form */}
            {bookState.status === 'idle' || bookState.status === 'submitting' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Child's Age
                  </label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Story Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="adventure">Adventure</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="space">Space</option>
                    <option value="underwater">Underwater</option>
                    <option value="dinosaur">Dinosaur</option>
                    <option value="fairy tale">Fairy Tale</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Child's Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., dragons, soccer, painting"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Child's Appearance (for illustrations)
                  </label>
                  <textarea
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="e.g., a 7-year-old girl with curly brown hair and green eyes, wearing a blue dress"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Illustration Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {availableStyles.map((style) => (
                      <div
                        key={style.path}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${selectedStylePath === style.path ? 'border-primary scale-105 shadow-lg' : 'border-transparent hover:border-muted-foreground/50'}`}
                        onClick={() => setSelectedStylePath(style.path === selectedStylePath ? null : style.path)}
                        title={`Select ${style.name} style`}
                      >
                        <div className="relative aspect-square"> {/* Maintain aspect ratio */}
                          <img
                            src={style.path} // Use path from public/styles
                            alt={`${style.name} Style Preview`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className={`text-center text-sm py-1 ${selectedStylePath === style.path ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                          {style.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-charcoal font-medium mb-2">
                    Child's Photo (optional)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will help create more personalized illustrations
                  </p>
                </div>
                
                <button
                  type="submit"
                  className="bg-story-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={bookState.status === 'submitting'}
                >
                  {bookState.status === 'submitting' ? 'Creating...' : 'Create Book'}
                </button>
              </form>
            ) : null}
            
            {/* Processing state */}
            {bookState.status === 'processing' && (
              <div className="text-center py-8">
                <h2 className="font-montserrat font-bold text-2xl mb-4 text-inkwell-black">
                  Creating Your Book...
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-story-blue h-4 rounded-full"
                    style={{ width: `${bookState.progress}%` }}
                  ></div>
                </div>
                <p className="text-charcoal">
                  {bookState.progress < 50
                    ? "Writing your personalized story..."
                    : "Creating magical illustrations..."}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  This may take a few minutes. Please don't close this page.
                </p>
              </div>
            )}
            
            {/* Error state */}
            {bookState.status === 'failed' && (
              <div className="text-center py-8">
                <h2 className="font-montserrat font-bold text-2xl mb-4 text-red-600">
                  Something Went Wrong
                </h2>
                <p className="text-charcoal mb-6">
                  {bookState.error || "We couldn't create your book. Please try again."}
                </p>
                <button
                  onClick={() => setBookState({
                    bookId: null,
                    status: 'idle',
                    progress: 0,
                    error: null,
                    bookData: null
                  })}
                  className="bg-story-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {/* Completed state - show the book */}
            {bookState.status === 'completed' && bookState.bookData && (
              <div className="py-8">
                <h2 className="font-montserrat font-bold text-2xl mb-6 text-inkwell-black text-center">
                  {bookState.bookData.title || "Your Personalized Book"}
                </h2>
                
                <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                  {bookState.bookData.pages?.map((page: any) => (
                    <div key={page.page_number} className="bg-white rounded-lg shadow-level-2 overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                        {page.illustration_path ? (
                          <img
                            src={getPageImageUrl(bookState.bookId!, page.page_number)}
                            alt={`Page ${page.page_number}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No illustration available</p>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-charcoal">{page.text}</p>
                        <p className="text-sm text-gray-500 mt-2">Page {page.page_number}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setBookState({
                      bookId: null,
                      status: 'idle',
                      progress: 0,
                      error: null,
                      bookData: null
                    })}
                    className="bg-story-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Another Book
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
