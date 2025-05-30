import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faGift } from '@fortawesome/free-solid-svg-icons';

export default function GiftCardSuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseDetails, setPurchaseDetails] = useState<{
    recipientName: string;
    recipientEmail: string;
    amount: number;
    deliveryDate?: string;
  } | null>(null);

  useEffect(() => {
    if (session_id) {
      // Fetch the gift card purchase details
      fetch(`/api/gift-cards/session?id=${session_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPurchaseDetails(data.purchaseDetails);
          } else {
            console.error('Error fetching gift card details:', data.error);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching gift card details:', err);
          setIsLoading(false);
        });
    }
  }, [session_id]);

  return (
    <Layout title="Gift Card Purchase Successful | CustomHeroes - Personalized Storybooks">
      <div className="pt-20 bg-gradient-to-b from-fog/30 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-level-1 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-adventure-green/20 to-adventure-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-adventure-green" />
            </div>
            
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-6 text-inkwell-black">
              Gift Card Purchase Successful!
            </h1>
            
            {isLoading ? (
              <p className="text-charcoal mb-8">Loading purchase details...</p>
            ) : purchaseDetails ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-fog/50 to-lavender/30 rounded-xl p-6 max-w-xl mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faGift} className="text-2xl text-tale-purple mr-3" />
                    <h2 className="font-montserrat font-bold text-xl text-inkwell-black">
                      Gift Card Details
                    </h2>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    <p className="flex justify-between">
                      <span className="font-medium">Recipient:</span>
                      <span>{purchaseDetails.recipientName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{purchaseDetails.recipientEmail}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Amount:</span>
                      <span>${(purchaseDetails.amount / 100).toFixed(2)}</span>
                    </p>
                    {purchaseDetails.deliveryDate && (
                      <p className="flex justify-between">
                        <span className="font-medium">Delivery Date:</span>
                        <span>{new Date(purchaseDetails.deliveryDate).toLocaleDateString()}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-charcoal">
                  {purchaseDetails.deliveryDate && new Date(purchaseDetails.deliveryDate) > new Date() ? (
                    <p>
                      Your gift card will be delivered to {purchaseDetails.recipientEmail} on {new Date(purchaseDetails.deliveryDate).toLocaleDateString()}.
                    </p>
                  ) : (
                    <p>
                      Your gift card has been sent to {purchaseDetails.recipientEmail}. The recipient will receive an email with the gift card code and redemption instructions.
                    </p>
                  )}
                  <p className="mt-4">
                    Thank you for your purchase! If you have any questions, please contact our customer support.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-charcoal mb-8">
                We couldn't find details for this purchase. If you believe this is an error, please contact our customer support.
              </p>
            )}
            
            <div className="mt-10 space-x-4">
              <Button href="/" variant="secondary">
                Return to Home
              </Button>
              <Button href="/products/gift-cards">
                Purchase Another Gift Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
