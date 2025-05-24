import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Image from 'next/image';
import ProgressBar from '../../components/ui/ProgressBar';

// Define the steps for the creation process
const steps = [
  { title: 'Upload Photos' },
  { title: 'Describe Story' },
  { title: 'Preview & Edit' },
  { title: 'Customize Book' },
  { title: 'Review & Order' }
];

// Mock data for demonstration
const mockStory = {
  title: "Emma's Magical Adventure",
  coverImage: "/file.svg",
  pages: 12,
  customizations: {
    coverType: 'Hardcover',
    size: 'Standard (8" x 8")',
    paperQuality: 'Premium',
    pageFinish: 'Matte',
    quantity: 1,
    additionalOptions: ['Digital Copy']
  }
};

const mockShippingAddress = {
  name: 'Emma Rodriguez',
  line1: '123 Main Street',
  line2: 'Apt 4B',
  city: 'Chicago',
  state: 'IL',
  postalCode: '60601',
  country: 'United States'
};

const mockPaymentMethod = {
  type: 'Visa',
  last4: '4242',
  expiryMonth: 12,
  expiryYear: 2026
};

export default function ReviewOrder() {
  const [currentStep, setCurrentStep] = useState(5); // Review & Order is step 5
  const [story, setStory] = useState(mockStory);
  const [shippingAddress, setShippingAddress] = useState(mockShippingAddress);
  const [paymentMethod, setPaymentMethod] = useState(mockPaymentMethod);
  const [isLoading, setIsLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeError, setPromoCodeError] = useState('');
  const [promoCodeSuccess, setPromoCodeSuccess] = useState('');
  const [discount, setDiscount] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  // Calculate prices
  const calculatePrices = () => {
    const basePrice = 29.99; // Base price for hardcover standard book
    const additionalOptionsPrice = story.customizations.additionalOptions.includes('Digital Copy') ? 9.99 : 0;
    const subtotal = basePrice * story.customizations.quantity + additionalOptionsPrice;
    const shipping = 4.99;
    const tax = subtotal * 0.07; // 7% tax rate
    const discountAmount = discount > 0 ? (subtotal * (discount / 100)) : 0;
    const total = subtotal + shipping + tax - discountAmount;
    
    return {
      basePrice,
      additionalOptionsPrice,
      subtotal,
      shipping,
      tax,
      discountAmount,
      total
    };
  };

  const prices = calculatePrices();

  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoCodeError('Please enter a promo code');
      return;
    }
    
    // Simulate API call to validate promo code
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      setPromoCodeSuccess('10% discount applied!');
      setPromoCodeError('');
    } else {
      setPromoCodeError('Invalid promo code');
      setPromoCodeSuccess('');
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    if (!agreeToTerms) {
      setTermsError('You must agree to the terms and conditions');
      isValid = false;
    } else {
      setTermsError('');
    }
    
    return isValid;
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/create/confirmation';
    }, 2000);
  };

  return (
    <Layout title="Review & Order - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-paper-white rounded-card shadow-level-3 overflow-hidden">
            {/* Header */}
            <div className="bg-brand-gradient text-white px-6 py-4 flex justify-between items-center">
              <h1 className="font-montserrat font-semibold text-lg">Create Your Storybook</h1>
              <span className="text-sm">Project #{Math.floor(Math.random() * 90000) + 10000}</span>
            </div>
            
            {/* Progress Bar */}
            <ProgressBar steps={steps} currentStep={currentStep} />
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="font-montserrat font-bold text-2xl mb-3 text-inkwell-black">
                  Step 5: Review & Order
                </h2>
                <p className="text-charcoal mb-6">
                  Review your storybook details, shipping information, and payment method before placing your order.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Order Summary */}
                  <div className="lg:col-span-2">
                    {/* Book Details */}
                    <Card className="mb-6">
                      <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mb-4">
                        Book Details
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="sm:w-1/3">
                          <div className="relative" style={{ maxWidth: '200px' }}>
                            <Image 
                              src={story.coverImage} 
                              alt={story.title || "Book Cover"} 
                              layout="fill"
                              objectFit="contain"
                              className="rounded-md shadow-level-2"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 p-2 rounded-md">
                                <h4 className="font-literata font-bold text-white text-center text-sm">
                                  {story.title}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="sm:w-2/3">
                          <h4 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                            {story.title}
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-charcoal">Pages:</span>
                              <span>{story.pages}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-charcoal">Cover Type:</span>
                              <span>{story.customizations.coverType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-charcoal">Size:</span>
                              <span>{story.customizations.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-charcoal">Paper Quality:</span>
                              <span>{story.customizations.paperQuality}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-charcoal">Page Finish:</span>
                              <span>{story.customizations.pageFinish}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-charcoal">Quantity:</span>
                              <span>{story.customizations.quantity}</span>
                            </div>
                            {story.customizations.additionalOptions.length > 0 && (
                              <div className="flex justify-between">
                                <span className="text-charcoal">Additional Options:</span>
                                <span>{story.customizations.additionalOptions.join(', ')}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              href="/create/customize"
                            >
                              Edit Book Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Shipping Information */}
                    <Card className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-montserrat font-semibold text-xl text-inkwell-black">
                          Shipping Information
                        </h3>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          href="/profile/addresses"
                        >
                          Change
                        </Button>
                      </div>
                      
                      <div className="text-charcoal">
                        <p className="font-semibold">{shippingAddress.name}</p>
                        <p>{shippingAddress.line1}</p>
                        {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                        <p>{shippingAddress.country}</p>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold mb-2">Shipping Method</h4>
                        <div className="flex items-center">
                          <input
                            id="standard-shipping"
                            type="radio"
                            name="shipping-method"
                            className="h-4 w-4 text-story-blue border-gray-300"
                            defaultChecked
                          />
                          <label htmlFor="standard-shipping" className="ml-2 block text-sm">
                            Standard Shipping (5-7 business days) - $4.99
                          </label>
                        </div>
                        <div className="flex items-center mt-2">
                          <input
                            id="express-shipping"
                            type="radio"
                            name="shipping-method"
                            className="h-4 w-4 text-story-blue border-gray-300"
                          />
                          <label htmlFor="express-shipping" className="ml-2 block text-sm">
                            Express Shipping (2-3 business days) - $9.99
                          </label>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Payment Method */}
                    <Card className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-montserrat font-semibold text-xl text-inkwell-black">
                          Payment Method
                        </h3>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          href="/profile/payment"
                        >
                          Change
                        </Button>
                      </div>
                      
                      <div className="flex items-center">
                        <i className={`fab fa-cc-${paymentMethod.type.toLowerCase()} text-3xl mr-3`}></i>
                        <div>
                          <p className="font-semibold">{paymentMethod.type} ending in {paymentMethod.last4}</p>
                          <p className="text-sm text-charcoal">
                            Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Terms and Conditions */}
                    <div className="mb-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            type="checkbox"
                            className="h-4 w-4 text-story-blue border-gray-300 rounded"
                            checked={agreeToTerms}
                            onChange={() => setAgreeToTerms(!agreeToTerms)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="text-charcoal">
                            I agree to the{' '}
                            <a href="/terms" className="text-story-blue hover:underline">Terms of Service</a>,{' '}
                            <a href="/privacy" className="text-story-blue hover:underline">Privacy Policy</a>, and{' '}
                            <a href="/returns" className="text-story-blue hover:underline">Return Policy</a>.
                          </label>
                        </div>
                      </div>
                      {termsError && (
                        <p className="mt-1 text-reading-red text-sm">{termsError}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column - Order Summary */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                      <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mb-4">
                        Order Summary
                      </h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-charcoal">Book Price:</span>
                          <span>${prices.basePrice.toFixed(2)}</span>
                        </div>
                        
                        {prices.additionalOptionsPrice > 0 && (
                          <div className="flex justify-between">
                            <span className="text-charcoal">Additional Options:</span>
                            <span>${prices.additionalOptionsPrice.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-charcoal">Quantity:</span>
                          <span>x{story.customizations.quantity}</span>
                        </div>
                        
                        <div className="flex justify-between font-semibold">
                          <span>Subtotal:</span>
                          <span>${prices.subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-charcoal">Shipping:</span>
                          <span>${prices.shipping.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-charcoal">Tax:</span>
                          <span>${prices.tax.toFixed(2)}</span>
                        </div>
                        
                        {prices.discountAmount > 0 && (
                          <div className="flex justify-between text-adventure-green">
                            <span>Discount ({discount}%):</span>
                            <span>-${prices.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="border-t border-b border-gray-200 py-3 mb-4">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span>${prices.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Promo Code */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Promo Code
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-story-blue"
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <button
                            type="button"
                            className="adventure-button px-4 py-2 rounded-r-md transition-colors"
                            onClick={applyPromoCode}
                          >
                            Apply
                          </button>
                        </div>
                        {promoCodeError && (
                          <p className="mt-1 text-reading-red text-sm">{promoCodeError}</p>
                        )}
                        {promoCodeSuccess && (
                          <p className="mt-1 text-adventure-green text-sm">{promoCodeSuccess}</p>
                        )}
                      </div>
                      
                      <Button
                        className="w-full justify-center"
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Place Order'}
                      </Button>
                      
                      <p className="text-xs text-center text-charcoal mt-4">
                        By placing your order, you agree to our terms and conditions. Your card will be charged upon order confirmation.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="secondary" 
                  href="/create/customize"
                >
                  Back to Customize
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
