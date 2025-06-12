/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string to include time
 * @param dateString - The date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format time only from a date string (client-safe)
 * @param dateString - The date string to format
 * @returns Formatted time string
 */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Client-safe date formatter that prevents hydration mismatches
 * @param dateString - The date string to format
 * @returns Object with date and time strings
 */
export function formatDateSafe(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  
  // Use consistent formatting with explicit locale and options
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC' // Force UTC to prevent timezone differences
  });
  
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC' // Force UTC to prevent timezone differences
  });
  
  return { date: dateStr, time: timeStr };
}
