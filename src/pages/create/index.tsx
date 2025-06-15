import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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
import { faBaby, faChild, faPersonRunning, faCrown, faCompass, faRocket, faBookOpen, faPalette, faPencilAlt, faCameraRetro, faDragon, faSmileBeam, faShoppingCart, faScroll, faGift, faTabletAlt, faMagicWandSparkles, faCheckCircle, faCircle, faCalculator, faUser } from '@fortawesome/free-solid-svg-icons';
import { createBook, getBookStatus, getBook } from '../../utils/bookService';

// Define the steps for the creation process
const steps = [
  { title: 'Customer Information' },      // Step 1: Customer Info
  { title: 'Upload Photos' },            // Step 2: Upload Photos
  { title: 'Story & Style Details' },    // Step 3: Story Description, Styles, Age, Theme, Length
  { title: 'Review & Payment' },         // Step 4: Paywall
];

// Define the character photo interface
interface CharacterPhoto {
  file: File;
  url: string;
  name: string;
  relationship?: string;
  age: string; // Made age field mandatory
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

export default function CreateStorybook() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [characterPhotos, setCharacterPhotos] = useState<CharacterPhoto[]>([]);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPageCount, setSelectedPageCount] = useState<string>('17');
  const [selectedIllustrationStyle, setSelectedIllustrationStyle] = useState('default'); // Restored for UI style selection
  const [personalMessage, setPersonalMessage] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);
  const [isCheckingGiftCard, setIsCheckingGiftCard] = useState(false);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  // Set a default package to avoid validation errors
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'deluxe'>('basic');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [editingPhotoMode, setEditingPhotoMode] = useState<'info' | 'image' | null>(null);
  const [projectNumber, setProjectNumber] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [additionalCopies, setAdditionalCopies] = useState(0);
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const [customGiftCardAmount, setCustomGiftCardAmount] = useState('');
  
  // Book generation state
  const [bookState, setBookState] = useState<BookState>({
    bookId: null,
    status: 'idle',
    progress: 0,
    error: null,
    bookData: null
  });
  
  // Status polling interval
  const [statusInterval, setStatusInterval] = useState<number | null>(null);
  
  // Save all form data to localStorage
  const saveCreationFormData = () => {
    // Save each piece of data with a specific key
    saveFormData('creation_currentStep', currentStep);
    
    // For character photos, we need to exclude the File objects since they can't be serialized
    const photosForStorage = characterPhotos.map(photo => ({
      url: photo.url,
      name: photo.name,
      relationship: photo.relationship,
      age: photo.age
      // Exclude the 'file' property as it cannot be serialized
    }));
    saveFormData('creation_characterPhotos', photosForStorage);
    
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
    
    // Also save the current step in a dedicated field for easy access
    saveCurrentStep(currentStep);
  };
  
  // Generate a stable project number on component mount and load saved data
  useEffect(() => {
    setProjectNumber(String(Math.floor(Math.random() * 90000) + 10000));
    setIsClient(true); // Set client to true after mount
    
    // Load saved form data if available
    const savedStep = getFormData('creation_currentStep');
    
    // Check URL for step parameter (supports both /create/4 and /create?step=4 formats)
    const urlStep = router.query.step ? parseInt(router.query.step as string) : null;
    
    // Use URL step if valid, otherwise use saved step, otherwise default to 1
    let initialStep = 1;
    if (urlStep && urlStep >= 1 && urlStep <= steps.length) {
      initialStep = urlStep;
    } else if (typeof savedStep === 'number' && savedStep >= 1 && savedStep <= steps.length) {
      initialStep = savedStep;
    }
    
    setCurrentStep(initialStep);
    
    // Update URL if it doesn't match the determined step
    if (!urlStep || urlStep !== initialStep) {
      router.replace(`/create/${initialStep}`, undefined, { shallow: true });
    }
    
    const savedPhotos = getFormData('creation_characterPhotos');
    if (Array.isArray(savedPhotos)) {
      // Only set if photos have the required properties
      const validPhotos = savedPhotos.filter(photo => 
        photo && typeof photo === 'object' && photo.name && photo.relationship
      );
      if (validPhotos.length > 0) {
        // Note: These photos won't have File objects, so they can't be uploaded again
        // Users will need to re-upload photos if they navigate back to this step
        setCharacterPhotos(validPhotos.map(photo => ({
          ...photo,
          file: null as any // Temporarily set to null, will need re-upload
        })) as CharacterPhoto[]);
      }
    }
    
    const savedDescription = getFormData('creation_storyDescription');
    if (typeof savedDescription === 'string') {
      setStoryDescription(savedDescription);
    }
    
    const savedAgeGroup = getFormData('creation_selectedAgeGroup');
    if (typeof savedAgeGroup === 'string') {
      setSelectedAgeGroup(savedAgeGroup);
    }
    
    const savedTheme = getFormData('creation_selectedTheme');
    if (typeof savedTheme === 'string') {
      setSelectedTheme(savedTheme);
    }
    
    const savedPageCount = getFormData('creation_selectedPageCount');
    if (typeof savedPageCount === 'string') {
      setSelectedPageCount(savedPageCount);
    }
    
    const savedStyle = getFormData('creation_selectedIllustrationStyle');
    if (typeof savedStyle === 'string') {
      setSelectedIllustrationStyle(savedStyle);
    }
    
    const savedMessage = getFormData('creation_personalMessage');
    if (typeof savedMessage === 'string') {
      setPersonalMessage(savedMessage);
    }
    
    const savedTitle = getFormData('creation_bookTitle');
    if (typeof savedTitle === 'string') {
      setBookTitle(savedTitle);
    }
    
    const savedEmail = getFormData('creation_customerEmail');
    if (typeof savedEmail === 'string') {
      setCustomerEmail(savedEmail);
    }
    
    const savedName = getFormData('creation_customerName');
    if (typeof savedName === 'string') {
      setCustomerName(savedName);
    }
    
    const savedPackage = getFormData('creation_selectedPackage');
    if (savedPackage && ['basic', 'premium', 'deluxe'].includes(savedPackage)) {
      setSelectedPackage(savedPackage as 'basic' | 'premium' | 'deluxe');
    }
    
    const savedAdditionalCopies = getFormData('creation_additionalCopies');
    if (typeof savedAdditionalCopies === 'number') {
      setAdditionalCopies(savedAdditionalCopies);
    }
    
    const savedGiftCardAmount = getFormData('creation_giftCardAmount');
    if (typeof savedGiftCardAmount === 'number') {
      setGiftCardAmount(savedGiftCardAmount);
    }
  }, []);
  
  // Set up event listeners for browser navigation
  useEffect(() => {
    if (!isClient) return;
    
    // Set up event listeners for browser navigation
    const cleanup = setupBrowserNavigationHandlers(saveCreationFormData);
    
    return () => {
      cleanup();
      // Also clean up status interval if it exists
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [isClient, statusInterval, currentStep, characterPhotos, storyDescription, selectedAgeGroup, 
      selectedTheme, selectedPageCount, selectedIllustrationStyle, personalMessage, 
      bookTitle, customerEmail, customerName, selectedPackage, additionalCopies, giftCardAmount]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusInterval) {
        window.clearInterval(statusInterval);
      }
    };
  }, [statusInterval]);
  
  // Cancel gift card reservations when order details change
  useEffect(() => {
    // Cancel reservations when additional copies change (if gift card is applied)
    if (appliedGiftCard && appliedGiftCard.code) {
      cancelGiftCardReservations(appliedGiftCard.code);
    }
  }, [additionalCopies, appliedGiftCard?.code as string]); // Only trigger when additionalCopies changes
  
  useEffect(() => {
    // Cancel reservations when gift card amount changes (if gift card is applied)
    if (appliedGiftCard && appliedGiftCard.code) {
      cancelGiftCardReservations(appliedGiftCard.code);
    }
  }, [giftCardAmount, appliedGiftCard?.code as string]); // Only trigger when giftCardAmount changes
  
  const [errors, setErrors] = useState({
    customerName: '',
    customerEmail: '',
    photos: '',
    characterNames: '',
    storyDescription: '',
    ageGroup: '',
    theme: '',
    pageCount: '',
    illustrationStyle: '',
    payment: '', // Added for paywall step errors
    characterAges: '', // Added for age validation
    personalMessage: '', // Added for personal message validation
    bookTitle: '', // Added for book title validation
  });

  // Helper function to cancel gift card reservations
  const cancelGiftCardReservations = async (giftCardCode: string) => {
    try {
      console.log(`🔄 Cancelling reservations for gift card: ${giftCardCode}`);
      const response = await fetch('/api/cancel-gift-card-reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: giftCardCode }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Cancelled ${result.cancelledCount} reservations for gift card: ${giftCardCode}`);
      } else {
        console.warn(`⚠️ Failed to cancel reservations for gift card: ${giftCardCode}`);
      }
    } catch (error) {
      console.error('❌ Error cancelling gift card reservations:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      
      // Create new character photos with empty names
      const newCharacterPhotos = newPhotos.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: '',
        relationship: '',
        age: '' // Initialize age
      }));
      
      const updatedCharacterPhotos = [...characterPhotos, ...newCharacterPhotos];
      setCharacterPhotos(updatedCharacterPhotos);
      
      // Clear any error
      setErrors({
        ...errors,
        photos: ''
      });
      
      // Automatically show the character information form for the first new photo
      const newPhotoIndex = characterPhotos.length;
      setEditingPhotoIndex(newPhotoIndex);
      setEditingPhotoMode('info');
    }
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    const newCharacterPhotos = [...characterPhotos];
    
    // Clean up URL object
    URL.revokeObjectURL(newCharacterPhotos[index].url);
    
    // Remove the photo
    newCharacterPhotos.splice(index, 1);
    setCharacterPhotos(newCharacterPhotos);
    
    // Reset editing index if needed
    if (editingPhotoIndex === index) {
      setEditingPhotoIndex(newCharacterPhotos.length > 0 ? 0 : null);
    } else if (editingPhotoIndex !== null && editingPhotoIndex > index) {
      setEditingPhotoIndex(editingPhotoIndex - 1);
    }
  };
  
  // Update character name
  const updateCharacterName = (index: number, name: string) => {
    const newCharacterPhotos = [...characterPhotos];
    newCharacterPhotos[index].name = name;
    setCharacterPhotos(newCharacterPhotos);
  };
  
  // Update character relationship
  const updateCharacterRelationship = (index: number, relationship: string) => {
    const newCharacterPhotos = [...characterPhotos];
    newCharacterPhotos[index].relationship = relationship;
    setCharacterPhotos(newCharacterPhotos);
  };

  // Update character age
  const updateCharacterAge = (index: number, age: string) => {
    const newCharacterPhotos = [...characterPhotos];
    newCharacterPhotos[index].age = age;
    setCharacterPhotos(newCharacterPhotos);
  };
  
  // Select a photo to edit info (name, relationship)
  const selectPhotoToEdit = (index: number) => {
    setEditingPhotoIndex(index);
    setEditingPhotoMode('info');
  };
  
  // Select a photo to edit image (crop, rotate)
  const selectPhotoToEditImage = (index: number) => {
    setEditingPhotoIndex(index);
    setEditingPhotoMode('image');
  };
  
  // Save edited photo
  const saveEditedPhoto = (editedImageUrl: string) => {
    if (editingPhotoIndex !== null) {
      const newCharacterPhotos = [...characterPhotos];
      newCharacterPhotos[editingPhotoIndex].url = editedImageUrl;
      setCharacterPhotos(newCharacterPhotos);
      setEditingPhotoMode(null);
    }
  };
  
  // Cancel photo editing
  const cancelPhotoEditing = () => {
    setEditingPhotoMode(null);
  };

  // Validate the current step
  const validateStep = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1) { // Step 1: Customer Information
      if (!customerName.trim()) {
        newErrors.customerName = 'Please enter your full name';
        isValid = false;
      } else {
        newErrors.customerName = '';
      }
      if (!customerEmail.trim()) {
        newErrors.customerEmail = 'Please enter your email address';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        newErrors.customerEmail = 'Please enter a valid email address';
        isValid = false;
      } else {
        newErrors.customerEmail = '';
      }
    } else if (currentStep === 2) { // Step 2: Upload Photos
      if (characterPhotos.length === 0) {
        newErrors.photos = 'Please upload at least one photo';
        isValid = false;
      } else {
        newErrors.photos = '';
      }
      const missingNames = characterPhotos.some(photo => !photo.name.trim());
      if (missingNames) {
        newErrors.characterNames = 'Please provide a name for each character';
        isValid = false;
      } else {
        newErrors.characterNames = '';
      }
      const missingAges = characterPhotos.some(photo => !photo.age?.trim());
      if (missingAges) {
        newErrors.characterAges = 'Please provide an age for each character';
        isValid = false;
      } else {
        newErrors.characterAges = '';
      }
    } else if (currentStep === 3) { // Step 3: Story & Style Details
      if (!storyDescription.trim()) {
        newErrors.storyDescription = 'Please describe your story plot';
        isValid = false;
      } else {
        newErrors.storyDescription = '';
      }
      if (!selectedIllustrationStyle || selectedIllustrationStyle === 'default') {
        newErrors.illustrationStyle = 'Please select an illustration style';
        isValid = false;
      } else {
        newErrors.illustrationStyle = '';
      }
      if (!selectedAgeGroup) {
        newErrors.ageGroup = 'Please select an age group';
        isValid = false;
      } else {
        newErrors.ageGroup = '';
      }
      if (!selectedTheme) {
        newErrors.theme = 'Please select a story theme';
        isValid = false;
      } else {
        newErrors.theme = '';
      }
      if (!selectedPageCount) {
        newErrors.pageCount = 'Please select a book length';
        isValid = false;
      } else {
        newErrors.pageCount = '';
      }
      if (!personalMessage.trim()) {
        newErrors.personalMessage = 'Please provide a personal message for the first page';
        isValid = false;
      } else {
        newErrors.personalMessage = '';
      }
      if (!bookTitle.trim()) {
        newErrors.bookTitle = 'Please enter a title for your book';
        isValid = false;
      } else {
        newErrors.bookTitle = '';
      }
    } else if (currentStep === 4) { // Step 4: Review & Payment
      if (!selectedPackage) {
        newErrors.payment = 'Please select a package';
        isValid = false;
      } else {
        newErrors.payment = '';
      }
    }

    if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
      setErrors(newErrors);
    }
    return isValid;
  };

  // Handle next step
  const handleNextStep = () => {
    // Validate current step
    if (!validateStep()) {
      return;
    }
    
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Save form data and current step
      saveFormData('creation_currentStep', nextStep);
      saveCurrentStep(nextStep);
      saveCreationFormData();
      
      // Update URL
      router.push(`/create/${nextStep}`);
    }
    
    // Scroll to top when moving to next step
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle previous step
  const handlePrevStep = async () => {
    if (currentStep > 1) {
      // If navigating back from step 4 (checkout) and gift card is applied, cancel reservations
      if (currentStep === 4 && appliedGiftCard && appliedGiftCard.code) {
        await cancelGiftCardReservations(appliedGiftCard.code);
      }
      
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Save form data and current step
      saveFormData('creation_currentStep', prevStep);
      saveCurrentStep(prevStep);
      saveCreationFormData();
      
      // Update URL
      router.push(`/create/${prevStep}`);
      
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle form submission (triggered from Step 4 Review & Payment)
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    setIsLoading(true);
    setBookState(prev => ({ ...prev, status: 'submitting', progress: 0.1, error: null }));

    try {
      // Upload character images first
      const characterPhotoUrls: string[] = [];
      
      if (characterPhotos.length > 0) {
        setBookState(prev => ({ ...prev, progress: 0.3, status: 'processing' }));
        console.log(`Uploading ${characterPhotos.length} character photos...`);
        
        // Upload each character photo
        for (let i = 0; i < characterPhotos.length; i++) {
          const photo = characterPhotos[i];
          
          if (photo.file) {
            console.log(`Uploading character photo ${i + 1}/${characterPhotos.length}...`);
            
            const formData = new FormData();
            formData.append('image', photo.file);
            
            const uploadResponse = await fetch('/api/upload-image', {
              method: 'POST',
              body: formData,
            });
            
            if (!uploadResponse.ok) {
              throw new Error(`Failed to upload character photo ${i + 1}`);
            }
            
            const uploadResult = await uploadResponse.json();
            characterPhotoUrls.push(uploadResult.url);
            console.log(`Character photo ${i + 1} uploaded successfully:`, uploadResult.url);
          } else if (photo.url) {
            // Use existing URL if photo was loaded from localStorage
            characterPhotoUrls.push(photo.url);
            console.log(`Using existing character photo ${i + 1} URL from localStorage:`, photo.url);
          }
          
          // Update progress for each photo uploaded
          const photoProgress = 0.3 + (0.3 * (i + 1) / characterPhotos.length);
          setBookState(prev => ({ ...prev, progress: photoProgress }));
        }
        
        console.log(`All ${characterPhotoUrls.length} character photos processed successfully`);
      }
      
      setBookState(prev => ({ ...prev, progress: 0.6, status: 'processing' }));
      console.log('Creating order...');
      
      // Ensure we have a valid package type
      const packageType = selectedPackage || 'basic';
      console.log('Using package type:', packageType);
      console.log('Selected package state:', selectedPackage);
      console.log('Package selection components rendered:', {
        basic: document.querySelector('[data-package="basic"]') !== null,
        premium: document.querySelector('[data-package="premium"]') !== null,
        deluxe: document.querySelector('[data-package="deluxe"]') !== null
      });
      
      // Prepare order data for Stripe
      const orderData = {
        productType: packageType,
        customerEmail: customerEmail,
        customerName: customerName,
        bookTitle: bookTitle || 'My Custom Adventure',
        characterName: characterPhotos[0]?.name || '',
        characterAge: characterPhotos[0]?.age || '',
        personalMessage: personalMessage,
        artStyle: selectedIllustrationStyle,
        characterPhotoUrls: characterPhotoUrls,
        additionalCopies: additionalCopies,
        giftCardAmount: giftCardAmount,
        appliedGiftCardDiscount: appliedGiftCard ? appliedGiftCard.remainingAmount : 0,
        appliedGiftCardCode: appliedGiftCard ? appliedGiftCard.code : null,
      };

      // Save order data for the review page
      saveFormData('checkout_orderData', orderData);
      
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // Parse error message for user-friendly display
        let userErrorMessage = 'Failed to process payment. Please try again.';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            // Handle specific gift card errors
            if (errorData.error.includes('insufficient balance')) {
              userErrorMessage = 'Gift card has insufficient balance. Please check your gift card or try a different payment method.';
            } else if (errorData.error.includes('expired')) {
              userErrorMessage = 'This gift card has expired. Please use a different gift card or payment method.';
            } else if (errorData.error.includes('not found')) {
              userErrorMessage = 'Gift card not found. Please check the code and try again.';
            } else if (errorData.error.includes('already used')) {
              userErrorMessage = 'This gift card has already been fully used. Please use a different gift card or payment method.';
            } else {
              userErrorMessage = errorData.error;
            }
          }
        } catch (parseError) {
          // If we can't parse the error, use the default message
          console.warn('Could not parse error response:', parseError);
        }
        
        setBookState(prev => ({ 
          ...prev, 
          status: 'failed', 
          error: userErrorMessage 
        }));
        setIsLoading(false);
        return;
      }

      const responseData = await response.json();
      console.log('Checkout API response:', responseData);
      const { url } = responseData;
      
      if (!url) {
        console.error('No URL in response:', responseData);
        throw new Error('No checkout URL received from server');
      }
      
      setBookState(prev => ({ ...prev, progress: 1.0, status: 'processing' }));
      console.log('Redirecting to payment...');
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      setBookState(prev => ({ 
        ...prev, 
        status: 'failed', 
        error: 'Failed to process payment. Please try again.' 
      }));
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Create Your Magical Storybook - CustomHereos">
      <div className="min-h-screen bg-hero-gradient">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Magical Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-magic-orange sparkle-animation" />
              <h1 className="friendly-title text-inkwell-black">
                ✨ Create Your Magical Adventure ✨
              </h1>
              <FontAwesomeIcon icon={faDragon} className="text-4xl text-adventure-green float-animation" />
            </div>
            <p className="friendly-text text-charcoal max-w-2xl mx-auto">
              Let's create a wonderful storybook adventure together! Follow the simple steps below to bring your story to life.
            </p>
            {isClient && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-magical shadow-gentle">
                <FontAwesomeIcon icon={faCompass} className="text-story-blue" />
                <span className="friendly-text font-semibold text-inkwell-black">Adventure #{projectNumber}</span>
              </div>
            )}
          </div>

          {/* Adventure Progress */}
          <div className="mb-8">
            <div className="bg-white/90 rounded-magical p-6 shadow-adventure page-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="friendly-subtitle text-inkwell-black">Your Adventure Progress</h3>
                <span className="friendly-text text-charcoal">{currentStep} of {steps.length}</span>
              </div>
              <ProgressBar currentStep={currentStep} steps={steps} />
            </div>
          </div>

          {/* Main Adventure Card */}
          <div className="adventure-card page-shadow">
            <div className="bg-magical-gradient text-white px-8 py-6 rounded-t-magical">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon 
                    icon={currentStep === 1 ? faUser : currentStep === 2 ? faCameraRetro : currentStep === 3 ? faPencilAlt : faShoppingCart} 
                    className="text-2xl gentle-bounce" 
                  />
                  <h2 className="friendly-subtitle font-fredoka">
                    {steps[currentStep - 1].title}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="friendly-text opacity-90">Step {currentStep}</div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 md:p-10">
              <form onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission
                // Only submit if we're on step 4 and user hasn't used the manual button
                return false;
              }}>
                {/* Step 1: Customer Information */}
                {currentStep === 1 && (
                  <div>
                    <div className="text-center mb-8">
                      <FontAwesomeIcon icon={faUser} className="text-6xl text-magic-orange mb-4 sparkle-animation" />
                      <h3 className="friendly-2xl text-inkwell-black mb-4 font-fredoka">
                        👋 Welcome to Custom Heroes!
                      </h3>
                      <div className="bg-lavender rounded-magical p-6 border-l-4 border-magic-orange">
                        <p className="friendly-text text-charcoal leading-relaxed">
                          We're excited to help you create a magical storybook adventure! To get started, please provide your contact information.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-8 bg-paper-white rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-6">
                        <FontAwesomeIcon icon={faUser} className="text-2xl text-magic-orange" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          👤 Customer Information
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block friendly-text font-medium text-charcoal mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="customerName"
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full"
                            required
                          />
                          {errors.customerName && (
                            <p className="text-reading-red text-sm">{errors.customerName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block friendly-text font-medium text-charcoal mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full"
                            required
                          />
                          {errors.customerEmail && (
                            <p className="text-reading-red text-sm">{errors.customerEmail}</p>
                          )}
                          <p className="text-sm text-charcoal/70 mt-1">
                            We'll send order updates and delivery notifications to this email
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Upload Photos */}
                {currentStep === 2 && (
                  <div>
                    <div className="text-center mb-8">
                      <FontAwesomeIcon icon={faCameraRetro} className="text-6xl text-magic-orange mb-4 sparkle-animation" />
                      <h3 className="friendly-2xl text-inkwell-black mb-4 font-fredoka">
                        📸 Let's Meet Your Characters!
                      </h3>
                      <div className="bg-cream border-l-4 border-magic-orange rounded-magical p-6 text-charcoal shadow-gentle">
                        <div className="flex items-center gap-2 mb-3">
                          <FontAwesomeIcon icon={faCameraRetro} className="text-magic-orange" />
                          <h4 className="friendly-text font-semibold">📸 Photo Tips for Best Results:</h4>
                        </div>
                        <ul className="friendly-text space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-adventure-green">✓</span>
                            Use clear, well-lit photos with smiling faces
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-adventure-green">✓</span>
                            Front-facing portraits work best for our magic
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-adventure-green">✓</span>
                            <strong>Each photo should show just one person</strong>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-adventure-green">✓</span>
                            Include beloved pets or special toys in the adventure
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block friendly-lg font-semibold mb-6 text-inkwell-black font-fredoka">
                        <FontAwesomeIcon icon={faSmileBeam} className="text-sunshine-yellow mr-2" />
                        Your Adventure Characters
                        <span className="text-reading-red ml-2">*</span>
                      </label>
                      
                      {editingPhotoMode === 'image' && editingPhotoIndex !== null && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                          <div className="w-full max-w-2xl">
                            <PhotoEditor 
                              imageUrl={characterPhotos[editingPhotoIndex].url}
                              onSave={saveEditedPhoto}
                              onCancel={cancelPhotoEditing}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                        {characterPhotos.map((photo, index) => (
                          <div 
                            key={index} 
                            className={`relative rounded-magical overflow-hidden shadow-adventure transition-all duration-300 ${editingPhotoIndex === index && editingPhotoMode === 'info' ? 'ring-4 ring-story-blue' : ''}`}
                            onClick={() => selectPhotoToEdit(index)}
                          >
                            <div className="aspect-square relative">
                              <Image 
                                src={photo.url} 
                                alt={photo.name || `Character photo ${index + 1}`} 
                                layout="fill" 
                                objectFit="cover" 
                                className="cursor-pointer"
                              />
                            </div>
                            <div className="absolute top-2 right-2 flex space-x-2">
                              <button 
                                type="button"
                                className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center text-magic-orange hover:bg-magic-orange hover:text-white transition-all duration-200 shadow-gentle magical-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectPhotoToEditImage(index);
                                }}
                                title="Edit photo"
                              >
                                <FontAwesomeIcon icon={faPencilAlt} className="text-sm" />
                              </button>
                              <button 
                                type="button"
                                className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center text-reading-red hover:bg-reading-red hover:text-white transition-all duration-200 shadow-gentle magical-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePhoto(index);
                                }}
                                title="Remove photo"
                              >
                                <FontAwesomeIcon icon={faSmileBeam} className="text-sm rotate-180" />
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <p className="text-white font-semibold text-sm truncate">
                                {photo.name || `Character ${index + 1}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Upload Button */}
                      <div className="text-center">
                        <label className="magical-button inline-flex items-center gap-3 bg-adventure-gradient text-white px-8 py-4 rounded-magical cursor-pointer shadow-adventure hover:shadow-magical transition-all duration-300 friendly-text font-semibold">
                          <FontAwesomeIcon icon={faCameraRetro} className="text-xl" />
                          {characterPhotos.length === 0 ? '📸 Upload Your First Character!' : '✨ Add Another Character'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                          />
                        </label>
                        <p className="friendly-text text-charcoal mt-3">
                          You can upload up to 5 characters for your adventure!
                        </p>
                      </div>
                      
                      {errors.photos && (
                        <p className="text-reading-red text-sm">{errors.photos}</p>
                      )}
                      
                      {/* Character Information Form */}
                      {editingPhotoMode === 'info' && editingPhotoIndex !== null && characterPhotos.length > 0 && (
                        <div className="mt-8 bg-lavender rounded-magical p-6 shadow-gentle border-l-4 border-tale-purple relative z-10" style={{ pointerEvents: 'auto' }}>
                          <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faSmileBeam} className="text-2xl text-tale-purple" />
                            <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                              ✨ Tell Us About This Character
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-6 mb-6 bg-white/70 rounded-magical p-4">
                            <div className="w-20 h-20 rounded-magical overflow-hidden shadow-adventure flex-shrink-0 relative">
                              <Image 
                                src={characterPhotos[editingPhotoIndex]?.url || ''} 
                                alt={characterPhotos[editingPhotoIndex]?.name || "Selected character"} 
                                layout="fill" 
                                objectFit="cover" 
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <p className="friendly-text text-charcoal mb-2">
                                Character {editingPhotoIndex + 1} of {characterPhotos.length}
                              </p>
                              <div className="flex gap-3">
                                <button 
                                  type="button"
                                  className="adventure-button-secondary px-4 py-2 rounded-magical text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => setEditingPhotoIndex(Math.max(0, (editingPhotoIndex || 0) - 1))}
                                  disabled={editingPhotoIndex === 0}
                                >
                                  ← Previous
                                </button>
                                <button 
                                  type="button"
                                  className="adventure-button-secondary px-4 py-2 rounded-magical text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => setEditingPhotoIndex(Math.min(characterPhotos.length - 1, (editingPhotoIndex || 0) + 1))}
                                  disabled={editingPhotoIndex === characterPhotos.length - 1}
                                >
                                  Next →
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6" style={{ pointerEvents: 'auto' }}>
                            <div style={{ pointerEvents: 'auto' }}>
                              <Input
                                id={`character-name-${editingPhotoIndex}`}
                                label="Character Name *"
                                placeholder="e.g., Emma, Grandpa John, Princess Luna"
                                value={characterPhotos[editingPhotoIndex].name}
                                onChange={(e) => updateCharacterName(editingPhotoIndex, e.target.value)}
                                required
                                className="friendly-input"
                              />
                            </div>
                            
                            <div style={{ pointerEvents: 'auto' }}>
                              <Input
                                id={`character-age-${editingPhotoIndex}`}
                                label="Character Age *"
                                placeholder="e.g., 5, 8, 12, Adult"
                                value={characterPhotos[editingPhotoIndex].age}
                                onChange={(e) => updateCharacterAge(editingPhotoIndex, e.target.value)}
                                required
                                className="friendly-input"
                              />
                            </div>
                            
                            <div style={{ pointerEvents: 'auto' }}>
                              <label className="block friendly-text font-semibold mb-3 text-inkwell-black">
                                Relationship to Main Character
                              </label>
                              <select
                                value={characterPhotos[editingPhotoIndex].relationship || ''}
                                onChange={(e) => updateCharacterRelationship(editingPhotoIndex, e.target.value)}
                                className="friendly-input w-full"
                                style={{ pointerEvents: 'auto' }}
                              >
                                <option value="">Choose a relationship...</option>
                                <option value="main-character">Main Character (Hero)</option>
                                <option value="brother">Brother</option>
                                <option value="sister">Sister</option>
                                <option value="parent">Mom/Dad</option>
                                <option value="grandparent">Grandma/Grandpa</option>
                                <option value="aunt-uncle">Aunt/Uncle</option>
                                <option value="friend">Best Friend</option>
                                <option value="cousin">Cousin</option>
                                <option value="pet">Pet</option>
                                <option value="stuffed-animal">Stuffed Animal</option>
                                <option value="other">Other Family/Friend</option>
                              </select>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                              <button 
                                type="button"
                                className="adventure-button px-6 py-3 rounded-magical font-semibold flex-1"
                                onClick={() => setEditingPhotoMode(null)}
                              >
                                ✅ Save Character Info
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {errors.characterNames && (
                        <p className="text-reading-red text-sm mt-4">{errors.characterNames}</p>
                      )}
                      {/* Display general character ages error if not shown by specific photo input */}
                      {errors.characterAges && (!editingPhotoMode || editingPhotoIndex === null) && (
                         <p className="text-reading-red text-sm mt-4">{errors.characterAges}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 3: Story & Style Details */}
                {currentStep === 3 && (
                  <div style={{ pointerEvents: 'auto' }}>
                    <div className="text-center mb-8">
                      <FontAwesomeIcon icon={faPencilAlt} className="text-6xl text-tale-purple mb-4 sparkle-animation" />
                      <h3 className="friendly-2xl text-inkwell-black mb-4 font-fredoka">
                        ✍️ Let's Create Your Story!
                      </h3>
                      <div className="bg-soft-pink rounded-magical p-6 border-l-4 border-tale-purple">
                        <p className="friendly-text text-charcoal leading-relaxed">
                          Now for the fun part! Tell us about the magical adventure you want to create, 
                          and choose the perfect style to bring your story to life!
                        </p>
                      </div>
                    </div>

                    {/* Personal Message Section */}
                    <div className="mb-8 bg-lavender rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-tale-purple" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          💌 Your Special Message
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        Write a heartfelt message that will appear on the first page of your storybook. 
                        This could be a dedication, birthday wish, or loving note!
                      </p>
                      {errors.personalMessage && (
                        <p className="text-reading-red friendly-text mb-3">{errors.personalMessage}</p>
                      )}
                      <div style={{ pointerEvents: 'auto' }}>
                        <TextArea
                          id="personalMessage"
                          label="Personal Message *"
                          placeholder="Dear Emma, this magical adventure was created just for you! May you always believe in the magic within yourself and never stop dreaming big. Love, Mommy & Daddy ❤️"
                          rows={4}
                          value={personalMessage}
                          onChange={(e) => setPersonalMessage(e.target.value)}
                          required
                          className="friendly-input"
                        />
                      </div>
                    </div>

                    {/* Book Title */}
                    <div className="mb-8 bg-cream rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-tale-purple" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          📖 Book Title
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        Give your magical storybook a title!
                      </p>
                      {errors.bookTitle && (
                        <p className="text-reading-red friendly-text mb-3">{errors.bookTitle}</p>
                      )}
                      <div style={{ pointerEvents: 'auto' }}>
                        <Input
                          id="bookTitle"
                          label="Book Title *"
                          placeholder="e.g., Emma's Magical Adventure"
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          required
                          className="friendly-input"
                        />
                      </div>
                    </div>

                    {/* Story Description */}
                    <div className="mb-8 bg-cream rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faDragon} className="text-2xl text-adventure-green" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          🌟 Your Adventure Plot
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        Describe the magical adventure you want to create. Our AI storytellers will use this to craft your personalized tale!
                      </p>
                      <div className="bg-white/80 p-4 rounded-magical mb-4 border-l-3 border-adventure-green">
                        <p className="friendly-text text-charcoal mb-2">
                          <span className="font-semibold">✨ Story Details:</span> It's completely up to you how much detail to provide!
                        </p>
                        <ul className="friendly-text text-charcoal space-y-2 list-disc pl-5">
                          <li><span className="font-semibold">Want a surprise?</span> Keep it brief and our AI will create a delightful adventure for you.</li>
                          <li><span className="font-semibold">Have specific ideas?</span> Share them! While we can't guarantee every detail will be included, we'll do our best.</li>
                          <li>After you review your draft, you can request <span className="font-semibold">up to 2 total revisions</span>. Each specific change (character detail, plot point, story element) counts as one revision.</li>
                          <li>Whether detailed or simple, we'll create a magical personalized experience!</li>
                        </ul>
                      </div>
                      {errors.storyDescription && (
                        <p className="text-reading-red friendly-text mb-3">{errors.storyDescription}</p>
                      )}
                      <div style={{ pointerEvents: 'auto' }}>
                        <TextArea
                          id="storyDescription"
                          label="Story Description / Plot Ideas *"
                          placeholder="A magical adventure where brave Emma explores an enchanted forest to find a legendary glowing crystal. She meets friendly woodland creatures and overcomes exciting challenges with courage and kindness!"
                          rows={4}
                          value={storyDescription}
                          onChange={(e) => setStoryDescription(e.target.value)}
                          required
                          className="friendly-input"
                        />
                      </div>
                    </div>

                    {/* Illustration Style */}
                    <div className="mb-8 bg-soft-pink rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faPalette} className="text-2xl text-tale-purple" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          🎨 Choose Your Art Style
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        Pick the magical art style that will bring your story to life!
                      </p>
                      {errors.illustrationStyle && (
                        <p className="text-reading-red friendly-text mb-3">{errors.illustrationStyle}</p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" style={{ pointerEvents: 'auto' }}>
                        <OptionCard 
                          icon={<Image src="/styles/Watercolor.png" alt="Watercolor style" width={120} height={90} className="object-cover rounded-magical mx-auto mb-2" />} 
                          title="🌸 Watercolor" 
                          description="Soft and dreamy" 
                          selected={selectedIllustrationStyle === 'watercolor'} 
                          onClick={() => setSelectedIllustrationStyle('watercolor')} 
                        />
                        <OptionCard 
                          icon={<Image src="/styles/Cartoon.png" alt="Cartoon style" width={120} height={90} className="object-cover rounded-magical mx-auto mb-2" />} 
                          title="😄 Cartoon" 
                          description="Fun and playful" 
                          selected={selectedIllustrationStyle === 'cartoon'} 
                          onClick={() => setSelectedIllustrationStyle('cartoon')} 
                        />
                        <OptionCard 
                          icon={<Image src="/styles/Sketch.png" alt="Sketch style" width={120} height={90} className="object-cover rounded-magical mx-auto mb-2" />} 
                          title="✏️ Sketch" 
                          description="Artistic and detailed" 
                          selected={selectedIllustrationStyle === 'sketch'} 
                          onClick={() => setSelectedIllustrationStyle('sketch')} 
                        />
                        <OptionCard 
                          icon={<Image src="/styles/Vintage.png" alt="Vintage style" width={120} height={90} className="object-cover rounded-magical mx-auto mb-2" />} 
                          title="📚 Vintage" 
                          description="Classic and timeless" 
                          selected={selectedIllustrationStyle === 'vintage'} 
                          onClick={() => setSelectedIllustrationStyle('vintage')} 
                        />
                        <OptionCard 
                          icon={<Image src="/styles/Fantasy.png" alt="Fantasy style" width={120} height={90} className="object-cover rounded-magical mx-auto mb-2" />} 
                          title="🧚 Fantasy" 
                          description="Mythical and imaginative" 
                          selected={selectedIllustrationStyle === 'fantasy'} 
                          onClick={() => setSelectedIllustrationStyle('fantasy')} 
                        />
                        <OptionCard 
                          icon={<Image src="/styles/Animated.png" alt="Animated style" width={120} height={90} className="object-cover rounded-magical mx-auto mb-2" />} 
                          title="🎬 Animated" 
                          description="Lively and dynamic" 
                          selected={selectedIllustrationStyle === 'animated'} 
                          onClick={() => setSelectedIllustrationStyle('animated')} 
                        />
                      </div>
                    </div>

                    {/* Target Age Range */}
                    <div className="mb-8 bg-lavender rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faChild} className="text-2xl text-adventure-green" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          👶 Perfect Age Group
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        Who will be enjoying this magical adventure?
                      </p>
                      {errors.ageGroup && (
                        <p className="text-reading-red friendly-text mb-3">{errors.ageGroup}</p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" style={{ pointerEvents: 'auto' }}>
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faBaby} className="text-3xl text-soft-pink" />} 
                          title="👶 0-3 Years" 
                          description="Simple and sensory" 
                          selected={selectedAgeGroup === '0-3'} 
                          onClick={() => setSelectedAgeGroup('0-3')} 
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faChild} className="text-3xl text-sunshine-yellow" />} 
                          title="🧒 4-7 Years" 
                          description="Engaging and imaginative" 
                          selected={selectedAgeGroup === '4-7'} 
                          onClick={() => setSelectedAgeGroup('4-7')} 
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faPersonRunning} className="text-3xl text-adventure-green" />} 
                          title="🏃 8-10 Years" 
                          description="Adventurous and complex" 
                          selected={selectedAgeGroup === '8-10'} 
                          onClick={() => setSelectedAgeGroup('8-10')} 
                        />
                      </div>
                    </div>

                    {/* Story Theme */}
                    <div className="mb-8 bg-cream rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faCrown} className="text-2xl text-magic-orange" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          🌟 Adventure Theme
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        What kind of magical journey should we create?
                      </p>
                      {errors.theme && (
                        <p className="text-reading-red friendly-text mb-3">{errors.theme}</p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" style={{ pointerEvents: 'auto' }}>
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faCrown} className="text-3xl text-tale-purple" />} 
                          title="👑 Adventure" 
                          description="Exciting journeys" 
                          selected={selectedTheme === 'adventure'} 
                          onClick={() => setSelectedTheme('adventure')} 
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faCompass} className="text-3xl text-magic-orange" />} 
                          title="🧭 Exploration" 
                          description="Discovering new things" 
                          selected={selectedTheme === 'exploration'} 
                          onClick={() => setSelectedTheme('exploration')} 
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faRocket} className="text-3xl text-adventure-green" />} 
                          title="🚀 Fantasy" 
                          description="Magical worlds" 
                          selected={selectedTheme === 'fantasy'} 
                          onClick={() => setSelectedTheme('fantasy')} 
                        />
                      </div>
                    </div>

                    {/* Book Length */}
                    <div className="mb-8 bg-soft-pink rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-tale-purple" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          📖 Story Length
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-4">
                        How long should your magical adventure be?
                      </p>
                      {errors.pageCount && (
                        <p className="text-reading-red friendly-text mb-3">{errors.pageCount}</p>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ pointerEvents: 'auto' }}>
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faBookOpen} className="text-3xl text-adventure-green" />} 
                          title="📚 17 Pages" 
                          description="Standard length (Base price)" 
                          selected={selectedPageCount === '17'} 
                          onClick={() => setSelectedPageCount('17')} 
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faBookOpen} className="text-3xl text-tale-purple" />} 
                          title="📖 25 Pages" 
                          description="Extended adventure (+$15)" 
                          selected={selectedPageCount === '25'} 
                          onClick={() => setSelectedPageCount('25')} 
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faBookOpen} className="text-3xl text-magic-orange" />} 
                          title="📕 30 Pages" 
                          description="Epic tale (+$30)" 
                          selected={selectedPageCount === '30'} 
                          onClick={() => setSelectedPageCount('30')} 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Review & Payment */}
                {currentStep === 4 && (
                  <div style={{ pointerEvents: 'auto', zIndex: 10 }}>
                    <div className="text-center mb-8">
                      <FontAwesomeIcon icon={faShoppingCart} className="text-6xl text-magic-orange mb-4 sparkle-animation" />
                      <h3 className="friendly-2xl text-inkwell-black mb-4 font-fredoka">
                        🛒 Almost Ready for Magic!
                      </h3>
                      <div className="bg-lavender rounded-magical p-6 border-l-4 border-magic-orange">
                        <p className="friendly-text text-charcoal leading-relaxed">
                          Let's review your magical story details and choose the perfect package for your adventure!
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="mb-8 bg-cream rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faScroll} className="text-2xl text-tale-purple" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          📜 Your Story Summary
                        </h3>
                      </div>
                      <div className="space-y-3 friendly-text text-charcoal">
                        <p><strong>📖 Book Title:</strong> {bookTitle}</p>
                        <p><strong>✨ Story Plot:</strong> {storyDescription ? `"${storyDescription.substring(0, 100)}${storyDescription.length > 100 ? '...' : ''}"` : 'Not yet specified'}</p>
                        <p><strong>🎨 Art Style:</strong> {selectedIllustrationStyle !== 'default' ? selectedIllustrationStyle.charAt(0).toUpperCase() + selectedIllustrationStyle.slice(1) : 'Not yet selected'}</p>
                        <p><strong>👶 Age Group:</strong> {selectedAgeGroup || 'Not selected'} years old</p>
                        <p><strong>🌟 Theme:</strong> {selectedTheme ? selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1) : 'Not selected'}</p>
                        <p><strong>📚 Story Length:</strong> {selectedPageCount} magical pages</p>
                        <p><strong>📖 Book Title:</strong> {bookTitle}</p>
                      </div>
                    </div>

                    {/* Pricing Options */}
                    <div className="mb-8 bg-soft-pink rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faGift} className="text-2xl text-magic-orange" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          🎁 Choose Your Package
                        </h3>
                      </div>
                      <p className="friendly-text text-charcoal mb-6">
                        Select the perfect package for your magical storybook adventure!
                      </p>
                      {errors.payment && (
                        <p className="text-reading-red friendly-text mb-4">{errors.payment}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ pointerEvents: 'auto' }}>
                        <div data-package="basic">
                          <OptionCard 
                            icon={<FontAwesomeIcon icon={faBookOpen} className="text-4xl text-adventure-green" />} 
                            title="📚 Basic Magic"
                            description="$59.99 - Your personalized storybook with beautiful illustrations"
                            selected={selectedPackage === 'basic'}
                            onClick={() => setSelectedPackage('basic')}
                          />
                        </div>
                        <div data-package="premium">
                          <OptionCard 
                            icon={<FontAwesomeIcon icon={faTabletAlt} className="text-4xl text-tale-purple" />} 
                            title="✨ Premium Adventure"
                            description="$69.99 - Physical book + digital eBook for reading anywhere"
                            selected={selectedPackage === 'premium'}
                            onClick={() => setSelectedPackage('premium')}
                          />
                        </div>
                        <div data-package="deluxe">
                          <OptionCard 
                            icon={<FontAwesomeIcon icon={faDragon} className="text-4xl text-magic-orange" />} 
                            title="🏰 Deluxe Kingdom"
                            description="$99.99 - Everything above + activity pack and coloring pages"
                            selected={selectedPackage === 'deluxe'}
                            onClick={() => setSelectedPackage('deluxe')}
                          />
                        </div>
                      </div>
                      <div className="mt-6 bg-lavender rounded-magical p-4">
                        <p className="friendly-text text-charcoal text-center">
                          💳 Secure payment processing by Stripe • 📦 Free shipping on all orders
                        </p>
                      </div>
                      
                      {/* Additional Copies */}
                      <div className="mt-6 bg-cream rounded-magical p-6 shadow-gentle">
                        <div className="flex items-center gap-3 mb-4">
                          <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-tale-purple" />
                          <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                            📚 Additional Copies
                          </h3>
                        </div>
                        <p className="friendly-text text-charcoal mb-4">
                          Would you like additional copies of the same book? Each additional copy is $19.99
                        </p>
                        <div className="flex items-center gap-4">
                          <label className="friendly-text text-charcoal font-medium">Number of additional copies:</label>
                          <select 
                            value={additionalCopies} 
                            onChange={(e) => setAdditionalCopies(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magic-orange focus:border-transparent"
                          >
                            <option value={0}>0 additional copies</option>
                            <option value={1}>1 additional copy (+$19.99)</option>
                            <option value={2}>2 additional copies (+$39.98)</option>
                            <option value={3}>3 additional copies (+$59.97)</option>
                            <option value={4}>4 additional copies (+$79.96)</option>
                            <option value={5}>5 additional copies (+$99.95)</option>
                          </select>
                        </div>
                      </div>

                      {/* Gift Card Purchase */}
                      <div className="mt-6 bg-cream rounded-magical p-6 shadow-gentle">
                        <div className="flex items-center gap-3 mb-4">
                          <FontAwesomeIcon icon={faGift} className="text-2xl text-tale-purple" />
                          <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                            🎁 Add a Gift Card
                          </h3>
                        </div>
                        <p className="friendly-text text-charcoal mb-4">
                          Add a digital gift card to your order - perfect for gifting!
                        </p>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[25, 50, 75, 100].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setGiftCardAmount(amount)}
                                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                  giftCardAmount === amount
                                    ? 'border-magic-orange bg-magic-orange text-white'
                                    : 'border-gray-300 bg-white text-charcoal hover:border-magic-orange'
                                }`}
                              >
                                ${amount}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="friendly-text text-charcoal">Custom amount:</span>
                            <input
                              type="number"
                              min="10"
                              max="500"
                              placeholder="$10-$500"
                              value={customGiftCardAmount}
                              onChange={(e) => {
                                setCustomGiftCardAmount(e.target.value);
                                const amount = parseInt(e.target.value);
                                if (amount >= 10 && amount <= 500) {
                                  setGiftCardAmount(amount);
                                } else {
                                  setGiftCardAmount(0);
                                }
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magic-orange focus:border-transparent w-32"
                            />
                          </div>
                          {giftCardAmount > 0 && (
                            <div className="bg-adventure-green/10 rounded-lg p-3 border-l-4 border-adventure-green">
                              <p className="friendly-text text-charcoal">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-adventure-green mr-2" />
                                Gift card of ${giftCardAmount} will be added to your order.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Gift Card Redemption */}
                      <div className="mt-6 bg-cream rounded-magical p-6 shadow-gentle">
                        <div className="flex items-center gap-3 mb-4">
                          <FontAwesomeIcon icon={faGift} className="text-2xl text-tale-purple" />
                          <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                            🎁 Have a Gift Card?
                          </h3>
                        </div>
                        
                        {!appliedGiftCard ? (
                          <div>
                            <p className="friendly-text text-charcoal mb-4">
                              Enter your gift card code to apply it to this purchase.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="flex-grow">
                                <Input
                                  id="giftCardCode"
                                  label="Gift Card Code"
                                  placeholder="Enter your gift card code"
                                  value={giftCardCode}
                                  onChange={(e) => {
                                    setGiftCardCode(e.target.value);
                                    setGiftCardError(null);
                                  }}
                                />
                              </div>
                              <div className="self-end">
                                <Button
                                  onClick={async () => {
                                    if (!giftCardCode.trim()) {
                                      setGiftCardError('Please enter a gift card code');
                                      return;
                                    }
                                    
                                    setIsCheckingGiftCard(true);
                                    setGiftCardError(null);
                                    
                                    try {
                                      // Cancel any existing reservations for the current applied gift card
                                      if (appliedGiftCard && appliedGiftCard.code) {
                                        await cancelGiftCardReservations(appliedGiftCard.code);
                                      }
                                      
                                      const response = await fetch('/api/gift-cards/check', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ code: giftCardCode.trim() }),
                                      });
                                      
                                      const data = await response.json();
                                      
                                      if (response.ok && data.success) {
                                        setAppliedGiftCard(data.giftCard);
                                      } else {
                                        setGiftCardError(data.error || 'Invalid gift card code');
                                      }
                                    } catch (error) {
                                      console.error('Error checking gift card:', error);
                                      setGiftCardError('An error occurred while checking the gift card');
                                    } finally {
                                      setIsCheckingGiftCard(false);
                                    }
                                  }}
                                  disabled={isCheckingGiftCard}
                                  variant="secondary"
                                >
                                  {isCheckingGiftCard ? 'Checking...' : 'Apply'}
                                </Button>
                              </div>
                            </div>
                            {giftCardError && (
                              <p className="text-reading-red friendly-text mt-2">{giftCardError}</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="bg-adventure-green/10 rounded-magical p-4 mb-4 border-l-4 border-adventure-green">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="friendly-text font-medium text-inkwell-black">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-adventure-green mr-2" />
                                    Gift Card Applied!
                                  </p>
                                  <p className="friendly-text text-charcoal">
                                    ${(appliedGiftCard.remainingAmount / 100).toFixed(2)} will be applied to your order.
                                  </p>
                                </div>
                                <Button
                                  onClick={() => {
                                    setAppliedGiftCard(null);
                                    setGiftCardCode('');
                                  }}
                                  variant="tertiary"
                                  className="text-tale-purple hover:text-magic-orange"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Error Display */}
                {bookState.status === 'failed' && bookState.error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Payment Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{bookState.error}</p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => setBookState(prev => ({ ...prev, status: 'idle', error: null }))}
                            className="text-sm font-medium text-red-800 hover:text-red-600 underline"
                          >
                            Dismiss
                          </button>
                        </div>
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
                        disabled={isLoading || !validateStep()}
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
                        disabled={isLoading || !validateStep()}
                        className="adventure-button clickable-button"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                      >
                        <span className="hidden sm:inline">💳 Proceed to Payment →</span>
                        <span className="sm:hidden">💳 Pay →</span>
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
