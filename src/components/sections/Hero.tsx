import Button from '../ui/Button';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagicWandSparkles, faBookOpen, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Hero() {
  return (
    <section className="bg-hero-gradient py-16 md:py-24 relative overflow-hidden">
      {/* Magical sparkles background */}
      <div className="absolute inset-0 opacity-20">
        <div className="sparkle-animation absolute top-10 left-10 text-2xl text-sunshine-yellow">✨</div>
        <div className="sparkle-animation absolute top-20 right-20 text-xl text-magic-orange" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="sparkle-animation absolute bottom-20 left-20 text-lg text-tale-purple" style={{ animationDelay: '1s' }}>💫</div>
        <div className="sparkle-animation absolute bottom-10 right-10 text-2xl text-adventure-green" style={{ animationDelay: '1.5s' }}>✨</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon icon={faMagicWandSparkles} className="text-3xl text-magic-orange sparkle-animation" />
              <span className="friendly-text text-tale-purple font-semibold">Where Magic Meets Memory</span>
            </div>
            
            <h1 className="font-fredoka font-bold text-4xl lg:text-5xl leading-tight mb-6 text-inkwell-black">
              Make Your Child the 
              <span className="text-magic-orange"> Hero </span>
              of Their Own 
              <span className="text-tale-purple"> Adventure!</span>
            </h1>
            
            <p className="friendly-lg text-charcoal mb-8 leading-relaxed">
              Create magical, personalized storybooks featuring your little one's photos and amazing adventures. 
              Professional quality tales of wonder, delivered with love to your door! 
              <FontAwesomeIcon icon={faHeart} className="text-reading-red ml-2" />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/create" size="lg" className="adventure-button text-lg px-8 py-4">
                <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                <span className="sm:hidden">Start Book</span>
                <span className="hidden sm:inline">Start Our Adventure</span>
              </Button>
              <Button href="/examples" variant="secondary" size="lg" className="adventure-button-secondary text-lg px-8 py-4">
                <span className="sm:hidden">See Examples</span>
                <span className="hidden sm:inline">See Magic Examples</span>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-6 friendly-text text-charcoal">
              <div className="flex items-center gap-2">
                <span className="text-adventure-green text-xl">✓</span>
                <span>Professional Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-adventure-green text-xl">✓</span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-adventure-green text-xl">✓</span>
                <span>Made with Love</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="relative rounded-magical overflow-hidden shadow-magical">
              <Image 
                src="/images/Hero.png" 
                alt="Child reading a personalized storybook adventure" 
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Magical overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-magic-orange/10 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Floating elements around the image */}
            <div className="absolute -top-4 -left-4 bg-sunshine-yellow rounded-full p-3 shadow-gentle sparkle-animation">
              <FontAwesomeIcon icon={faBookOpen} className="text-inkwell-black text-xl" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-tale-purple rounded-full p-3 shadow-gentle sparkle-animation" style={{ animationDelay: '0.7s' }}>
              <FontAwesomeIcon icon={faMagicWandSparkles} className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
