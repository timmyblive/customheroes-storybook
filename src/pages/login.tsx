import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
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
    
    // Here you would typically make an API call to authenticate the user
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard or home page after successful login
      window.location.href = '/';
    }, 1500);
  };

  return (
    <Layout title="Sign In - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-paper-white rounded-card shadow-level-3 p-8">
            <div className="text-center mb-8">
              <h1 className="font-montserrat font-bold text-3xl mb-2 text-inkwell-black">Welcome Back</h1>
              <p className="text-charcoal">Sign in to continue your storytelling journey</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                required
              />
              
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                required
              />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-story-blue border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-charcoal">
                    Remember me
                  </label>
                </div>
                
                <Link href="/forgot-password" className="text-sm text-story-blue hover:text-blue-700">
                  Forgot password?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full mb-4"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <div className="text-center">
                <p className="text-charcoal">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-story-blue hover:text-blue-700">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-charcoal mb-4">Or sign in with</p>
              <div className="flex justify-center space-x-4">
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50">
                  <i className="fab fa-google text-lg"></i>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50">
                  <i className="fab fa-facebook-f text-lg"></i>
                </button>
                <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 hover:bg-gray-50">
                  <i className="fab fa-apple text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
