import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import OptionCard from '../../components/ui/OptionCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Image from 'next/image';
import Card from '../../components/ui/Card';
import ErrorMessage from '../../components/ui/ErrorMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getBook, BookData } from '../../utils/bookService'; // Import BookData

// Define the steps for the creation process
const steps = [
  { title: 'Upload Photos' },
  { title: 'Describe Story' },
  { title: 'Preview & Edit' },
  { title: 'Customize Book' },
  { title: 'Review & Order' }
];

// mockStory is no longer used for initial state typing directly
// const mockStory = {
//   title: "Emma's Magical Adventure",
//   coverImage: "/file.svg"
// };

export default function CustomizeBook() {
  const router = useRouter();
  const { bookId } = router.query;
  
  const [currentStep] = useState(4); // Customize Book is step 4
  const [story, setStory] = useState<BookData | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [selectedCover, setSelectedCover] = useState('hardcover');
  const [selectedSize, setSelectedSize] = useState('standard');
  const [selectedPaper, setSelectedPaper] = useState('premium');
  const [selectedFinish, setSelectedFinish] = useState('matte');
  const [quantity, setQuantity] = useState(1);
  const [pageCount, setPageCount] = useState(10); // Added pageCount
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    bookTitle: '',
    quantity: ''
  });

  // Calculate price based on selections
  const calculatePrice = () => {
    let basePrice = 24.99; // Standard softcover price
    
    // Cover type
    if (selectedCover === 'hardcover') {
      basePrice += 5.00;
    } else if (selectedCover === 'premium-hardcover') {
      basePrice += 10.00;
    }
    
    // Size
    if (selectedSize === 'large') {
      basePrice += 5.00;
    }
    
    // Paper quality
    if (selectedPaper === 'premium') {
      basePrice += 3.00;
    } else if (selectedPaper === 'archival') {
      basePrice += 7.00;
    }
    
    // Finish
    if (selectedFinish === 'glossy') {
      basePrice += 2.00;
    }
    
    return basePrice * quantity;
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!bookTitle.trim()) {
      newErrors.bookTitle = 'Book title is required';
      isValid = false;
    } else {
      newErrors.bookTitle = '';
    }
    
    if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
      isValid = false;
    } else {
      newErrors.quantity = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Fetch book data when component mounts and bookId is available
  useEffect(() => {
    if (bookId && typeof bookId === 'string') {
      const fetchBook = async () => {
        try {
          setIsLoadingBook(true);
          setError(null);
          // Import and use getBook from bookService
          const { getBook } = await import('../../utils/bookService');
          const bookData: BookData = await getBook(bookId as string);
          setStory(bookData);
          setBookTitle(bookData.title);
          setIsLoadingBook(false);
        } catch (err: unknown) {
          console.error('Error fetching book:', err);
          setError(err instanceof Error ? err.message : String(err) || 'Failed to load book data');
          setIsLoadingBook(false);
        }
      };
      
      fetchBook();
    }
  }, [bookId]);

  // Handle continue to next step
  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (bookId) {
        window.location.href = `/create/review?bookId=${bookId}`;
      } else {
        window.location.href = '/create/review';
      }
    }, 1500);
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuantity(value);
    }
  };

  // Handle page count change
  const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setPageCount(value);
    }
  };

  return (
    <Layout title="Customize Your Book - CustomHereos">
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
                  Step 4: Customize Your Book
                </h2>
                <p className="text-charcoal mb-6">
                  Choose the physical characteristics of your book, such as cover type, size, and paper quality.
                </p>
                
                {isLoadingBook ? (
                  <LoadingSpinner 
                    size="lg" 
                    message="Loading your book data..." 
                    className="py-12" 
                  />
                ) : error ? (
                  <ErrorMessage 
                    title="Error Loading Book"
                    message={error}
                    actionText="Return to Creation"
                    onAction={() => router.push('/create')}
                    className="py-12"
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Book Preview */}
                    <div className="lg:col-span-1">
                      <Card className="sticky top-24">
                        <div className="text-center mb-4">
                          <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mb-2">Book Preview</h3>
                        </div>
                        
                        <div className="relative mb-6 mx-auto" style={{ maxWidth: '250px' }}>
                          <div className={`relative ${
                            selectedCover === 'hardcover' || selectedCover === 'premium-hardcover' 
                              ? 'p-2' 
                              : 'p-1'
                          }`}>
                            <Image 
                              src={story?.coverImage || ''} 
                              alt={bookTitle || story?.title || "Book Cover"} 
                              layout="fill"
                              objectFit="contain"
                              className="rounded-md shadow-level-3"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 p-3 rounded-md">
                                <h4 className="font-literata font-bold text-white text-center">
                                  {bookTitle}
                                </h4>
                              </div>
                            </div>
                          </div>
                          
                          {/* Book spine effect */}
                          {(selectedCover === 'hardcover' || selectedCover === 'premium-hardcover') && (
                            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gray-700 rounded-l-sm"></div>
                          )}
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h4 className="font-semibold mb-2">Your Selections:</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span>Cover Type:</span>
                              <span className="font-medium">
                                {selectedCover === 'softcover' ? 'Softcover' : 
                                 selectedCover === 'hardcover' ? 'Hardcover' : 
                                 'Premium Hardcover'}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Book Size:</span>
                              <span className="font-medium">
                                {selectedSize === 'standard' ? 'Standard (8" x 8")' : 'Large (10" x 10")'}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Paper Quality:</span>
                              <span className="font-medium">
                                {selectedPaper === 'standard' ? 'Standard' : 
                                 selectedPaper === 'premium' ? 'Premium' : 
                                 'Archival'}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Page Finish:</span>
                              <span className="font-medium">
                                {selectedFinish === 'matte' ? 'Matte' : 'Glossy'}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span>Quantity:</span>
                              <span className="font-medium">{quantity}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Page Count:</span>
                              <span className="font-medium">{pageCount}</span>
                            </li>
                          </ul>
                          
                          <div className="mt-4 pt-4 border-t border-blue-200">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total Price:</span>
                              <span className="font-bold text-lg">${calculatePrice().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    {/* Right Column - Customization Options */}
                    <div className="lg:col-span-2">
                      {/* Book Title */}
                      <div className="mb-6">
                        <Input
                          label="Book Title"
                          id="bookTitle"
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          error={errors.bookTitle}
                          required
                        />
                      </div>
                      
                      {/* Cover Type */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Cover Type
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <OptionCard
                            icon={<i className="fas fa-book"></i>}
                            title="Softcover"
                            description="Flexible, lightweight"
                            selected={selectedCover === 'softcover'}
                            onClick={() => setSelectedCover('softcover')}
                          />
                          <OptionCard
                            icon={<i className="fas fa-book-open"></i>}
                            title="Hardcover"
                            description="Durable, classic"
                            selected={selectedCover === 'hardcover'}
                            onClick={() => setSelectedCover('hardcover')}
                          />
                          <OptionCard
                            icon={<i className="fas fa-bookmark"></i>}
                            title="Premium Hardcover"
                            description="Luxury, fabric-bound"
                            selected={selectedCover === 'premium-hardcover'}
                            onClick={() => setSelectedCover('premium-hardcover')}
                          />
                        </div>
                      </div>
                      
                      {/* Book Size */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Book Size
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <OptionCard
                            icon={<i className="fas fa-compress-alt"></i>}
                            title="Standard"
                            description='8" x 8" - Perfect for young readers'
                            selected={selectedSize === 'standard'}
                            onClick={() => setSelectedSize('standard')}
                          />
                          <OptionCard
                            icon={<i className="fas fa-expand-alt"></i>}
                            title="Large"
                            description='10" x 10" - More immersive experience'
                            selected={selectedSize === 'large'}
                            onClick={() => setSelectedSize('large')}
                          />
                        </div>
                      </div>
                      
                      {/* Paper Quality */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Paper Quality
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <OptionCard
                            icon={<i className="fas fa-file"></i>}
                            title="Standard"
                            description="Good quality paper"
                            selected={selectedPaper === 'standard'}
                            onClick={() => setSelectedPaper('standard')}
                          />
                          <OptionCard
                            icon={<i className="fas fa-file-alt"></i>}
                            title="Premium"
                            description="Thicker, smoother pages"
                            selected={selectedPaper === 'premium'}
                            onClick={() => setSelectedPaper('premium')}
                          />
                          <OptionCard
                            icon={<i className="fas fa-scroll"></i>}
                            title="Archival"
                            description="Museum-quality, acid-free"
                            selected={selectedPaper === 'archival'}
                            onClick={() => setSelectedPaper('archival')}
                          />
                        </div>
                      </div>
                      
                      {/* Page Finish */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Page Finish
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <OptionCard
                            icon={<i className="fas fa-moon"></i>}
                            title="Matte"
                            description="Non-reflective, elegant finish"
                            selected={selectedFinish === 'matte'}
                            onClick={() => setSelectedFinish('matte')}
                          />
                          <OptionCard
                            icon={<i className="fas fa-sun"></i>}
                            title="Glossy"
                            description="Vibrant colors, shiny finish"
                            selected={selectedFinish === 'glossy'}
                            onClick={() => setSelectedFinish('glossy')}
                          />
                        </div>
                      </div>
                      
                      {/* Quantity */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Quantity
                        </label>
                        <div className="max-w-xs">
                          <Input
                            type="number"
                            id="quantity"
                            value={quantity.toString()}
                            onChange={handleQuantityChange}
                          />
                          {errors.quantity && (
                            <p className="mt-1 text-reading-red text-sm">{errors.quantity}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Page Count */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Page Count
                        </label>
                        <div className="max-w-xs">
                          <Input
                            type="number"
                            id="pageCount"
                            value={pageCount.toString()}
                            onChange={handlePageCountChange}
                          />
                        </div>
                      </div>
                      
                      {/* Additional Options */}
                      <div className="mb-6">
                        <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                          Additional Options
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="gift-wrap"
                              className="mt-1"
                            />
                            <label htmlFor="gift-wrap" className="ml-2 block text-sm text-charcoal">
                              Gift wrap (+$4.99)
                            </label>
                          </div>
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="dedication-page"
                              className="mt-1"
                            />
                            <label htmlFor="dedication-page" className="ml-2 block text-sm text-charcoal">
                              Add dedication page (+$2.99)
                            </label>
                          </div>
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              id="rush-production"
                              className="mt-1"
                            />
                            <label htmlFor="rush-production" className="ml-2 block text-sm text-charcoal">
                              Rush production - 3 business days (+$14.99)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isLoadingBook && !error && (
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                    <Button 
                      variant="secondary" 
                      href={bookId ? `/create/preview?bookId=${bookId}` : '/create/preview'}
                    >
                      Back to Preview
                    </Button>
                    
                    <Button 
                      onClick={handleContinue}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Continue to Review'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}