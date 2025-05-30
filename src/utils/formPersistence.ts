/**
 * Form Persistence Utility
 * 
 * This utility provides functions to save and retrieve form data across
 * the book creation process, ensuring users don't lose their progress
 * when navigating between pages or using the browser back button.
 */

const STORAGE_KEY = 'customHeroes_bookCreationData';

// Types for the stored data
export interface BookCreationData {
  // Basic information
  bookTitle?: string;
  theme?: string;
  mainCharacter?: {
    name?: string;
    age?: string;
    gender?: string;
    traits?: string[];
  };
  characterPhotos?: Array<{
    id?: string;
    name?: string;
    age?: string;
    relationship?: string;
    imageUrl?: string;
  }>;
  
  // Complete story object (for review page)
  story?: any; // Using any for flexibility with the mock data structure
  
  // Customization options
  customizations?: {
    quantity?: number;
    additionalOptions?: string[];
    dedicationMessage?: string;
  };
  
  // Shipping and payment
  shippingAddress?: any; // Using any for flexibility with the mock address structure
  additionalCopies?: number;
  promoCode?: string;
  promoCodeSuccess?: string;
  discount?: number;
  
  // Current step tracking
  currentStep?: number;
  lastUpdated?: number;
  
  // Allow dynamic properties for flexibility
  [key: string]: any;
}

/**
 * Save book creation data to localStorage
 */
export const saveBookCreationData = (data: Partial<BookCreationData>): void => {
  try {
    // Get existing data
    const existingData = getBookCreationData();
    
    // Merge with new data
    const updatedData = {
      ...existingData,
      ...data,
      lastUpdated: Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    console.log('Book creation data saved successfully');
  } catch (error) {
    console.error('Error saving book creation data:', error);
  }
};

/**
 * Get book creation data from localStorage
 */
export const getBookCreationData = (): BookCreationData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error retrieving book creation data:', error);
  }
  
  return {}; // Return empty object if no data found or error occurs
};

/**
 * Clear book creation data from localStorage
 */
export const clearBookCreationData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Book creation data cleared successfully');
  } catch (error) {
    console.error('Error clearing book creation data:', error);
  }
};

/**
 * Update specific field in book creation data
 */
export const updateBookCreationField = (field: string, value: any): void => {
  try {
    const existingData = getBookCreationData();
    existingData[field] = value;
    saveBookCreationData(existingData);
  } catch (error) {
    console.error(`Error updating ${field} in book creation data:`, error);
  }
};

/**
 * Save current step in the book creation process
 */
export const saveCurrentStep = (step: number): void => {
  updateBookCreationField('currentStep', step);
};

/**
 * Get the last saved step in the book creation process
 */
export const getLastSavedStep = (): number => {
  const data = getBookCreationData();
  return data.currentStep || 1; // Default to step 1 if no step saved
};

export default {
  saveBookCreationData,
  getBookCreationData,
  clearBookCreationData,
  updateBookCreationField,
  saveCurrentStep,
  getLastSavedStep
};
