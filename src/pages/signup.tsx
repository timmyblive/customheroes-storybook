import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToTermsError, setAgreeToTermsError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Validate terms agreement
    if (!agreeToTerms) {
      setAgreeToTermsError('You must agree to the terms and conditions');
      isValid = false;
    } else {
      setAgreeToTermsError('');
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Here you would typically make an API call to register the user
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard or home page after successful registration
      window.location.href = '/';
    }, 1500);
  };

  return (
    <Layout title="Sign Up - CustomHereos">
      <div className="bg-fog min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-paper-white rounded-card shadow-level-3 p-8">
            <div className="text-center mb-8">
              <h1 className="font-montserrat font-bold text-3xl mb-2 text-inkwell-black">Create Your Account</h1>
              <p className="text-charcoal">Join CustomHereos and start creating magical stories</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />
                
                <Input
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
              </div>
              
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-story-blue border-gray-300 rounded"
                    checked={agreeToTerms}
                    onChange={() => setAgreeToTerms(!agreeToTerms)}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-charcoal">
                    I agree to the{' '}
                    <Link href="/terms" className="text-story-blue hover:text-blue-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-story-blue hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {agreeToTermsError && (
                  <p className="mt-1 text-reading-red text-sm">{agreeToTermsError}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full mb-4"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <div className="text-center">
                <p className="text-charcoal">
                  Already have an account?{' '}
                  <Link href="/login" className="text-story-blue hover:text-blue-700">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-charcoal mb-4">Or sign up with</p>
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
