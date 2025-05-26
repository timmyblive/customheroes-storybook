import { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faEye, 
  faCheckCircle, 
  faEdit, 
  faShippingFast,
  faSpinner,
  faSearch,
  faFilter,
  faDownload,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { Order, OrderStatus } from '../../../types/order';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingData, setShippingData] = useState({
    carrier: '',
    trackingNumber: '',
    trackingUrl: ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      
      if (!response.ok) {
        throw new Error('Failed to load orders');
      }
      
      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { color: string; text: string }> = {
      pending: { color: 'bg-gray-100 text-gray-800', text: 'Pending' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Payment Complete' },
      proof_generation: { color: 'bg-yellow-100 text-yellow-800', text: 'Generating Proof' },
      proof_sent: { color: 'bg-purple-100 text-purple-800', text: 'Proof Sent' },
      proof_approved: { color: 'bg-green-100 text-green-800', text: 'Proof Approved' },
      proof_revision: { color: 'bg-orange-100 text-orange-800', text: 'Revision Requested' },
      printing: { color: 'bg-indigo-100 text-indigo-800', text: 'Printing' },
      shipped: { color: 'bg-teal-100 text-teal-800', text: 'Shipped' },
      delivered: { color: 'bg-emerald-100 text-emerald-800', text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status || 'Unknown' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleSendProof = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh orders list to show updated status
        await loadOrders();
        // You could also show a success message here
        console.log('Proof sent successfully');
      } else {
        console.error('Failed to send proof');
      }
    } catch (error) {
      console.error('Error sending proof:', error);
    }
  };

  const handleUpdateShipping = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/update-shipping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingData),
      });

      if (response.ok) {
        // Refresh orders list
        await loadOrders();
        setShowShippingModal(false);
        setSelectedOrder(null);
        setShippingData({ carrier: '', trackingNumber: '', trackingUrl: '' });
      }
    } catch (error) {
      console.error('Error updating shipping:', error);
    }
  };

  if (loading) {
    return (
      <Layout title="Admin - Orders - CustomHeroes">
        <div className="bg-fog min-h-screen pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="text-4xl text-story-blue animate-spin mb-4" />
              <p className="text-charcoal">Loading orders...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin - Orders - CustomHeroes">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-adventure-green rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faBox} className="text-xl text-white" />
              </div>
              <div>
                <h1 className="font-montserrat font-bold text-3xl text-inkwell-black">
                  Order Management
                </h1>
                <p className="text-charcoal">Manage proofs, printing, and shipping</p>
              </div>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-level-1">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    />
                    <input
                      type="text"
                      placeholder="Search orders, customers, or books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-story-blue focus:border-story-blue"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-story-blue focus:border-story-blue"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Payment Complete</option>
                    <option value="proof_generation">Generating Proof</option>
                    <option value="proof_sent">Proof Sent</option>
                    <option value="proof_approved">Proof Approved</option>
                    <option value="proof_revision">Revision Requested</option>
                    <option value="printing">Printing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="shadow-level-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-montserrat font-bold text-lg text-inkwell-black">
                          {order.bookTitle}
                        </h3>
                        <p className="text-sm text-charcoal">Order #{order.id}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-charcoal">Customer</p>
                        <p className="text-inkwell-black">{order.customerName}</p>
                        <p className="text-charcoal">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">Product</p>
                        <p className="text-inkwell-black">{order.productType}</p>
                        <p className="text-charcoal">${(order.total / 100).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">Created</p>
                        <p className="text-inkwell-black">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-charcoal">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    
                    {/* View Proof */}
                    {order.proof?.url && (
                      <Button
                        href={order.proof.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View Proof
                      </Button>
                    )}

                    {/* Send Proof */}
                    {(order.status === 'completed' || order.status === 'proof_generation') && (
                      <Button
                        onClick={() => handleSendProof(order.id)}
                        variant="secondary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                        Send Proof
                      </Button>
                    )}

                    {/* Mark as Shipped */}
                    {(order.status === 'proof_approved' || order.status === 'printing') && (
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowShippingModal(true);
                        }}
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faShippingFast} className="mr-1" />
                        Ship Order
                      </Button>
                    )}

                    {/* View Details */}
                    <Button
                      href={`/admin/orders/${order.id}`}
                      variant="secondary"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredOrders.length === 0 && (
              <Card className="text-center py-12">
                <FontAwesomeIcon icon={faBox} className="text-4xl text-gray-400 mb-4" />
                <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-2">
                  No Orders Found
                </h3>
                <p className="text-charcoal">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No orders have been placed yet.'
                  }
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Shipping Modal */}
        {showShippingModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-4">
                Update Shipping Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-inkwell-black mb-2">
                    Carrier
                  </label>
                  <select
                    value={shippingData.carrier}
                    onChange={(e) => setShippingData({...shippingData, carrier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-story-blue focus:border-story-blue"
                    required
                  >
                    <option value="">Select Carrier</option>
                    <option value="UPS">UPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL">DHL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-inkwell-black mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={shippingData.trackingNumber}
                    onChange={(e) => setShippingData({...shippingData, trackingNumber: e.target.value})}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-story-blue focus:border-story-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-inkwell-black mb-2">
                    Tracking URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={shippingData.trackingUrl}
                    onChange={(e) => setShippingData({...shippingData, trackingUrl: e.target.value})}
                    placeholder="Custom tracking URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-story-blue focus:border-story-blue"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleUpdateShipping}
                  disabled={!shippingData.carrier || !shippingData.trackingNumber}
                  className="flex-1"
                >
                  <FontAwesomeIcon icon={faShippingFast} className="mr-2" />
                  Update & Notify Customer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowShippingModal(false);
                    setSelectedOrder(null);
                    setShippingData({ carrier: '', trackingNumber: '', trackingUrl: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
