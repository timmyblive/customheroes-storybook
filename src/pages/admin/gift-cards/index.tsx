import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import Button from '../../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faSearch, faSync, faEdit, faEye, faPlus, faWrench } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../../utils/formatters';

interface GiftCard {
  id: number;
  code: string;
  initial_amount: number;
  remaining_amount: number;
  currency: string;
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  recipient_email: string | null;
  recipient_name: string | null;
  sender_name: string | null;
  sender_email: string | null;
  message: string | null;
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  stripe_payment_id: string | null;
}

export default function AdminGiftCards() {
  const router = useRouter();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGiftCards, setTotalGiftCards] = useState(0);

  const fetchGiftCards = async (page = 1, status = 'all', search = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/gift-cards?page=${page}&status=${status}&search=${search}`);
      if (!response.ok) throw new Error('Failed to fetch gift cards');
      
      const data = await response.json();
      setGiftCards(data.giftCards);
      setTotalPages(data.totalPages);
      setTotalGiftCards(data.totalCount);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards(currentPage, statusFilter, searchTerm);
  }, [currentPage, statusFilter, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchGiftCards(1, statusFilter, searchTerm);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRefresh = () => {
    fetchGiftCards(currentPage, statusFilter, searchTerm);
  };

  const handleFixStatuses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/fix-gift-card-statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminKey: 'fix-gift-cards-2024'
        })
      });
      
      if (!response.ok) throw new Error('Failed to fix gift card statuses');
      
      const data = await response.json();
      console.log(`Fixed ${data.fixedCount} gift card statuses`);
      
      // Refresh the gift cards list to show updated statuses
      await fetchGiftCards(currentPage, statusFilter, searchTerm);
      
      // Show success message (you could add a toast notification here)
      alert(`Successfully fixed ${data.fixedCount} gift card statuses!`);
    } catch (error) {
      console.error('Error fixing gift card statuses:', error);
      alert('Failed to fix gift card statuses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'redeemed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Gift Cards | Admin Dashboard">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Gift Cards</h1>
          </div>

          {/* Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <Button 
              onClick={handleRefresh}
              variant="secondary"
              className="text-slate-600"
            >
              <FontAwesomeIcon icon={faSync} className="mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={handleFixStatuses}
              variant="secondary"
              className="text-slate-600"
            >
              <FontAwesomeIcon icon={faWrench} className="mr-2" />
              Fix Statuses
            </Button>
            <Button 
              onClick={() => router.push('/admin/gift-cards/create')}
              variant="primary"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Gift Card
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 border-b border-slate-200 pb-5">
          <div className="flex flex-wrap -m-1">
            <div className="m-1">
              <button
                onClick={() => handleStatusChange('all')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                  statusFilter === 'all'
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                All
              </button>
            </div>
            <div className="m-1">
              <button
                onClick={() => handleStatusChange('active')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                  statusFilter === 'active'
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                Active
              </button>
            </div>
            <div className="m-1">
              <button
                onClick={() => handleStatusChange('redeemed')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                  statusFilter === 'redeemed'
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                Redeemed
              </button>
            </div>
            <div className="m-1">
              <button
                onClick={() => handleStatusChange('expired')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                  statusFilter === 'expired'
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                Expired
              </button>
            </div>
            <div className="m-1">
              <button
                onClick={() => handleStatusChange('cancelled')}
                className={`inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border ${
                  statusFilter === 'cancelled'
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5">
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="gift-card-search" className="sr-only">Search</label>
            <input
              id="gift-card-search"
              className="form-input w-full pl-9 focus:border-slate-300"
              type="search"
              placeholder="Search by code, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute inset-0 right-auto group" type="submit">
              <FontAwesomeIcon icon={faSearch} className="w-4 h-4 flex-shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2" />
            </button>
          </form>
        </div>

        {/* Gift cards table */}
        <div className="bg-white shadow-lg rounded-sm border border-slate-200 mb-8">
          <header className="px-5 py-4">
            <h2 className="font-semibold text-slate-800">
              Gift Cards <span className="text-slate-400 font-medium">{totalGiftCards}</span>
            </h2>
          </header>
          <div>
            {isLoading ? (
              <div className="px-5 py-16 text-center">
                <div className="inline-block animate-spin text-indigo-500 mb-4">
                  <FontAwesomeIcon icon={faSync} className="w-8 h-8" />
                </div>
                <div className="text-xl font-medium text-slate-600">Loading gift cards...</div>
              </div>
            ) : giftCards.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <FontAwesomeIcon icon={faGift} className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-xl font-medium text-slate-600 mb-1">No gift cards found</div>
                <div className="text-sm text-slate-500">
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : statusFilter !== 'all'
                    ? `No ${statusFilter} gift cards found`
                    : 'Create your first gift card to get started'}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
                    <tr>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Code</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Amount</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Status</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Recipient</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Created</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-left">Last Used</div>
                      </th>
                      <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-right">Actions</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200">
                    {giftCards.map((giftCard) => (
                      <tr key={giftCard.id}>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="font-medium text-slate-800">{giftCard.code}</div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-left font-medium text-green-500">
                              {formatCurrency(giftCard.remaining_amount / 100)}
                            </div>
                            {giftCard.remaining_amount !== giftCard.initial_amount && (
                              <div className="text-xs text-slate-500 ml-2">
                                of {formatCurrency(giftCard.initial_amount / 100)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${getStatusColor(giftCard.status)}`}>
                            {giftCard.status.charAt(0).toUpperCase() + giftCard.status.slice(1)}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left">
                            {giftCard.recipient_name || 'N/A'}
                            {giftCard.recipient_email && (
                              <div className="text-xs text-slate-500">{giftCard.recipient_email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left font-medium text-slate-800">
                            {new Date(giftCard.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="text-left font-medium text-slate-800">
                            {giftCard.last_used_at
                              ? new Date(giftCard.last_used_at).toLocaleDateString()
                              : 'Never'}
                          </div>
                        </td>
                        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/gift-cards/${giftCard.id}`)}
                              className="text-slate-400 hover:text-slate-500"
                              title="View Details"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/gift-cards/${giftCard.id}/edit`)}
                              className="text-slate-400 hover:text-slate-500"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex" role="navigation" aria-label="Navigation">
              <div className="mr-2">
                <button
                  className={`inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white border border-slate-200 text-slate-600 shadow-sm ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-slate-300'
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <span className="sr-only">Previous</span>
                  <wbr />← <span className="hidden sm:inline">&nbsp;Previous</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`inline-flex items-center justify-center leading-5 px-3.5 py-2 rounded-sm border ${
                      page === currentPage
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <div className="ml-2">
                <button
                  className={`inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white border border-slate-200 text-slate-600 shadow-sm ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-slate-300'
                  }`}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <span className="sr-only">Next</span>
                  <span className="hidden sm:inline">Next&nbsp;</span> →<wbr />
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </Layout>
  );
}
