/**
 * Form Data Manager
 * 
 * A utility for managing form data persistence throughout the book creation process.
 * This ensures users don't lose their progress when navigating between pages
 * or using the browser back button.
 */

// Storage key for the form data
const STORAGE_KEY = 'customHeroes_formData';

/**
 * Save form data to localStorage
 */
export const saveFormData = (key: string, data: any): void => {
  try {
    // Get existing data
    const existingData = getAllFormData();
    
    // Update with new data
    const updatedData = {
      ...existingData,
      [key]: data,
      lastUpdated: Date.now()
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

/**
 * Get all form data from localStorage
 */
export const getAllFormData = (): Record<string, any> => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error retrieving form data:', error);
  }
  
  return {}; // Return empty object if no data found or error occurs
};

/**
 * Get specific form data by key
 */
export const getFormData = (key: string): any => {
  const allData = getAllFormData();
  return allData[key];
};

/**
 * Clear all form data
 */
export const clearAllFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};

/**
 * Clear specific form data by key
 */
export const clearFormData = (key: string): void => {
  try {
    const allData = getAllFormData();
    if (allData[key]) {
      delete allData[key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    }
  } catch (error) {
    console.error(`Error clearing form data for ${key}:`, error);
  }
};

/**
 * Save current step in the book creation process
 */
export const saveCurrentStep = (step: number): void => {
  saveFormData('currentStep', step);
};

/**
 * Get the last saved step in the book creation process
 */
export const getCurrentStep = (): number => {
  return getFormData('currentStep') || 1;
};

/**
 * Setup event listeners for browser navigation
 */
export const setupBrowserNavigationHandlers = (saveCallback: () => void): () => void => {
  // Save data before page unload (refresh, close, etc.)
  const handleBeforeUnload = () => {
    saveCallback();
  };
  
  // Handle browser back/forward buttons
  const handlePopState = () => {
    saveCallback();
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('popstate', handlePopState);
  };
};

export default {
  saveFormData,
  getFormData,
  getAllFormData,
  clearFormData,
  clearAllFormData,
  saveCurrentStep,
  getCurrentStep,
  setupBrowserNavigationHandlers
};
