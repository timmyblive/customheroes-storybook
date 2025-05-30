import { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faShareAlt, faCheck, faLink, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faPinterestP } from '@fortawesome/free-brands-svg-icons';

interface OrderData {
  id: string;
  sessionId: string;
  customerEmail: string;
  customerName: string;
  productType: string;
  bookTitle: string;
  characterName: string;
  total: number;
  status: string;
  createdAt: string;
  date: string;
  estimatedDelivery: string;
  book: {
    title: string;
    coverImage: string;
    pages: number;
  };
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  lineItems?: any[];
}

export default function OrderConfirmation() {
  console.log('OrderConfirmation component rendered');

  const router = useRouter();
  const { session_id } = router.query;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (session_id) {
      fetchOrderDetails(session_id as string);
    }
  }, [session_id]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      setLoading(true);
      
      // Fetch real order details from our API
      const response = await fetch(`/api/order-details?session_id=${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const orderData = await response.json();
      setOrder(orderData);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

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
    if (!order) return;
    const orderLink = `${window.location.origin}/orders/${order.id}`;
    navigator.clipboard.writeText(orderLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Share on social media (mock functionality)
  const shareOnSocial = (platform: string) => {
    if (!order) return;
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

  if (loading) {
    return (
      <Layout title="Order Confirmation - CustomHereos">
        <div className="bg-fog min-h-screen pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-adventure-green mx-auto mb-6" spin />
                <h1 className="font-montserrat font-bold text-3xl mb-2 text-inkwell-black">
                  Loading Order Details...
                </h1>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Order Confirmation - CustomHereos">
        <div className="bg-fog min-h-screen pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-red-500 mx-auto mb-6" />
                <h1 className="font-montserrat font-bold text-3xl mb-2 text-inkwell-black">
                  Error Loading Order Details
                </h1>
                <p className="text-charcoal">
                  {error}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order Confirmation - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-adventure-green rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
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
                    Order #{order?.id}
                  </h2>
                  <p className="text-charcoal text-sm">
                    Placed on {order?.date ? formatDate(order.date) : 'Unknown date'}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    href={`/orders/${order?.id}?email=${encodeURIComponent(order?.customerEmail || '')}`}
                  >
                    View Order Details
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                  <p>{order?.estimatedDelivery}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-sm">
                    {order?.shippingAddress.name}<br />
                    {order?.shippingAddress.line1}<br />
                    {order?.shippingAddress.line2 && <>{order?.shippingAddress.line2}<br /></>}
                    {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.postalCode}<br />
                    {order?.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Method</h3>
                  <p className="text-sm">{order?.shippingMethod}</p>
                  <p className="text-sm mt-2">
                    <strong>Total:</strong> ${order?.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="md:w-1/3">
                <div className="relative w-full h-80 bg-gradient-to-br from-magic-orange to-tale-purple rounded-md shadow-level-2">
                  <Image 
                    src={order?.book.coverImage || "/images/Hero.png"} 
                    alt={order?.book.title || "Custom Storybook"} 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 p-3 rounded-md">
                      <h4 className="font-literata font-bold text-white text-center text-sm">
                        {order?.book.title || "Custom Storybook"}
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
                      <h4 className="font-semibold mb-1">Proof Creation</h4>
                      <p className="text-sm text-charcoal">
                        Our team will review your information and create a personalized preview of your book. This typically takes 3-5 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-story-blue rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Proof Approval & Production</h4>
                      <p className="text-sm text-charcoal">
                        After you approve your proof, your book will be printed and bound with care using high-quality materials. This process takes 12-15 business days for standard shipping, 8-11 business days for expedited shipping, or 5-8 business days for priority shipping.
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
                  <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                  Share
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={copyOrderLink}
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faLink} className="mr-2" />
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
                    <FontAwesomeIcon icon={faFacebookF} />
                  </button>
                  <button 
                    className="w-10 h-10 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('twitter')}
                    aria-label="Share on Twitter"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </button>
                  <button 
                    className="w-10 h-10 bg-[#E60023] text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('pinterest')}
                    aria-label="Share on Pinterest"
                  >
                    <FontAwesomeIcon icon={faPinterestP} />
                  </button>
                  <button 
                    className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center hover:opacity-90"
                    onClick={() => shareOnSocial('email')}
                    aria-label="Share via Email"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button href={`/orders?email=${encodeURIComponent(order?.customerEmail || '')}`}>
                View All Orders
              </Button>
              <Button variant="secondary" href="/create">
                <span className="hidden sm:inline">Create Another Book</span>
                <span className="sm:hidden">New Book</span>
              </Button>
            </div>
            
            {/* Order Access Information */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-literata font-bold text-lg text-inkwell-black mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-600" />
                How to Access Your Order
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>📧 Email-Based Access:</strong> We use your email address ({order?.customerEmail}) to securely access your orders.
                </p>
                <p>
                  <strong>🔍 Find Your Orders:</strong> Visit our orders page and enter your email to view all your purchases.
                </p>
                <p>
                  <strong>🔒 Privacy Protected:</strong> Only you can access your order details using your email address.
                </p>
                <p>
                  <strong>📱 Bookmark This Page:</strong> Save this confirmation page for quick access to your order details.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
