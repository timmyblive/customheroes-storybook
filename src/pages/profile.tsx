import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Mock data for demonstration
const mockUser = {
  firstName: 'Emma',
  lastName: 'Rodriguez',
  email: 'emma.rodriguez@example.com',
  phone: '(555) 123-4567',
  profilePicture: '/globe.svg'
};

const mockOrders = [
  {
    id: 'ORD-12345',
    date: '2025-04-15',
    status: 'Delivered',
    title: 'Emma\'s Space Adventure',
    price: 29.99,
    coverImage: '/file.svg'
  },
  {
    id: 'ORD-12346',
    date: '2025-05-02',
    status: 'Processing',
    title: 'Emma and the Enchanted Forest',
    price: 34.99,
    coverImage: '/file.svg'
  }
];

const mockAddresses = [
  {
    id: 1,
    name: 'Home',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'United States',
    isDefault: true
  }
];

const mockPaymentMethods = [
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true
  }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };
  
  return (
    <Layout title="My Profile - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={userData.profilePicture || '/globe.svg'} 
                      alt={`${userData.firstName} ${userData.lastName}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-montserrat font-bold text-xl text-inkwell-black">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <p className="text-charcoal text-sm">{userData.email}</p>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === 'profile' 
                            ? 'bg-story-blue text-white' 
                            : 'text-charcoal hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('profile')}
                      >
                        <i className="fas fa-user mr-3"></i>
                        Profile Information
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === 'orders' 
                            ? 'bg-story-blue text-white' 
                            : 'text-charcoal hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('orders')}
                      >
                        <i className="fas fa-book mr-3"></i>
                        My Orders
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === 'addresses' 
                            ? 'bg-story-blue text-white' 
                            : 'text-charcoal hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('addresses')}
                      >
                        <i className="fas fa-map-marker-alt mr-3"></i>
                        Addresses
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === 'payment' 
                            ? 'bg-story-blue text-white' 
                            : 'text-charcoal hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('payment')}
                      >
                        <i className="fas fa-credit-card mr-3"></i>
                        Payment Methods
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeTab === 'preferences' 
                            ? 'bg-story-blue text-white' 
                            : 'text-charcoal hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('preferences')}
                      >
                        <i className="fas fa-cog mr-3"></i>
                        Preferences
                      </button>
                    </li>
                  </ul>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button 
                    variant="secondary" 
                    className="w-full justify-center"
                    href="/logout"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Sign Out
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:w-3/4">
              <Card className="p-6">
                {/* Profile Information */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-montserrat font-bold text-2xl text-inkwell-black">
                        Profile Information
                      </h2>
                      {!isEditing && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Edit
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <form onSubmit={handleSaveProfile}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <Input
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                          <Input
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <Input
                            label="Email Address"
                            id="email"
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            required
                          />
                          <Input
                            label="Phone Number"
                            id="phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-4">
                          <Button 
                            variant="secondary" 
                            type="button" 
                            onClick={() => {
                              setIsEditing(false);
                              setUserData(mockUser); // Reset to original data
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm text-charcoal mb-1">First Name</h3>
                            <p className="font-semibold">{userData.firstName}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-charcoal mb-1">Last Name</h3>
                            <p className="font-semibold">{userData.lastName}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm text-charcoal mb-1">Email Address</h3>
                            <p className="font-semibold">{userData.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm text-charcoal mb-1">Phone Number</h3>
                            <p className="font-semibold">{userData.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            href="/change-password"
                          >
                            Change Password
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Orders */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6">
                      My Orders
                    </h2>
                    
                    {mockOrders.length > 0 ? (
                      <div className="space-y-6">
                        {mockOrders.map((order) => (
                          <div 
                            key={order.id} 
                            className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row gap-4"
                          >
                            <div className="sm:w-1/4">
                              <img 
                                src={order.coverImage} 
                                alt={order.title} 
                                className="w-full h-40 object-cover rounded-md shadow-level-1"
                              />
                            </div>
                            <div className="sm:w-3/4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-montserrat font-semibold text-lg text-inkwell-black">
                                  {order.title}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'Delivered' 
                                    ? 'bg-adventure-green/10 text-adventure-green' 
                                    : 'bg-imagine-yellow/10 text-imagine-yellow'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-charcoal mb-2">Order #{order.id}</p>
                              <p className="text-charcoal mb-4">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                              <div className="flex justify-between items-center">
                                <p className="font-semibold">${order.price.toFixed(2)}</p>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    href={`/orders/${order.id}`}
                                  >
                                    View Details
                                  </Button>
                                  {order.status === 'Delivered' && (
                                    <Button 
                                      size="sm" 
                                      href={`/orders/${order.id}/reorder`}
                                    >
                                      Reorder
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-fog rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-book text-2xl text-charcoal"></i>
                        </div>
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                          No Orders Yet
                        </h3>
                        <p className="text-charcoal mb-6">
                          You haven't created any storybooks yet. Start your first magical story today!
                        </p>
                        <Button href="/create">
                          Create Your First Book
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Addresses */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-montserrat font-bold text-2xl text-inkwell-black">
                        My Addresses
                      </h2>
                      <Button 
                        size="sm" 
                        href="/profile/add-address"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Add Address
                      </Button>
                    </div>
                    
                    {mockAddresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockAddresses.map((address) => (
                          <div 
                            key={address.id} 
                            className="border border-gray-200 rounded-md p-4 relative"
                          >
                            {address.isDefault && (
                              <span className="absolute top-2 right-2 px-2 py-1 bg-story-blue/10 text-story-blue text-xs font-semibold rounded-full">
                                Default
                              </span>
                            )}
                            <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                              {address.name}
                            </h3>
                            <div className="text-charcoal mb-4">
                              <p>{address.line1}</p>
                              {address.line2 && <p>{address.line2}</p>}
                              <p>{address.city}, {address.state} {address.postalCode}</p>
                              <p>{address.country}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                href={`/profile/edit-address/${address.id}`}
                              >
                                Edit
                              </Button>
                              {!address.isDefault && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                >
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-fog rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-map-marker-alt text-2xl text-charcoal"></i>
                        </div>
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                          No Addresses Saved
                        </h3>
                        <p className="text-charcoal mb-6">
                          You haven't added any shipping addresses yet.
                        </p>
                        <Button href="/profile/add-address">
                          Add Your First Address
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Payment Methods */}
                {activeTab === 'payment' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-montserrat font-bold text-2xl text-inkwell-black">
                        Payment Methods
                      </h2>
                      <Button 
                        size="sm" 
                        href="/profile/add-payment"
                      >
                        <i className="fas fa-plus mr-2"></i>
                        Add Payment Method
                      </Button>
                    </div>
                    
                    {mockPaymentMethods.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockPaymentMethods.map((payment) => (
                          <div 
                            key={payment.id} 
                            className="border border-gray-200 rounded-md p-4 relative"
                          >
                            {payment.isDefault && (
                              <span className="absolute top-2 right-2 px-2 py-1 bg-story-blue/10 text-story-blue text-xs font-semibold rounded-full">
                                Default
                              </span>
                            )}
                            <div className="flex items-center mb-4">
                              <i className={`fab fa-cc-${payment.type.toLowerCase()} text-3xl mr-3`}></i>
                              <div>
                                <h3 className="font-montserrat font-semibold text-lg text-inkwell-black">
                                  {payment.type} ending in {payment.last4}
                                </h3>
                                <p className="text-charcoal text-sm">
                                  Expires {payment.expiryMonth}/{payment.expiryYear}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                href={`/profile/edit-payment/${payment.id}`}
                              >
                                Edit
                              </Button>
                              {!payment.isDefault && (
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                >
                                  Set as Default
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-fog rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fas fa-credit-card text-2xl text-charcoal"></i>
                        </div>
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                          No Payment Methods Saved
                        </h3>
                        <p className="text-charcoal mb-6">
                          You haven't added any payment methods yet.
                        </p>
                        <Button href="/profile/add-payment">
                          Add Your First Payment Method
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6">
                      Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                          Notifications
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-charcoal">Receive updates about your orders and account</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-story-blue"></div>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Marketing Emails</p>
                              <p className="text-sm text-charcoal">Receive special offers and promotions</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-story-blue"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                          Default Preferences
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block font-medium mb-2">Default Age Group</label>
                            <select className="w-full p-3 border border-gray-300 rounded-input font-montserrat text-base focus:outline-none focus:border-story-blue focus:ring-2 focus:ring-story-blue/20">
                              <option value="">Select an age group</option>
                              <option value="3-5">3-5 Years</option>
                              <option value="6-8" selected>6-8 Years</option>
                              <option value="9-12">9-12 Years</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block font-medium mb-2">Preferred Art Style</label>
                            <select className="w-full p-3 border border-gray-300 rounded-input font-montserrat text-base focus:outline-none focus:border-story-blue focus:ring-2 focus:ring-story-blue/20">
                              <option value="">Select an art style</option>
                              <option value="storybook-classic">Storybook Classic</option>
                              <option value="modern-adventure" selected>Modern Adventure</option>
                              <option value="whimsical-wonder">Whimsical Wonder</option>
                              <option value="magical-realism">Magical Realism</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
