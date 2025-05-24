import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-inkwell-black text-paper-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2 text-white">
                <i className="fas fa-book-open"></i>
              </span>
              <span className="font-quicksand font-bold text-2xl text-white">
                CustomHereos
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Creating personalized storybooks that transform children into heroes of their own adventures.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-story-blue transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-story-blue transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-story-blue transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-story-blue transition-colors">
                <i className="fab fa-pinterest-p"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-montserrat font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/team" className="text-gray-400 hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-bold text-lg mb-4">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/storybooks" className="text-gray-400 hover:text-white transition-colors">Storybooks</Link></li>
              <li><Link href="/products/gift-cards" className="text-gray-400 hover:text-white transition-colors">Gift Cards</Link></li>
              <li><Link href="/products/bulk-orders" className="text-gray-400 hover:text-white transition-colors">Bulk Orders</Link></li>
              <li><Link href="/products/for-schools" className="text-gray-400 hover:text-white transition-colors">For Schools</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/examples" className="text-gray-400 hover:text-white transition-colors">Examples</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm">&copy; 2025 CustomHereos. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
