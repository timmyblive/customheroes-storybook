import { useState } from 'react';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <Layout title="Contact Us | CustomHeroes - Personalized Storybooks">
      <div className="pt-20 bg-gradient-to-b from-fog/30 to-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-6 text-inkwell-black">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-tale-purple to-story-blue mx-auto mb-8"></div>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-16">
            Have questions or need assistance? We're here to help! Fill out the form below and our team will get back to you as soon as possible.
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-2">
                {isSubmitted ? (
                  <div className="bg-white rounded-xl shadow-level-1 p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-adventure-green/20 to-adventure-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-adventure-green" />
                    </div>
                    <h3 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-charcoal mb-6">
                      Thank you for reaching out! We've received your message and will get back to you as soon as possible, typically within 1-2 business days.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      className="bg-gradient-to-r from-tale-purple to-story-blue text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-level-1 p-8">
                    <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6">
                      Send Us a Message
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        id="name"
                        label="Your Name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Input
                      id="subject"
                      label="Subject"
                      placeholder="What is your message about?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-4"
                    />
                    <TextArea
                      id="message"
                      label="Message"
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="mt-4"
                    />
                    <div className="mt-8">
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-gradient-to-r from-tale-purple to-story-blue text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
              
              <div>
                <div className="bg-white rounded-xl shadow-level-1 p-8 h-full">
                  <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-tale-purple/20 to-tale-purple/10 rounded-lg flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faEnvelope} className="text-tale-purple" />
                        </div>
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black">
                          Email Us
                        </h3>
                      </div>
                      <p className="text-charcoal pl-13">
                        <a href="mailto:hello@customheroes.com" className="hover:text-story-blue transition-colors">
                          hello@customheroes.com
                        </a>
                      </p>
                      <p className="text-charcoal pl-13">
                        <a href="mailto:support@customheroes.com" className="hover:text-story-blue transition-colors">
                          support@customheroes.com
                        </a>
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-story-blue/20 to-story-blue/10 rounded-lg flex items-center justify-center mr-3">
                          <FontAwesomeIcon icon={faPhone} className="text-story-blue" />
                        </div>
                        <h3 className="font-montserrat font-semibold text-lg text-inkwell-black">
                          Call Us
                        </h3>
                      </div>
                      <p className="text-charcoal pl-13">
                        <a href="tel:+18005551234" className="hover:text-story-blue transition-colors">
                          (800) 555-1234
                        </a>
                      </p>
                      <p className="text-sm text-charcoal/70 pl-13">
                        Monday-Friday: 9am-5pm CST
                      </p>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-gray-100">
                      <h3 className="font-montserrat font-semibold text-lg text-inkwell-black mb-3">
                        Response Time
                      </h3>
                      <p className="text-charcoal mb-2">
                        We strive to respond to all inquiries within 24-48 hours during business days.
                      </p>
                      <p className="text-charcoal">
                        For urgent matters related to an existing order, please include your order number in the subject line.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-fog/50 to-lavender/30 rounded-xl p-8 text-center">
              <h3 className="font-montserrat font-bold text-xl text-inkwell-black mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-charcoal mb-6 max-w-2xl mx-auto">
                Looking for quick answers? Check out our FAQ page for information about our personalization process, shipping, and more.
              </p>
              <Button href="/faq" variant="secondary">
                Visit FAQ Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
