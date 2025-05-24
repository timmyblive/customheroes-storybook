import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Here you would typically make an API call to send a password reset email
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <Layout title="Forgot Password - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-paper-white rounded-card shadow-level-3 p-8">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-montserrat font-bold text-3xl mb-2 text-inkwell-black">Reset Your Password</h1>
                  <p className="text-charcoal">Enter your email address and we'll send you a link to reset your password</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <Input
                    label="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    required
                  />
                  
                  <Button
                    type="submit"
                    className="w-full mb-4"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-charcoal">
                      Remember your password?{' '}
                      <Link href="/login" className="text-story-blue hover:text-blue-700">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-adventure-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-montserrat font-bold text-2xl mb-4 text-inkwell-black">Check Your Email</h2>
                <p className="text-charcoal mb-6">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-charcoal mb-6">
                  If you don't see the email, check your spam folder or make sure you entered the correct email address.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button href="/login" variant="secondary">
                    Return to Sign In
                  </Button>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Try Another Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
