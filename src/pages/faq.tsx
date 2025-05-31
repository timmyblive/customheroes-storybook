import { useState } from 'react';
import Layout from '../components/layout/Layout';
import CTA from '../components/sections/CTA';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the personalization process work?",
      answer: "Our personalization process is simple! First, you upload photos of your child and provide some basic information about them (name, age, interests). Then, you select a story theme and customize any specific details. Our AI technology integrates your child's likeness into the illustrations and personalizes the narrative. You'll receive a digital proof to review before the book is printed and shipped to your door."
    },
    {
      question: "How long does it take to receive my book?",
      answer: "After placing your order, we'll generate your book and send you a proof within 3-5 business days. Once you approve the proof, standard shipping takes 12-15 business days. Expedited options are available: 8-11 business days for an additional $15, or 5-8 business days for an additional $30. You can check the status of your order at any time in your account dashboard."
    },
    {
      question: "What age range are the books suitable for?",
      answer: "Our books are designed for children aged 2-12 years. We tailor the content, vocabulary, and storylines to be age-appropriate based on the information you provide during the creation process. We offer different reading levels from simple stories with basic vocabulary for toddlers to more complex narratives for older children."
    },
    {
      question: "Can I preview my book before it's printed?",
      answer: "Absolutely! All orders include a digital proof that you can review before your book goes to print. You'll have the opportunity to request revisions if needed (number of revision rounds depends on your selected package)."
    },
    {
      question: "What types of photos work best?",
      answer: "Clear, well-lit photos with your child's face clearly visible work best. Front-facing photos with neutral backgrounds are ideal, but our technology can work with a variety of images. We recommend uploading several options so our system can select the best ones for illustration integration."
    },
    {
      question: "Can I create books with multiple children?",
      answer: "Yes! You can include multiple children in the same storybook. During the creation process, you'll be able to upload photos and provide information for each child. Our system will incorporate all children as characters in the story."
    },
    {
      question: "What is the quality of the books?",
      answer: "We pride ourselves on producing high-quality books. Depending on the package you select, your book will feature premium paper, vibrant color printing, and durable binding. Our Standard package includes paperback binding, while Premium and Deluxe packages feature hardcover options with increasingly premium materials."
    },
    {
      question: "Can I order additional copies of my book?",
      answer: "Yes! Once you've created a book, you can order additional copies at a discounted price. These can be accessed from your account dashboard under 'My Books' where you'll find an option to reorder."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. These options will be displayed during checkout based on your shipping address."
    },
    {
      question: "What is your return policy?",
      answer: "Since our books are personalized, we cannot accept returns unless there is a printing defect or damage during shipping. If you receive a damaged book, please contact our customer service within 14 days of receipt with photos of the damage, and we'll arrange a replacement."
    },
    {
      question: "Can I get a digital-only version of my book?",
      answer: "Yes, digital versions are included with our Premium and Deluxe packages. If you have the Standard package, you can add a digital version for an additional fee. Digital books can be viewed on any device and are perfect for on-the-go reading."
    },
    {
      question: "How secure are the photos I upload?",
      answer: "We take your privacy seriously. All uploaded photos are stored securely and are only used for the purpose of creating your personalized book. We do not share your photos with third parties or use them for marketing purposes without your explicit consent."
    }
  ];

  return (
    <Layout title="Frequently Asked Questions | CustomHeroes - Personalized Storybooks">
      <div className="pt-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-8 text-inkwell-black">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-16">
            Find answers to common questions about our personalized storybooks, ordering process, and more.
          </p>
          
          <div className="max-w-4xl mx-auto mb-16">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  className="w-full text-left py-6 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="font-montserrat font-semibold text-lg text-inkwell-black pr-8">
                    {faq.question}
                  </h3>
                  <span className={`text-tale-purple transition-transform transform ${openIndex === index ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="text-charcoal">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-fog rounded-lg p-8 max-w-3xl mx-auto text-center">
            <h2 className="font-montserrat font-bold text-2xl mb-4 text-inkwell-black">
              Still Have Questions?
            </h2>
            <p className="text-charcoal mb-6">
              Our customer support team is here to help! Contact us and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:support@customheroes.ai" 
                className="inline-flex items-center justify-center text-story-blue hover:text-tale-purple transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                support@customheroes.ai
              </a>
              <span className="hidden sm:inline text-charcoal">|</span>
              <a 
                href="tel:+18005551234" 
                className="inline-flex items-center justify-center text-story-blue hover:text-tale-purple transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                1-800-555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <CTA />
    </Layout>
  );
}
