import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
  typescript: true,
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Product pricing configuration
export const PRODUCT_PRICES = {
  basic: {
    name: 'Basic Magic',
    price: 4999, // $49.99 in cents
    description: '20-page personalized storybook',
    features: [
      '20 pages of magical adventure',
      'High-quality photo integration',
      'Professional printing & binding',
      'Fast 5-7 day delivery'
    ]
  },
  premium: {
    name: 'Premium Adventure',
    price: 5999, // $59.99 in cents
    description: '25-page premium storybook with extras',
    features: [
      '25 pages of epic adventure',
      'Enhanced photo effects',
      'Premium paper & binding',
      'Gift wrapping included',
      'Express 3-5 day delivery'
    ]
  },
  deluxe: {
    name: 'Deluxe Kingdom',
    price: 8999, // $89.99 in cents
    description: '30-page deluxe storybook with special features',
    features: [
      '30 pages of royal adventure',
      'Deluxe photo treatments',
      'Hardcover with dust jacket',
      'Personalized dedication page',
      'Premium gift box',
      'Express 2-3 day delivery'
    ]
  }
} as const;

export type ProductType = keyof typeof PRODUCT_PRICES;
