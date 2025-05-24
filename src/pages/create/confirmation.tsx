import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Image from 'next/image';

// Mock data for demonstration
const mockOrder = {
  id: 'ORD-12347',
  date: new Date().toISOString(),
  total: 44.97,
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  book: {
    title: "Emma's Magical Adventure",
    coverImage: "/images/book-cover-placeholder.jpg",
    pages: 12
  },
  shippingAddress: {
    name: 'Emma Rodriguez',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'United States'
  },
  shippingMethod: 'Standard Shipping (5-7 business days)'
};

export default function OrderConfirmation() {
  const [order] = useState(mockOrder);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Copy order link to clipboard
  const copyOrderLink = () => {
    const orderLink = `${window.location.origin}/orders/${order.id}`;
    navigator.clipboard.writeText(orderLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };
  
  // Share on social media (mock functionality)
  const shareOnSocial = (platform: string) => {
    const orderLink = `${window.location.origin}/orders/${order.id}`;
    const message = `I just created a personalized storybook "${order.book.title}" on CustomHereos!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(orderLink)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(orderLink)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(orderLink)}&description=${encodeURIComponent(message)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`Check out my personalized storybook from CustomHereos`)}&body=${encodeURIComponent(`${message}\n\nView it here: ${orderLink}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };
  
  // Confetti effect on page load
  useEffect(() => {
    // This would be implemented with a confetti library in a real application
    console.log('Confetti effect would play here');
  }, []);

  return (
    <Layout title="Order Confirmation - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-adventure-green rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-4xl text-white"></i>
              </div>
              <h1 className="font-montserrat font-bold text-3xl mb-2 text-inkwell-black">
                Thank You for Your Order!
              </h1>
              <p className="text-charcoal">
                Your personalized storybook is on its way to becoming a reality.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-story-blue/20 rounded-md p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h2 className="font-montserrat font-semibold text-xl text-inkwell-black mb-1">
                    Order #{order.id}
                  </h2>
                  <p className="text-charcoal text-sm">
                    Placed on {formatDate(order.date)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    href={`/orders/${order.id}`}
                  >
                    View Order Details
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                  <p>{order.estimatedDelivery}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-sm">
                    {order.shippingAddress.name}<br />
                    {order.shippingAddress.line1}<br />
                    {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Method</h3>
                  <p className="text-sm">{order.shippingMethod}</p>
                  <p className="text-sm mt-2">
                    <strong>Total:</strong> ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="md:w-1/3">
                <div className="relative">
                  <Image 
                    src={order.book.coverImage} 
                    alt={order.book.title} 
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md shadow-level-2"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 p-3 rounded-md">
                      <h4 className="font-literata font-bold text-white text-center text-sm">
                        {order.book.title}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mb-4">
                  What Happens Next?
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-story-blue rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Production</h4>
                      <p className="text-sm text-charcoal">
                        Our team will review your storybook and prepare it for printing. This typically takes 1-2 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-story-blue rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Printing & Binding</h4>
                      <p className="text-sm text-charcoal">
                        Your book will be printed and bound with care using high-quality materials. This process takes 2-3 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-story-blue rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Shipping</h4>
                      <p className="text-sm text-charcoal">
                        Once your book is ready, we&apos;ll ship it to your address. You&apos;ll receive a tracking number via email.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-story-blue rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Delivery</h4>
                      <p className="text-sm text-charcoal">
                        Your magical storybook will arrive at your doorstep, ready to create lasting memories!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mb-4 text-center">
                Share Your Creation
              </h3>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Share
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={copyOrderLink}
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-link'} mr-2`}></i>
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
              
              {showShareOptions && (
                <div className="flex justify-center mt-4 gap-4">
                  <button 
                    className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('facebook')}
                    aria-label="Share on Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button 
                    className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('twitter')}
                    aria-label="Share on Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button 
                    className="w-10 h-10 bg-[#E60023] text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('pinterest')}
                    aria-label="Share on Pinterest"
                  >
                    <i className="fab fa-pinterest-p"></i>
                  </button>
                  <button 
                    className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('email')}
                    aria-label="Share via Email"
                  >
                    <i className="fas fa-envelope"></i>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button href="/orders">
                View All Orders
              </Button>
              <Button variant="secondary" href="/create">
                Create Another Book
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
