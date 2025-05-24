import { useState, useEffect } from 'react';
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
import { faBaby, faChild, faPersonRunning, faCrown, faCompass, faRocket, faBookOpen, faPalette, faPencilAlt, faCameraRetro, faDragon, faSmileBeam, faShoppingCart, faScroll, faGift, faTabletAlt, faMagicWandSparkles, faCheckCircle, faCircle, faCalculator } from '@fortawesome/free-solid-svg-icons';
import { createBook, getBookStatus, getBook } from '../../utils/bookService';

// Define the steps for the creation process
const steps = [
  { title: 'Upload Photos' },             // Step 1
  { title: 'Story & Style Details' },   // Step 2: Story Description, Styles, Age, Theme, Length
  { title: 'Review & Payment' },        // Step 3: Paywall
  { title: 'Order Review' }              // Step 4: Order Review
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

export default function CreateStorybook() {
  const [currentStep, setCurrentStep] = useState(1);
  const [characterPhotos, setCharacterPhotos] = useState<CharacterPhoto[]>([]);
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedPageCount, setSelectedPageCount] = useState<string>('17');
  const [selectedIllustrationStyle, setSelectedIllustrationStyle] = useState('default'); // Restored for UI style selection
  const [personalMessage, setPersonalMessage] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'deluxe' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [editingPhotoMode, setEditingPhotoMode] = useState<'info' | 'image' | null>(null);
  const [projectNumber, setProjectNumber] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
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
  
  // Generate a stable project number on component mount
  useEffect(() => {
    setProjectNumber(String(Math.floor(Math.random() * 90000) + 10000));
    setIsClient(true); // Set client to true after mount
  }, []);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusInterval) {
        window.clearInterval(statusInterval);
      }
    };
  }, [statusInterval]);
  const [errors, setErrors] = useState({
    photos: '',
    characterNames: '',
    storyDescription: '',
    ageGroup: '',
    theme: '',
    pageCount: '',
    illustrationStyle: '',
    payment: '', // Added for paywall step errors
    characterAges: '', // Added for age validation
    personalMessage: '' // Added for personal message validation
  });

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

    if (currentStep === 1) { // Step 1: Upload Photos
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
    } else if (currentStep === 2) { // New Step 2: Story & Style Details
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
    } else if (currentStep === 3) { // New Step 3: Review & Payment
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
    if (!validateStep()) {
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle form submission (triggered from new Step 3)
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    // Validation for Step 3 (Paywall) would ideally happen before this or be part of its own logic.
    // For now, assume previous steps are valid if this is called.
    
    setCurrentStep(4); // Immediately go to Order Review (new Step 4)
    setIsLoading(true);
    setBookState(prev => ({ ...prev, status: 'submitting', progress: 0.1, error: null }));

    if (statusInterval) {
      window.clearInterval(statusInterval);
      setStatusInterval(null);
    }

    const formData = new FormData();
    characterPhotos.forEach((photo, index) => {
      formData.append(`character_photos[${index}].name`, photo.name);
      formData.append(`character_photos[${index}].relationship`, photo.relationship || '');
      formData.append(`character_photos[${index}].age`, photo.age || ''); // Add age to formData
      formData.append(`character_photos[${index}].image_file`, photo.file);
    });
    formData.append('story_description', storyDescription);
    formData.append('target_age_group', selectedAgeGroup);
    formData.append('story_theme', selectedTheme);
    formData.append('page_count', selectedPageCount);
    formData.append('illustration_style', selectedIllustrationStyle);
    formData.append('personal_message', personalMessage); // Added personal message
    formData.append('package', selectedPackage); // Added package selection
    formData.append('project_id', projectNumber);

    try {
      const createdBookData = await createBook(formData);
      const currentBookId = createdBookData.bookId; // Use local var for polling, corrected to bookId
      setBookState(prev => ({ ...prev, bookId: currentBookId, status: 'processing', progress: 0.2 }));

      const intervalId = window.setInterval(async () => {
        if (currentBookId) {
          try {
            const statusData = await getBookStatus(currentBookId) as { progress: number; status: BookState['status']; error?: string };
            setBookState(prev => ({
              ...prev,
              progress: statusData.progress,
              status: statusData.status, // Type is now BookState['status'] via cast on statusData
              error: statusData.error || null, // Accessing error from the cast type
            }));

            if (statusData.status === 'completed') {
              window.clearInterval(intervalId);
              setStatusInterval(null);
              setIsLoading(false);
              window.location.href = `/create/confirmation?book_id=${currentBookId}`;
            } else if (statusData.status === 'failed') {
              window.clearInterval(intervalId);
              setStatusInterval(null);
              setIsLoading(false);
            }
          } catch (pollError) {
            console.error('Error polling status:', pollError);
            setBookState(prev => ({ ...prev, status: 'failed', error: 'Failed to get story status.' }));
            window.clearInterval(intervalId);
            setStatusInterval(null);
            setIsLoading(false);
          }
        }
      }, 5000);
      setStatusInterval(intervalId);

    } catch (error: any) {
      console.error('Error creating book:', error);
      setBookState(prev => ({
        ...prev,
        status: 'failed',
        error: error.message || 'An unexpected error occurred. Please try again.'
      }));
      setIsLoading(false);
      // UI for failure is handled within Step 4 rendering
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
                    icon={currentStep === 1 ? faCameraRetro : currentStep === 2 ? faPencilAlt : currentStep === 3 ? faCrown : faRocket} 
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
              <form onSubmit={handleSubmit}>
                {/* Step 1: Upload Photos */}
                {currentStep === 1 && (
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
                                label="Character Name *"
                                id={`character-name-${editingPhotoIndex}`}
                                placeholder="e.g., Emma, Grandpa John, Princess Luna"
                                value={characterPhotos[editingPhotoIndex].name}
                                onChange={(e) => updateCharacterName(editingPhotoIndex, e.target.value)}
                                required
                                className="friendly-input"
                              />
                            </div>
                            
                            <div style={{ pointerEvents: 'auto' }}>
                              <Input
                                label="Character Age *"
                                id={`character-age-${editingPhotoIndex}`}
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
                                <option value="friend">Best Friend</option>
                                <option value="cousin">Cousin</option>
                                <option value="pet">Pet</option>
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
                
                {/* Step 2: Story & Style Details */}
                {currentStep === 2 && (
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
                          label="Personal Message *"
                          id="personalMessage"
                          placeholder="Dear Emma, this magical adventure was created just for you! May you always believe in the magic within yourself and never stop dreaming big. Love, Mommy & Daddy ❤️"
                          rows={4}
                          value={personalMessage}
                          onChange={(e) => setPersonalMessage(e.target.value)}
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
                      {errors.storyDescription && (
                        <p className="text-reading-red friendly-text mb-3">{errors.storyDescription}</p>
                      )}
                      <div style={{ pointerEvents: 'auto' }}>
                        <TextArea
                          label="Story Description / Plot Ideas *"
                          id="storyDescription"
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

                {/* Step 3: Review & Payment */}
                {currentStep === 3 && (
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
                        <p><strong>✨ Story Plot:</strong> {storyDescription ? `"${storyDescription.substring(0, 100)}${storyDescription.length > 100 ? '...' : ''}"` : 'Not yet specified'}</p>
                        <p><strong>🎨 Art Style:</strong> {selectedIllustrationStyle !== 'default' ? selectedIllustrationStyle.charAt(0).toUpperCase() + selectedIllustrationStyle.slice(1) : 'Not yet selected'}</p>
                        <p><strong>👶 Perfect For:</strong> {selectedAgeGroup || 'Not yet selected'} years old</p>
                        <p><strong>🌟 Theme:</strong> {selectedTheme ? selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1) : 'Not yet selected'}</p>
                        <p><strong>📖 Length:</strong> {selectedPageCount} magical pages</p>
                        <p><strong>👥 Characters:</strong> {characterPhotos.length} wonderful character{characterPhotos.length !== 1 ? 's' : ''}</p>
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
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faBookOpen} className="text-4xl text-adventure-green" />} 
                          title="📚 Basic Magic"
                          description="$49.99 - Your personalized storybook with beautiful illustrations"
                          selected={selectedPackage === 'basic'}
                          onClick={() => setSelectedPackage('basic')}
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faTabletAlt} className="text-4xl text-tale-purple" />} 
                          title="✨ Premium Adventure"
                          description="$59.99 - Physical book + digital eBook for reading anywhere"
                          selected={selectedPackage === 'premium'}
                          onClick={() => setSelectedPackage('premium')}
                        />
                        <OptionCard 
                          icon={<FontAwesomeIcon icon={faDragon} className="text-4xl text-magic-orange" />} 
                          title="🏰 Deluxe Kingdom"
                          description="$89.99 - Everything above + activity pack and coloring pages"
                          selected={selectedPackage === 'deluxe'}
                          onClick={() => setSelectedPackage('deluxe')}
                        />
                      </div>
                      <div className="mt-6 bg-lavender rounded-magical p-4">
                        <p className="friendly-text text-charcoal text-center">
                          💳 Secure payment processing by Stripe • 📦 Free shipping on all orders
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Order Review */}
                {currentStep === 4 && (
                  <div style={{ pointerEvents: 'auto' }}>
                    <div className="text-center mb-8">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-adventure-green mb-4 sparkle-animation" />
                      <h3 className="friendly-2xl text-inkwell-black mb-4 font-fredoka">
                        🎉 Order Review
                      </h3>
                      <div className="bg-adventure-green/10 rounded-magical p-6 border-l-4 border-adventure-green">
                        <p className="friendly-text text-charcoal leading-relaxed">
                          Please review your magical storybook order before we begin creating your adventure!
                        </p>
                      </div>
                    </div>

                    {/* Complete Order Summary */}
                    <div className="mb-8 bg-cream rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-6">
                        <FontAwesomeIcon icon={faScroll} className="text-2xl text-tale-purple" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          📜 Your Complete Order
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Story Details */}
                        <div className="space-y-4">
                          <h4 className="friendly-lg font-fredoka text-inkwell-black font-semibold">📖 Story Details</h4>
                          <div className="space-y-2 friendly-text text-charcoal">
                            <p><strong>✨ Personal Message:</strong> {personalMessage ? `"${personalMessage.substring(0, 50)}${personalMessage.length > 50 ? '...' : ''}"` : 'Not specified'}</p>
                            <p><strong>🌟 Adventure Plot:</strong> {storyDescription ? `"${storyDescription.substring(0, 50)}${storyDescription.length > 50 ? '...' : ''}"` : 'Not specified'}</p>
                            <p><strong>🎨 Art Style:</strong> {selectedIllustrationStyle !== 'default' ? selectedIllustrationStyle.charAt(0).toUpperCase() + selectedIllustrationStyle.slice(1) : 'Default'}</p>
                            <p><strong>👶 Age Group:</strong> {selectedAgeGroup || 'Not selected'} years old</p>
                            <p><strong>🏰 Theme:</strong> {selectedTheme ? selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1) : 'Not selected'}</p>
                            <p><strong>📚 Story Length:</strong> {selectedPageCount} pages</p>
                          </div>
                        </div>

                        {/* Characters & Package */}
                        <div className="space-y-4">
                          <h4 className="friendly-lg font-fredoka text-inkwell-black font-semibold">👥 Characters & Package</h4>
                          <div className="space-y-2 friendly-text text-charcoal">
                            <p><strong>👥 Characters:</strong> {characterPhotos.length} wonderful character{characterPhotos.length !== 1 ? 's' : ''}</p>
                            {characterPhotos.map((photo, index) => (
                              <div key={index} className="ml-4 text-sm">
                                • {photo.name || `Character ${index + 1}`} ({photo.age || 'Age not specified'}) - {photo.relationship || 'Relationship not specified'}
                              </div>
                            ))}
                            <p><strong>📦 Package:</strong> {
                              selectedPackage === 'basic' ? '📚 Basic Magic ($49.99)' :
                              selectedPackage === 'premium' ? '✨ Premium Adventure ($59.99)' :
                              selectedPackage === 'deluxe' ? '🏰 Deluxe Kingdom ($89.99)' :
                              'Not selected'
                            }</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="mb-8 bg-soft-pink rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <FontAwesomeIcon icon={faCalculator} className="text-2xl text-magic-orange" />
                        <h3 className="friendly-lg font-fredoka text-inkwell-black font-semibold">
                          💰 Pricing Breakdown
                        </h3>
                      </div>
                      
                      <div className="space-y-3 friendly-text text-charcoal">
                        <div className="flex justify-between items-center">
                          <span>Base Package ({
                            selectedPackage === 'basic' ? 'Basic Magic' :
                            selectedPackage === 'premium' ? 'Premium Adventure' :
                            selectedPackage === 'deluxe' ? 'Deluxe Kingdom' :
                            'No package selected'
                          }):</span>
                          <span className="font-semibold">${
                            selectedPackage === 'basic' ? '49.99' :
                            selectedPackage === 'premium' ? '59.99' :
                            selectedPackage === 'deluxe' ? '89.99' :
                            '0.00'
                          }</span>
                        </div>
                        
                        {selectedPageCount !== '17' && (
                          <div className="flex justify-between items-center">
                            <span>Additional Pages ({selectedPageCount} pages):</span>
                            <span className="font-semibold">+${
                              selectedPageCount === '25' ? '15.00' :
                              selectedPageCount === '30' ? '30.00' :
                              '0.00'
                            }</span>
                          </div>
                        )}
                        
                        <div className="border-t border-fog/30 pt-3 mt-3">
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-adventure-green">${
                              (selectedPackage === 'basic' ? 49.99 :
                               selectedPackage === 'premium' ? 59.99 :
                               selectedPackage === 'deluxe' ? 89.99 : 0) +
                              (selectedPageCount === '25' ? 15 :
                               selectedPageCount === '30' ? 30 : 0)
                            }</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation Message */}
                    <div className="mb-8 bg-lavender rounded-magical p-6 shadow-gentle relative z-10" style={{ pointerEvents: 'auto' }}>
                      <div className="text-center">
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="text-3xl text-magic-orange mb-4" />
                        <h4 className="friendly-lg font-fredoka text-inkwell-black font-semibold mb-3">
                          🪄 Ready to Create Magic?
                        </h4>
                        <p className="friendly-text text-charcoal mb-4">
                          Once you confirm your order, we'll begin crafting your personalized storybook adventure. 
                          This magical process typically takes 1-2 business days.
                        </p>
                        <div className="bg-adventure-green/10 rounded-magical p-4">
                          <p className="friendly-text text-charcoal">
                            💳 Secure payment • 📦 Free shipping • ✨ 100% satisfaction guarantee
                          </p>
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
                    {currentStep < 3 && (
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
                    {currentStep === 3 && (
                      <Button 
                        type="submit" 
                        disabled={isLoading || !validateStep()}
                        className="adventure-button clickable-button"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                      >
                        📋 Review Order →
                      </Button>
                    )}
                    {currentStep === 4 && (
                      <Button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="adventure-button clickable-button"
                        style={{ pointerEvents: 'auto', position: 'relative' }}
                      >
                        🪄 Confirm & Create My Magic Book
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
