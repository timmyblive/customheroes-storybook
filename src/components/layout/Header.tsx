import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-paper-white shadow-level-1 fixed w-full top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/logo.png" 
            alt="CustomHeroes Logo" 
            width={180} 
            height={40}
            style={{ height: '40px', width: 'auto' }}
            priority
          />
        </Link>
        
        <button
          className="md:hidden text-inkwell-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/how-it-works" className="font-montserrat font-semibold text-inkwell-black hover:text-story-blue transition-colors">
            How It Works
          </Link>
          <Link href="/examples" className="font-montserrat font-semibold text-inkwell-black hover:text-story-blue transition-colors">
            Examples
          </Link>
          <Link href="/pricing" className="font-montserrat font-semibold text-inkwell-black hover:text-story-blue transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="font-montserrat font-semibold text-inkwell-black hover:text-story-blue transition-colors">
            FAQ
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button href="/create">Get Started</Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper-white shadow-level-2 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/how-it-works" className="font-montserrat font-semibold text-inkwell-black py-2">
              How It Works
            </Link>
            <Link href="/examples" className="font-montserrat font-semibold text-inkwell-black py-2">
              Examples
            </Link>
            <Link href="/pricing" className="font-montserrat font-semibold text-inkwell-black py-2">
              Pricing
            </Link>
            <Link href="/faq" className="font-montserrat font-semibold text-inkwell-black py-2">
              FAQ
            </Link>
            
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
              <Button href="/create" className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
