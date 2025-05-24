import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCalendarAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function WaitingConfirmation() {
  const router = useRouter();
  const [projectNumber, setProjectNumber] = useState<string>('');

  useEffect(() => {
    // Get project number from local storage if available
    const storedProjectNumber = localStorage.getItem('projectNumber');
    if (storedProjectNumber) {
      setProjectNumber(storedProjectNumber);
    }
  }, []);

  return (
    <Layout title="Order Confirmation - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-paper-white rounded-card shadow-level-3 overflow-hidden max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-brand-gradient text-white px-6 py-4 flex justify-between items-center">
              <h1 className="font-montserrat font-semibold text-lg">Order Confirmation</h1>
              {projectNumber && <span className="text-sm">Project #{projectNumber}</span>}
            </div>
            
            {/* Content */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-4xl" />
              </div>
              
              <h2 className="font-montserrat font-bold text-2xl mb-4 text-inkwell-black">
                Thank You for Your Order!
              </h2>
              
              <p className="text-lg text-charcoal mb-6">
                We&apos;ve received your information and are excited to create your personalized storybook.
              </p>
              
              <div className="bg-blue-50 border border-story-blue/20 rounded-lg p-6 mb-8 max-w-lg mx-auto">
                <div className="flex items-start mb-4">
                  <div className="mr-4 mt-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-story-blue text-xl" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-inkwell-black mb-1">What Happens Next?</h3>
                    <p className="text-charcoal">
                      Our creative team will review your information and create a personalized preview of your book within <strong>3-5 business days</strong>.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    <FontAwesomeIcon icon={faEnvelope} className="text-story-blue text-xl" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-inkwell-black mb-1">Stay Tuned</h3>
                    <p className="text-charcoal">
                      We&apos;ll email you when your preview is ready to review. You&apos;ll be able to approve it or request changes before final production.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="primary"
                  onClick={() => router.push('/')}
                >
                  Return to Homepage
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/profile')}
                >
                  View My Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
