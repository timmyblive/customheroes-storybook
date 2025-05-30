import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faCreditCard, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Gift card design options
const giftCardDesigns = [
  { id: 'adventure', name: 'Adventure', color: 'from-adventure-green to-story-blue' },
  { id: 'fantasy', name: 'Fantasy', color: 'from-tale-purple to-story-blue' },
  { id: 'birthday', name: 'Birthday', color: 'from-reading-red to-tale-purple' },
  { id: 'holiday', name: 'Holiday', color: 'from-story-blue to-adventure-green' }
];

// Gift card amount options
const amountOptions = [
  { value: 2500, label: '$25' },
  { value: 5000, label: '$50' },
  { value: 7500, label: '$75' },
  { value: 10000, label: '$100' },
  { value: 'custom', label: 'Custom Amount' }
];

export default function GiftCardsPage() {
  const [selectedDesign, setSelectedDesign] = useState(giftCardDesigns[0].id);
  const [selectedAmount, setSelectedAmount] = useState(amountOptions[1].value);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: '',
    message: '',
    deliveryDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAmountChange = (amount: number | string) => {
    setSelectedAmount(amount);
    if (amount !== 'custom') {
      setCustomAmount('');
    }
  };

  const getFinalAmount = (): number => {
    if (selectedAmount === 'custom' && customAmount) {
      // Convert to cents
      return Math.floor(parseFloat(customAmount) * 100);
    }
    return selectedAmount as number;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const amount = getFinalAmount();
      
      // Validate amount
      if (amount < 500 || amount > 50000) {
        alert('Gift card amount must be between $5 and $500');
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/gift-cards/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount,
          design: selectedDesign,
          recipientName: formData.recipientName,
          recipientEmail: formData.recipientEmail,
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          message: formData.message,
          deliveryDate: formData.deliveryDate || null
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create gift card');
      }
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      alert('There was an error processing your gift card purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Gift Cards | CustomHeroes - Personalized Storybooks">
      <div className="pt-20 bg-gradient-to-b from-fog/30 to-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-6 text-inkwell-black">
            Gift Cards
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-tale-purple to-story-blue mx-auto mb-8"></div>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-16">
            Give the gift of imagination! CustomHeroes gift cards are perfect for birthdays, holidays, 
            or any special occasion. The recipient can create their own personalized storybook.
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Gift Card Preview */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-xl shadow-level-1 p-8">
                  <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6 flex items-center">
                    <FontAwesomeIcon icon={faGift} className="mr-3 text-tale-purple" />
                    Gift Card Preview
                  </h2>
                  
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-level-2 mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-br ${giftCardDesigns.find(d => d.id === selectedDesign)?.color}`}>
                      <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                          <div className="font-montserrat font-bold text-xl">CustomHeroes</div>
                          <div className="font-montserrat font-bold text-2xl">
                            {selectedAmount === 'custom' && customAmount
                              ? `$${parseFloat(customAmount).toFixed(2)}`
                              : `$${(selectedAmount as number) / 100}`}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-montserrat font-bold text-3xl mb-2">GIFT CARD</div>
                          <div className="text-white/80">For: {formData.recipientName || 'Someone Special'}</div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-white/80">From: {formData.senderName || 'You'}</div>
                          <div className="text-sm text-white/80">XXXX-XXXX-XXXX</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                        Select a Design
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {giftCardDesigns.map(design => (
                          <button
                            key={design.id}
                            type="button"
                            className={`p-3 rounded-lg border ${
                              selectedDesign === design.id
                                ? 'border-story-blue bg-story-blue/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedDesign(design.id)}
                          >
                            <div className={`h-2 w-full rounded-full bg-gradient-to-r ${design.color} mb-2`}></div>
                            <div className="text-sm font-medium">{design.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                        Select an Amount
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {amountOptions.map(option => (
                          <button
                            key={option.value.toString()}
                            type="button"
                            className={`p-3 rounded-lg border ${
                              selectedAmount === option.value
                                ? 'border-story-blue bg-story-blue/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleAmountChange(option.value)}
                          >
                            <div className="text-sm font-medium">{option.label}</div>
                          </button>
                        ))}
                      </div>
                      
                      {selectedAmount === 'custom' && (
                        <div className="mt-4">
                          <Input
                            id="customAmount"
                            label="Custom Amount"
                            placeholder="Enter amount (e.g. 75.00)"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            required
                          />
                          <p className="text-xs text-charcoal/70 mt-1">
                            Amount must be between $5 and $500
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gift Card Form */}
              <div className="order-1 lg:order-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-level-1 p-8">
                  <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6 flex items-center">
                    <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-story-blue" />
                    Gift Card Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                        Recipient Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          id="recipientName"
                          label="Recipient's Name"
                          placeholder="Enter recipient's name"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          id="recipientEmail"
                          type="email"
                          label="Recipient's Email"
                          placeholder="Enter recipient's email"
                          value={formData.recipientEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                        Your Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          id="senderName"
                          label="Your Name"
                          placeholder="Enter your name"
                          value={formData.senderName}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          id="senderEmail"
                          type="email"
                          label="Your Email"
                          placeholder="Enter your email"
                          value={formData.senderEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                        Personalize Your Gift
                      </h3>
                      <TextArea
                        id="message"
                        label="Personal Message"
                        placeholder="Add a personal message for the recipient"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                      />
                      
                      <div className="mt-4">
                        <Input
                          id="deliveryDate"
                          type="date"
                          label="Delivery Date (Optional)"
                          placeholder="Select delivery date"
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-charcoal/70 mt-1">
                          If no date is selected, the gift card will be sent immediately after purchase.
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-tale-purple to-story-blue text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Purchase Gift Card'}
                      </Button>
                      
                      <div className="flex items-center justify-center mt-4 text-sm text-charcoal/70">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        Gift card will be delivered to recipient's email
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Gift Card Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white rounded-xl shadow-level-1 p-6">
                <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-3">
                  How It Works
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-charcoal">
                  <li>Purchase a gift card in any amount from $5 to $500</li>
                  <li>Recipient receives the gift card code via email</li>
                  <li>Recipient redeems the code during checkout</li>
                  <li>Any remaining balance stays on the gift card for future use</li>
                </ol>
              </div>
              
              <div className="bg-white rounded-xl shadow-level-1 p-6">
                <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-3">
                  Perfect For
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-charcoal">
                  <li>Birthdays and special occasions</li>
                  <li>Holiday gifts</li>
                  <li>Baby showers and new parents</li>
                  <li>Grandparents who want to give a unique gift</li>
                  <li>Last-minute gifts (instant delivery available)</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-level-1 p-6">
                <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-3">
                  Gift Card Details
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-charcoal">
                  <li>Gift cards never expire</li>
                  <li>Can be used for any CustomHeroes product</li>
                  <li>Delivered via email (no physical card)</li>
                  <li>Secure code generation</li>
                  <li>Customer support available for assistance</li>
                </ul>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="bg-gradient-to-r from-fog/50 to-lavender/30 rounded-xl p-8">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                    Can I use multiple gift cards on one order?
                  </h3>
                  <p className="text-charcoal">
                    Yes, you can apply multiple gift cards to a single order during checkout.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                    What if the gift card amount doesn't cover the full order?
                  </h3>
                  <p className="text-charcoal">
                    You can pay the remaining balance with a credit card or other payment method.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                    Can I check the balance of my gift card?
                  </h3>
                  <p className="text-charcoal">
                    Yes, you can check your gift card balance by entering the code on the checkout page.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-2">
                    What if the recipient loses the gift card code?
                  </h3>
                  <p className="text-charcoal">
                    Contact our customer support with the recipient's email, and we can resend the gift card.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
