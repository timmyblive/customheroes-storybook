/**
 * API client for the CustomHereos AI Service
 * Using Next.js API routes to proxy requests to the AI service
 */

// Define interfaces for book data structure
export interface Page {
  id: number;
  text: string;
  image: string;
  page_number?: number; // If API sometimes returns this
}

export interface BookData {
  title: string;
  coverImage?: string;
  pages: Page[];
  // Potentially other fields like 'author', 'status', 'progress' if relevant for getBook
}

// We'll use relative URLs to our own API routes instead of directly accessing the AI service
// This avoids CORS issues since we're making requests to the same origin

/**
 * Start generating a new book
 */
export async function createBook(formData: FormData): Promise<{ bookId: string; status: string; message: string }> {
  try {
    const response = await fetch(`/api/books`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header as it will be set automatically for FormData
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error creating book:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

interface CreateBookParams {
  childName: string;
  childAge: string;
  theme: string;
  interests: string;
  characterDescription: string;
  pageCount: number;
  photo?: File | null;
}

/**
 * Start generating a new book
 */
export async function createBookWithParams(params: CreateBookParams): Promise<{ bookId: string; status: string; message: string }> {
  const formData = new FormData();
  formData.append('child_name', params.childName);
  formData.append('child_age', params.childAge);
  formData.append('theme', params.theme);
  formData.append('interests', params.interests);
  formData.append('character_description', params.characterDescription);
  formData.append('page_count', String(params.pageCount));

  if (params.photo) {
    formData.append('photo', params.photo);
  }

  try {
    const response = await fetch(`/api/books`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header as it will be set automatically for FormData
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error creating book:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Check the status of a book generation task
 */
export async function getBookStatus(bookId: string): Promise<{ 
  bookId: string; 
  status: string; 
  progress: number;
  startedAt: number;
  completedAt?: number;
}> {
  try {
    const response = await fetch(`/api/books/${bookId}/status`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error getting book status:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get the generated book data
 */
export async function getBook(bookId: string): Promise<BookData> {
  try {
    const response = await fetch(`/api/books/${bookId}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error('Error getting book:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get the URL for a page illustration
 */
export function getPageImageUrl(bookId: string, pageNumber: number): string {
  return `/api/books/${bookId}/pages/${pageNumber}/image`;
}
