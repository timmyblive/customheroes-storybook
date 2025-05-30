import { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBag, faCalendar, faDollarSign } from '@fortawesome/free-solid-svg-icons';

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  productType: string;
  bookTitle: string;
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Auto-populate email from URL query parameter
    if (router.query.email && typeof router.query.email === 'string') {
      setEmail(router.query.email);
      // Auto-search if email is provided
      if (router.query.email.trim()) {
        setHasSearched(true);
        searchOrdersWithEmail(router.query.email);
      }
    }
  }, [router.query.email]);

  const searchOrdersWithEmail = async (emailToSearch: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call your API
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data - in production this would come from your database
      const mockOrders: Order[] = [
        {
          id: 'mock-order-123',
          customerEmail: emailToSearch,
          customerName: 'John Doe',
          productType: 'premium',
          bookTitle: 'Adventure Story',
          total: 5999,
          status: 'completed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      ];

      // Only show orders if email matches (case insensitive)
      const filteredOrders = mockOrders.filter(order => 
        order.customerEmail.toLowerCase() === emailToSearch.toLowerCase()
      );

      setOrders(filteredOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setHasSearched(true);
    await searchOrdersWithEmail(email);
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

  return (
    <Layout title="Your Orders - CustomHeroes">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-adventure-green rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faShoppingBag} className="text-2xl text-white" />
              </div>
              <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-inkwell-black mb-3">
                Your Orders
              </h1>
              <p className="text-charcoal text-lg max-w-2xl mx-auto">
                Enter your email address to view your order history and track your custom storybooks.
              </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8 shadow-level-2">
              <form onSubmit={searchOrders} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-inkwell-black mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal/50"
                    />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-adventure-green focus:border-adventure-green transition-colors text-lg"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 text-lg font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={faSearch} className="animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    'Find My Orders'
                  )}
                </Button>
              </form>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="mb-8 border-2 border-red-200 bg-red-50">
                <div className="text-red-700 text-center py-2">
                  <p className="font-medium">{error}</p>
                </div>
              </Card>
            )}

            {/* Orders List */}
            {hasSearched && !loading && (
              <div>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-adventure-green rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{orders.length}</span>
                      </div>
                      <h2 className="font-montserrat font-bold text-2xl text-inkwell-black">
                        Found {orders.length} order{orders.length !== 1 ? 's' : ''}
                      </h2>
                    </div>
                    
                    {orders.map((order) => (
                      <Card key={order.id} className="hover:shadow-level-3 transition-all duration-200 border-l-4 border-l-adventure-green">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-story-blue/10 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faShoppingBag} className="text-story-blue" />
                              </div>
                              <div>
                                <h3 className="font-montserrat font-bold text-xl text-inkwell-black">
                                  {order.bookTitle}
                                </h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-charcoal">Order ID:</span>
                                  <span className="font-mono text-inkwell-black bg-white px-2 py-1 rounded border">
                                    {order.id}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon icon={faCalendar} className="text-story-blue" />
                                  <span className="text-charcoal">
                                    <span className="font-semibold">Ordered:</span> {new Date(order.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon icon={faDollarSign} className="text-adventure-green" />
                                  <span className="font-bold text-inkwell-black text-lg">{formatPrice(order.total)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-charcoal bg-blue-50 p-3 rounded-lg">
                              <span className="font-semibold">📦 Estimated Delivery:</span> {order.estimatedDelivery}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-3">
                            <Button
                              href={`/orders/${order.id}?email=${encodeURIComponent(order.customerEmail)}`}
                              className="whitespace-nowrap"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-16 shadow-level-2">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FontAwesomeIcon icon={faShoppingBag} className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="font-montserrat font-bold text-2xl text-inkwell-black mb-3">
                      No Orders Found
                    </h3>
                    <p className="text-charcoal mb-6 text-lg">
                      We couldn't find any orders for <strong className="text-inkwell-black">{email}</strong>
                    </p>
                    <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                      <h4 className="font-semibold text-inkwell-black mb-3">💡 Tips:</h4>
                      <div className="space-y-2 text-sm text-charcoal">
                        <p>• Double-check your email address for typos</p>
                        <p>• Try the email you used during checkout</p>
                        <p>• Orders may take a few minutes to appear</p>
                        <p>• Contact support if you need help</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button href="/create">
                        Create Your First Book
                      </Button>
                      <Button variant="secondary" href="/contact">
                        Contact Support
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Help Section */}
            {!hasSearched && (
              <Card className="text-center py-12 shadow-level-2">
                <div className="w-20 h-20 bg-adventure-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faShoppingBag} className="text-3xl text-adventure-green" />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-3">
                  Ready to Find Your Orders?
                </h3>
                <p className="text-charcoal mb-6">
                  Enter your email address above to view all your custom storybook orders and track their progress.
                </p>
                <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
                  <h4 className="font-semibold text-inkwell-black mb-3">🔒 Privacy Protected</h4>
                  <p className="text-sm text-charcoal">
                    We use email-based verification to keep your orders secure. Only you can access your order history using your email address.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
