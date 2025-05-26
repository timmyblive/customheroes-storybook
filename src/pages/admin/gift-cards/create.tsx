import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

export default function CreateGiftCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: '',
    message: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate amount
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amount < 5) {
        newErrors.amount = 'Amount must be at least $5';
      } else if (amount > 500) {
        newErrors.amount = 'Amount cannot exceed $500';
      }
    }
    
    // Optional fields don't need validation
    // But if email is provided, validate format
    if (formData.recipientEmail && !/^\S+@\S+\.\S+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Invalid email format';
    }
    
    if (formData.senderEmail && !/^\S+@\S+\.\S+$/.test(formData.senderEmail)) {
      newErrors.senderEmail = 'Invalid email format';
    }
    
    // Validate expiry date if provided
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      
      if (isNaN(expiryDate.getTime())) {
        newErrors.expiryDate = 'Invalid date format';
      } else if (expiryDate < today) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      // Convert amount to cents for API
      const amountInCents = Math.round(parseFloat(formData.amount) * 100);
      
      const response = await fetch('/api/admin/gift-cards/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialAmount: amountInCents,
          currency: 'USD',
          recipientName: formData.recipientName || null,
          recipientEmail: formData.recipientEmail || null,
          senderName: formData.senderName || null,
          senderEmail: formData.senderEmail || null,
          message: formData.message || null,
          expiresAt: formData.expiryDate || null
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create gift card');
      }
      
      setSuccessMessage(`Gift card created successfully! Code: ${data.giftCard.code}`);
      
      // Reset form
      setFormData({
        amount: '',
        recipientName: '',
        recipientEmail: '',
        senderName: '',
        senderEmail: '',
        message: '',
        expiryDate: ''
      });
      
    } catch (error) {
      console.error('Error creating gift card:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Create Gift Card | Admin Dashboard">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Page header */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/gift-cards')}
                className="text-slate-400 hover:text-slate-500 mr-4"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
              </button>
              <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Create Gift Card</h1>
            </div>
          </div>
        </div>

        {/* Create gift card form */}
        <div className="bg-white shadow-lg rounded-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center mb-6">
            <FontAwesomeIcon icon={faGift} className="w-5 h-5 text-indigo-500 mr-3" />
            <h2 className="text-xl font-bold text-slate-800">Gift Card Details</h2>
          </div>

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p className="font-medium">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Input
                  id="amount"
                  name="amount"
                  label="Amount ($)"
                  type="number"
                  placeholder="Enter amount (e.g. 50.00)"
                  value={formData.amount}
                  onChange={handleChange}
                  error={errors.amount}
                  required
                />
              </div>
              <div>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  label="Expiry Date (Optional)"
                  type="date"
                  placeholder="Select expiry date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  error={errors.expiryDate}
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Recipient Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    label="Recipient Name"
                    placeholder="Enter recipient name"
                    value={formData.recipientName}
                    onChange={handleChange}
                    error={errors.recipientName}
                  />
                </div>
                <div>
                  <Input
                    id="recipientEmail"
                    name="recipientEmail"
                    label="Recipient Email"
                    type="email"
                    placeholder="Enter recipient email"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                    error={errors.recipientEmail}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Sender Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    id="senderName"
                    name="senderName"
                    label="Sender Name"
                    placeholder="Enter sender name"
                    value={formData.senderName}
                    onChange={handleChange}
                    error={errors.senderName}
                  />
                </div>
                <div>
                  <Input
                    id="senderEmail"
                    name="senderEmail"
                    label="Sender Email"
                    type="email"
                    placeholder="Enter sender email"
                    value={formData.senderEmail}
                    onChange={handleChange}
                    error={errors.senderEmail}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <TextArea
                id="message"
                name="message"
                label="Gift Message (Optional)"
                placeholder="Enter a personal message to include with the gift card"
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                className="mr-4"
                onClick={() => router.push('/admin/gift-cards')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Creating...'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Create Gift Card
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
