import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import AdminAuthWrapper from '../../components/admin/AdminAuthWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGift, 
  faBox, 
  faChartLine, 
  faUsers, 
  faDollarSign,
  faArrowRight,
  faEye,
  faPlus,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalGiftCards: number;
  activeGiftCards: number;
  totalRevenue: number;
}

interface RecentActivity {
  orders: Array<{
    id: number;
    created_at: string;
    amount: number;
    customer_name: string;
    title: string;
  }>;
  giftCards: Array<{
    id: number;
    code: string;
    initial_amount: number;
    created_at: string;
    recipient_name: string | null;
    sender_name: string | null;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalGiftCards: 0,
    activeGiftCards: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({
    orders: [],
    giftCards: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/dashboard/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      
      const data = await response.json();
      setStats(data.stats);
      setRecentActivity(data.recentActivity);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AdminAuthWrapper>
      <Layout title="Admin Dashboard | CustomHeroes">
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
          {/* Page header */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Admin Dashboard</h1>
              <p className="text-slate-600">Welcome to the CustomHeroes administration panel</p>
            </div>
            <div className="flex items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchDashboardStats}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faBox} className="text-blue-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {isLoading ? '...' : stats.totalOrders}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faEye} className="text-yellow-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {isLoading ? '...' : stats.pendingOrders}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faGift} className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Active Gift Cards</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {isLoading ? '...' : stats.activeGiftCards}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faDollarSign} className="text-purple-600 text-xl" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {isLoading ? '...' : formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders Management */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faBox} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Order Management</h3>
                    <p className="text-sm text-slate-600">Manage orders and proof approvals</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">View All Orders</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/admin/orders')}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    View Orders
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Pending Proofs</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/admin/orders?status=pending')}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Review Proofs
                  </Button>
                </div>
              </div>
            </Card>

            {/* Gift Cards Management */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faGift} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Gift Card Management</h3>
                    <p className="text-sm text-slate-600">Create and manage gift cards</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">View All Gift Cards</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/admin/gift-cards')}
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    View Cards
                  </Button>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Create New Gift Card</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push('/admin/gift-cards/create')}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Card
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="secondary"
                  className="justify-between"
                  onClick={() => router.push('/admin/orders')}
                >
                  <span>All Orders</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
                
                <Button
                  variant="secondary"
                  className="justify-between"
                  onClick={() => router.push('/admin/gift-cards')}
                >
                  <span>All Gift Cards</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
                
                <Button
                  variant="secondary"
                  className="justify-between"
                  onClick={() => router.push('/admin/gift-cards/create')}
                >
                  <span>Create Gift Card</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    </AdminAuthWrapper>
  );
}
