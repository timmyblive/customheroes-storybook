import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faCheckCircle, 
  faSpinner, 
  faShoppingBag, 
  faCalendar, 
  faDollarSign,
  faMapMarkerAlt,
  faTruck,
  faDownload,
  faShare
} from '@fortawesome/free-solid-svg-icons';

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
  trackingNumber?: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailVerification, setEmailVerification] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
    
    // Auto-populate email from URL query parameter
    if (router.query.email && typeof router.query.email === 'string') {
      setEmailVerification(router.query.email);
      // Auto-verify if email is provided and matches
      if (router.query.email.trim()) {
        // We'll verify once the order is loaded
        setTimeout(() => {
          const queryEmail = router.query.email;
          if (order && typeof queryEmail === 'string' && queryEmail.toLowerCase() === order.customerEmail.toLowerCase()) {
            setIsVerified(true);
            setVerificationError('');
          }
        }, 1100); // After order loads
      }
    }
  }, [id, router.query.email, order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch from your API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrder: OrderData = {
        id: id as string,
        sessionId: "cs_test_123",
        customerEmail: "customer@example.com",
        customerName: "John Doe",
        productType: "premium",
        bookTitle: "Adventure Story",
        characterName: "Hero",
        total: 5999,
        status: "completed",
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        book: {
          title: "Adventure Story",
          coverImage: "/images/Hero.png",
          pages: 25
        },
        shippingAddress: {
          name: 'John Doe',
          line1: '123 Main Street',
          line2: 'Apt 4B',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          country: 'US'
        },
        shippingMethod: 'Standard Shipping (5-7 business days)',
        trackingNumber: 'TRK123456789'
      };

      setOrder(mockOrder);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerification.trim()) return;

    // Simple email verification - in production this would be more secure
    if (order && emailVerification.toLowerCase() === order.customerEmail.toLowerCase()) {
      setIsVerified(true);
      setVerificationError('');
    } else {
      setVerificationError('Email address does not match our records for this order.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const getProductFeatures = (productType: string) => {
    const features = {
      basic: ['20-page personalized storybook', 'Digital PDF copy', 'Standard shipping'],
      premium: ['25-page premium storybook', 'Digital PDF copy', 'Premium binding', 'Gift wrapping', 'Priority shipping'],
      deluxe: ['30-page deluxe storybook', 'Digital PDF copy', 'Premium binding', 'Gift wrapping', 'Express shipping', 'Bonus activities']
    };
    return features[productType as keyof typeof features] || features.basic;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-tale-purple via-magic-orange to-tale-purple flex items-center justify-center">
          <Card className="text-center p-8">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-magic-orange animate-spin mb-4" />
            <h2 className="font-literata font-bold text-xl text-inkwell-black mb-2">
              Loading Order Details...
            </h2>
            <p className="text-gray-600">Please wait while we fetch your order information.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-tale-purple via-magic-orange to-tale-purple flex items-center justify-center">
          <Card className="text-center p-8 max-w-md">
            <FontAwesomeIcon icon={faShoppingBag} className="text-6xl text-gray-300 mb-4" />
            <h2 className="font-literata font-bold text-xl text-inkwell-black mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'We couldn\'t find an order with this ID.'}
            </p>
            <div className="space-y-2">
              <Button href="/orders" variant="secondary">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                <span className="sm:hidden">Back</span>
                <span className="hidden sm:inline">Back to Orders</span>
              </Button>
              <Button href="/create">
                <span className="sm:hidden">Create Book</span>
                <span className="hidden sm:inline">Create New Order</span>
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isVerified) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-tale-purple via-magic-orange to-tale-purple flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <Card className="p-8">
              <div className="text-center mb-6">
                <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-magic-orange mb-4" />
                <h2 className="font-literata font-bold text-xl text-inkwell-black mb-2">
                  Verify Your Email
                </h2>
                <p className="text-gray-600">
                  To protect your privacy, please verify your email address to view order details.
                </p>
              </div>

              <form onSubmit={verifyEmail} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-inkwell-black mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailVerification}
                    onChange={(e) => setEmailVerification(e.target.value)}
                    placeholder="Enter the email used for this order"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-magic-orange focus:border-transparent"
                    required
                  />
                </div>

                {verificationError && (
                  <div className="text-red-600 text-sm">
                    {verificationError}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Verify & View Order
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button href="/orders" variant="secondary" size="sm">
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  <span className="sm:hidden">Back</span>
                  <span className="hidden sm:inline">Back to Orders</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-tale-purple via-magic-orange to-tale-purple">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button 
                href="/orders" 
                variant="secondary" 
                size="sm"
                className="!bg-white/20 !text-white hover:!bg-white/30"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                <span className="sm:hidden">Back</span>
                <span className="hidden sm:inline">Back to Orders</span>
              </Button>
              <div>
                <h1 className="font-literata font-bold text-3xl md:text-4xl text-white">
                  Order Details
                </h1>
                <p className="text-white/90">Order #{order.id}</p>
              </div>
            </div>

            {/* Order Status */}
            <Card className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                    <h2 className="font-literata font-bold text-xl text-inkwell-black">
                      {order.book.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                      <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-400" />
                      <span>Delivery: {order.estimatedDelivery}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-gray-400" />
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
                
                {order.trackingNumber && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                    <p className="font-mono font-medium">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Book Preview */}
              <Card>
                <h3 className="font-literata font-bold text-lg text-inkwell-black mb-4">
                  Your Custom Book
                </h3>
                
                <div className="relative w-full h-80 bg-gradient-to-br from-magic-orange to-tale-purple rounded-md shadow-level-2 mb-4">
                  <Image 
                    src={order.book.coverImage} 
                    alt={order.book.title} 
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 p-3 rounded-md">
                      <h4 className="font-literata font-bold text-white text-center text-sm">
                        {order.book.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Character Name:</span>
                    <span className="font-medium">{order.characterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages:</span>
                    <span className="font-medium">{order.book.pages} pages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-medium capitalize">{order.productType}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <h4 className="font-medium text-inkwell-black">Package Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {getProductFeatures(order.productType).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xs" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button size="sm" className="flex-1">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    <FontAwesomeIcon icon={faShare} className="mr-2" />
                    Share
                  </Button>
                </div>
              </Card>

              {/* Order Information */}
              <div className="space-y-6">
                
                {/* Customer Information */}
                <Card>
                  <h3 className="font-literata font-bold text-lg text-inkwell-black mb-4">
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{order.customerEmail}</span>
                    </div>
                  </div>
                </Card>

                {/* Shipping Information */}
                <Card>
                  <h3 className="font-literata font-bold text-lg text-inkwell-black mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-magic-orange" />
                    Shipping Address
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.line1}</p>
                    {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Method:</span>
                      <span className="font-medium">{order.shippingMethod}</span>
                    </div>
                  </div>
                </Card>

                {/* Order Summary */}
                <Card>
                  <h3 className="font-literata font-bold text-lg text-inkwell-black mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </Card>

              </div>
            </div>

            {/* Help Section */}
            <Card className="mt-8 text-center">
              <h3 className="font-literata font-bold text-lg text-inkwell-black mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="secondary" size="sm">
                  Contact Support
                </Button>
                <Button variant="secondary" size="sm">
                  Track Package
                </Button>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
}
