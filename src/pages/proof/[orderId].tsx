import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  book_title: string;
  proof_url?: string;
  status: string;
}

export default function ProofReviewPage() {
  const router = useRouter();
  const { orderId, action } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    if (action === 'approve') {
      handleApproval();
    } else if (action === 'revise') {
      setShowRevisionForm(true);
    }
  }, [action]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/details`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        setMessage('Order not found. Please check your link.');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setMessage('Error loading order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async () => {
    if (!orderId) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('✅ Thank you! Your book has been approved and will be sent to print.');
      } else {
        setMessage('Error approving book. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Error approving book:', error);
      setMessage('Error approving book. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevisionRequest = async () => {
    if (!orderId || !revisionNotes.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/request-revision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: revisionNotes }),
      });

      if (response.ok) {
        setMessage('✅ Thank you! Your revision request has been submitted. We\'ll make the changes and send you a new proof.');
        setShowRevisionForm(false);
      } else {
        setMessage('Error submitting revision request. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Error submitting revision:', error);
      setMessage('Error submitting revision request. Please try again or contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your book proof...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Book Proof Review - CustomHeroes</title>
        <meta name="description" content="Review your custom book proof" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="https://wfw2amjvljwznu2k.public.blob.vercel-storage.com/Images/logo-EWu3uGFhlXwZzjQkUh58UDKbXc3sDg.png" 
              alt="CustomHeroes Logo" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Book Proof Review</h1>
            <p className="text-lg text-gray-600">Review your personalized book and let us know if you're ready to print!</p>
          </div>

          {message && (
            <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              <p className="text-center font-medium">{message}</p>
            </div>
          )}

          {order && (
            <div className="max-w-4xl mx-auto">
              {/* Order Details */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600"><strong>Customer:</strong> {order.customer_name}</p>
                    <p className="text-gray-600"><strong>Book Title:</strong> {order.book_title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600"><strong>Order ID:</strong> {order.id}</p>
                    <p className="text-gray-600"><strong>Status:</strong> 
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Proof Viewer */}
              {order.proof_url && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 Your Book Proof</h2>
                  <p className="text-gray-600 mb-4">
                    Click the button below to view your book proof PDF. Please review it carefully and check for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                    <li>Character names are spelled correctly</li>
                    <li>Story flows naturally and makes sense</li>
                    <li>Illustrations match your expectations</li>
                    <li>No typos or grammatical errors</li>
                  </ul>
                  <div className="text-center">
                    <a 
                      href={order.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    >
                      📖 View Your Book Proof
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!message.includes('✅') && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Next?</h2>
                  <p className="text-gray-600 mb-6">
                    After reviewing your book proof, please choose one of the options below:
                  </p>

                  {!showRevisionForm ? (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleApproval}
                        disabled={submitting}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                      >
                        {submitting ? 'Processing...' : '✅ Approve & Print My Book'}
                      </button>
                      <button
                        onClick={() => setShowRevisionForm(true)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
                      >
                        ✏️ Request Changes
                      </button>
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Request Changes</h3>
                      <p className="text-gray-600 mb-4">
                        Please describe the changes you'd like us to make to your book:
                      </p>
                      <textarea
                        value={revisionNotes}
                        onChange={(e) => setRevisionNotes(e.target.value)}
                        placeholder="Please be as specific as possible about what you'd like changed..."
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={handleRevisionRequest}
                          disabled={submitting || !revisionNotes.trim()}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : 'Submit Changes'}
                        </button>
                        <button
                          onClick={() => setShowRevisionForm(false)}
                          className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Support */}
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Need help? Contact our support team at{' '}
                  <a href="mailto:support@customheroes.com" className="text-blue-600 hover:underline">
                    support@customheroes.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
