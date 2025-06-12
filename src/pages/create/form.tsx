import React, { useState, useEffect, useRef } from 'react';
import { saveFormData, getFormData, saveCurrentStep, setupBrowserNavigationHandlers } from '../../utils/formDataManager';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import OptionCard from '../../components/ui/OptionCard';
import ProgressBar from '../../components/ui/ProgressBar';
import ErrorMessage from '../../components/ui/ErrorMessage';
import Image from 'next/image';
import PhotoEditor from '../../components/ui/PhotoEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCameraRetro, 
  faPencilAlt, 
  faShoppingCart, 
  faBookOpen, 
  faDragon, 
  faCompass, 
  faSmileBeam, 
  faHeart, 
  faCheckCircle, 
  faGift 
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

// Define the character photo interface
interface CharacterPhoto {
  file: File;
  url: string;
  name: string;
  relationship?: string;
  age: string;
}

// Define the book state interface
interface BookState {
  bookId: string | null;
  status: 'idle' | 'submitting' | 'processing' | 'completed' | 'failed';
  progress: number;
  error: string | null;
  bookData: unknown | null;
}

// Define the gift card interface
interface GiftCard {
  code: string;
  remainingAmount: number;
  currency: string;
  status: string;
}

const CreateStorybook: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [characterPhotos, setCharacterPhotos] = useState<CharacterPhoto[]>([]);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPageCount, setSelectedPageCount] = useState<string>('17');
  const [selectedIllustrationStyle, setSelectedIllustrationStyle] = useState('default');
  const [personalMessage, setPersonalMessage] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  
  // Customer information state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Package and pricing state
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'deluxe'>('basic');
  const [additionalCopies, setAdditionalCopies] = useState(0);
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  
  // Gift card state
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);
  const [giftCardError, setGiftCardError] = useState('');
  const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookState, setBookState] = useState<BookState>({
    bookId: null,
    status: 'idle',
    progress: 0,
    error: null,
    bookData: null,
  });
  
  // Form data management
  const saveCreationFormData = () => {
    saveFormData('creation_currentStep', currentStep);
    saveFormData('creation_characterPhotos', characterPhotos);
    saveFormData('creation_storyDescription', storyDescription);
    saveFormData('creation_selectedAgeGroup', selectedAgeGroup);
    saveFormData('creation_selectedTheme', selectedTheme);
    saveFormData('creation_selectedPageCount', selectedPageCount);
    saveFormData('creation_selectedIllustrationStyle', selectedIllustrationStyle);
    saveFormData('creation_personalMessage', personalMessage);
    saveFormData('creation_bookTitle', bookTitle);
    saveFormData('creation_customerEmail', customerEmail);
    saveFormData('creation_customerName', customerName);
    saveFormData('creation_selectedPackage', selectedPackage);
    saveFormData('creation_additionalCopies', additionalCopies);
    saveFormData('creation_giftCardAmount', giftCardAmount);
  };

  // Steps configuration
  const steps = [
    { number: 1, title: 'Customer Information', icon: faUser },
    { number: 2, title: 'Upload Photos', icon: faCameraRetro },
    { number: 3, title: 'Story & Style Details', icon: faPencilAlt },
    { number: 4, title: 'Review & Payment', icon: faShoppingCart },
  ];

  // Validation function
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!customerName.trim()) {
          newErrors.customerName = 'Name is required';
        }
        if (!customerEmail.trim()) {
          newErrors.customerEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
          newErrors.customerEmail = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (characterPhotos.length === 0) {
          newErrors.characterPhotos = 'Please upload at least one character photo';
        }
        break;
      case 3:
        if (!storyDescription.trim()) {
          newErrors.storyDescription = 'Story description is required';
        }
        if (!selectedAgeGroup) {
          newErrors.selectedAgeGroup = 'Please select an age group';
        }
        if (!selectedTheme) {
          newErrors.selectedTheme = 'Please select a theme';
        }
        break;
      case 4:
        if (!selectedPackage) {
          newErrors.selectedPackage = 'Please select a package';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Gift card functions
  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    
    setIsApplyingGiftCard(true);
    setGiftCardError('');
    
    try {
      // Mock gift card validation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful gift card
      const mockGiftCard: GiftCard = {
        code: giftCardCode,
        remainingAmount: 25.00,
        currency: 'USD',
        status: 'active'
      };
      
      setAppliedGiftCard(mockGiftCard);
      setGiftCardCode('');
    } catch (error) {
      setGiftCardError('Invalid gift card code. Please try again.');
    } finally {
      setIsApplyingGiftCard(false);
    }
  };

  const removeGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardCode('');
    setGiftCardError('');
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    const bookData = {
      customerName,
      customerEmail,
      characterPhotos,
      storyDescription,
      selectedAgeGroup,
      selectedTheme,
      selectedPageCount,
      selectedIllustrationStyle,
      personalMessage,
      bookTitle,
      selectedPackage,
      additionalCopies,
      giftCardAmount,
      appliedGiftCard,
    };

    try {
      setIsLoading(true);
      const formData = new FormData();
      
      Object.entries(bookData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'characterPhotos') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'appliedGiftCard' && value) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      // Removed API call
      // console.log('Book created successfully:', bookData);
      
    } catch (error) {
      console.error('Error creating book:', error);
      setBookState({
        bookId: null,
        status: 'failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        bookData: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved form data on mount
  useEffect(() => {
    const savedCurrentStep = getFormData('creation_currentStep');
    if (savedCurrentStep) {
      setCurrentStep(Number(savedCurrentStep));
    }
    
    const savedCharacterPhotos = getFormData('creation_characterPhotos');
    if (savedCharacterPhotos && Array.isArray(savedCharacterPhotos)) {
      setCharacterPhotos(savedCharacterPhotos);
    }
    
    const savedStoryDescription = getFormData('creation_storyDescription');
    if (savedStoryDescription && typeof savedStoryDescription === 'string') {
      setStoryDescription(savedStoryDescription);
    }
    
    const savedSelectedAgeGroup = getFormData('creation_selectedAgeGroup');
    if (savedSelectedAgeGroup && typeof savedSelectedAgeGroup === 'string') {
      setSelectedAgeGroup(savedSelectedAgeGroup);
    }
    
    const savedSelectedTheme = getFormData('creation_selectedTheme');
    if (savedSelectedTheme && typeof savedSelectedTheme === 'string') {
      setSelectedTheme(savedSelectedTheme);
    }
    
    const savedSelectedPageCount = getFormData('creation_selectedPageCount');
    if (savedSelectedPageCount && typeof savedSelectedPageCount === 'string') {
      setSelectedPageCount(savedSelectedPageCount);
    }
    
    const savedSelectedIllustrationStyle = getFormData('creation_selectedIllustrationStyle');
    if (savedSelectedIllustrationStyle && typeof savedSelectedIllustrationStyle === 'string') {
      setSelectedIllustrationStyle(savedSelectedIllustrationStyle);
    }
    
    const savedPersonalMessage = getFormData('creation_personalMessage');
    if (savedPersonalMessage && typeof savedPersonalMessage === 'string') {
      setPersonalMessage(savedPersonalMessage);
    }
    
    const savedBookTitle = getFormData('creation_bookTitle');
    if (savedBookTitle && typeof savedBookTitle === 'string') {
      setBookTitle(savedBookTitle);
    }
    
    const savedCustomerEmail = getFormData('creation_customerEmail');
    if (savedCustomerEmail && typeof savedCustomerEmail === 'string') {
      setCustomerEmail(savedCustomerEmail);
    }
    
    const savedCustomerName = getFormData('creation_customerName');
    if (savedCustomerName && typeof savedCustomerName === 'string') {
      setCustomerName(savedCustomerName);
    }
    
    const savedSelectedPackage = getFormData('creation_selectedPackage');
    if (savedSelectedPackage && typeof savedSelectedPackage === 'string') {
      setSelectedPackage(savedSelectedPackage as 'basic' | 'premium' | 'deluxe');
    }
    
    const savedGiftCardAmount = getFormData('creation_giftCardAmount');
    if (savedGiftCardAmount && typeof savedGiftCardAmount === 'number') {
      setGiftCardAmount(savedGiftCardAmount);
    }
    
    const savedAdditionalCopies = getFormData('creation_additionalCopies');
    if (savedAdditionalCopies && typeof savedAdditionalCopies === 'number') {
      setAdditionalCopies(savedAdditionalCopies);
    }
    
    const cleanup = setupBrowserNavigationHandlers(saveCreationFormData);
    return cleanup;
  }, []); // Empty dependency array to run only once on mount

  // Save form data when any state changes
  useEffect(() => {
    saveCreationFormData();
  }, [
    currentStep,
    characterPhotos,
    storyDescription,
    selectedAgeGroup,
    selectedTheme,
    selectedPageCount,
    selectedIllustrationStyle,
    personalMessage,
    bookTitle,
    customerEmail,
    customerName,
    selectedPackage,
    additionalCopies,
    giftCardAmount,
  ]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-magical shadow-magical p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-inkwell-black mb-2">Create Your Custom Storybook</h1>
            <p className="text-charcoal">Follow these steps to create a personalized storybook featuring your loved ones.</p>
          </div>
          
          <ProgressBar steps={steps} currentStep={currentStep} />
          
          <div className="mt-8">
            <form onSubmit={(e) => { e.preventDefault(); }}>
              {/* Step content only after mounting to prevent hydration mismatch */}
              <>
                {/* Step 1: Customer Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-inkwell-black mb-4">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-magic-orange" />
                      Customer Information
                    </h2>
                    <p className="mb-6 text-charcoal">Please provide your contact information so we can keep you updated on your order.</p>
                    
                    <div className="space-y-4 mb-6">
                      <Input
                        id="customerName"
                        label="Your Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        error={errors.customerName}
                      />
                      
                      <Input
                        id="customerEmail"
                        label="Email Address"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        error={errors.customerEmail}
                      />
                    </div>
                    
                    <div className="bg-adventure-green/10 rounded-magical p-4 mb-4 border-l-4 border-adventure-green">
                      <p className="friendly-text">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-adventure-green mr-2" />
                        Shipping information will be collected during checkout.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Upload Photos */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-inkwell-black mb-4">
                      <FontAwesomeIcon icon={faCameraRetro} className="mr-2 text-magic-orange" />
                      Upload Character Photos
                    </h2>
                    <p className="mb-6 text-charcoal">Upload photos of the characters you want to feature in your storybook.</p>
                    {/* Photo upload UI would go here */}
                  </div>
                )}
                
                {/* Step 3: Story & Style Details */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-inkwell-black mb-4">
                      <FontAwesomeIcon icon={faPencilAlt} className="mr-2 text-magic-orange" />
                      Story & Style Details
                    </h2>
                    <p className="mb-6 text-charcoal">Tell us about your story and choose your preferred style.</p>
                    {/* Story details UI would go here */}
                  </div>
                )}
                
                {/* Step 4: Review & Payment */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-inkwell-black mb-4">
                      <FontAwesomeIcon icon={faShoppingCart} className="mr-2 text-magic-orange" />
                      Review & Payment
                    </h2>
                    
                    {/* Gift Card Section */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-inkwell-black mb-4">
                        <FontAwesomeIcon icon={faGift} className="mr-2 text-magic-orange" />
                        Gift Card
                      </h3>
                      
                      <div className="bg-fog/20 rounded-magical p-6">
                        {!appliedGiftCard ? (
                          <div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Input
                                id="giftCardCode"
                                label="Gift Card Code"
                                value={giftCardCode}
                                onChange={(e) => setGiftCardCode(e.target.value)}
                                placeholder="Enter gift card code"
                                className="flex-grow"
                              />
                              <div className="flex items-end">
                                <Button
                                  onClick={applyGiftCard}
                                  disabled={isApplyingGiftCard || !giftCardCode.trim()}
                                  className="h-10"
                                >
                                  {isApplyingGiftCard ? 'Checking...' : 'Apply'}
                                </Button>
                              </div>
                            </div>
                            {giftCardError && (
                              <p className="text-reading-red friendly-text mt-2">{giftCardError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-adventure-green/10 rounded-magical p-4 border border-adventure-green">
                            <div>
                              <p className="font-semibold text-adventure-green">
                                Gift Card Applied: {appliedGiftCard.code}
                              </p>
                              <p className="text-sm text-charcoal">
                                Remaining Balance: ${appliedGiftCard.remainingAmount.toFixed(2)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeGiftCard}
                              className="text-sm font-medium text-red-800 hover:text-red-600 underline"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className={`mt-8 pt-6 border-t border-fog/30 flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} items-center`}>
                  <div>
                    {currentStep > 1 && (
                      <Button 
                        type="button" 
                        onClick={handlePrevStep} 
                        variant="secondary" 
                        disabled={isLoading || bookState.status === 'processing' || bookState.status === 'submitting'}
                        className="adventure-button-secondary clickable-button"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                      >
                        ← Previous Step
                      </Button>
                    )}
                  </div>
                  <div>
                    {currentStep < 4 && (
                      <Button 
                        type="button" 
                        onClick={handleNextStep} 
                        disabled={isLoading || !validateStep(currentStep)}
                        className="adventure-button clickable-button"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                      >
                        Next Step →
                      </Button>
                    )}
                    {currentStep === 4 && (
                      <Button 
                        onClick={() => {
                          handleSubmit();
                        }}
                        disabled={isLoading || !validateStep(currentStep)}
                        className="adventure-button clickable-button"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                      >
                        💳 Proceed to Payment →
                      </Button>
                    )}
                  </div>
                </div>
              </>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateStorybook;

// Disable static generation for this page since it uses localStorage and dynamic content
export async function getServerSideProps() {
  return {
    props: {},
  };
}
