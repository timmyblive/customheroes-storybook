import Button from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faPencilAlt, faBookOpen, faMagicWandSparkles, faHeart, faShippingFast, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function HowItWorks() {
  const timelineSteps = [
    {
      number: 1,
      title: "Upload Your Photo",
      subtitle: "Share Your Little Hero",
      description: "Upload a clear photo of your child and tell us about the magical adventure you want to create!",
      image: "/images/upload.png",
      bgColor: "bg-soft-pink",
      iconColor: "text-tale-purple",
      emoji: "📸"
    },
    {
      number: 2,
      title: "AI Creates Character",
      subtitle: "Watch the Magic Happen",
      description: "Our AI transforms your photo into a beautiful animated character that will star in your personalized storybook!",
      image: "/images/character.png",
      bgColor: "bg-lavender",
      iconColor: "text-magic-orange",
      emoji: "🎨"
    },
    {
      number: 3,
      title: "Receive Your Book",
      subtitle: "Magic Delivered to Your Door",
      description: "Your child receives their very own personalized storybook featuring them as the hero of an amazing adventure!",
      image: "/images/finished.png",
      bgColor: "bg-cream",
      iconColor: "text-adventure-green",
      emoji: "📚"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-hero-gradient relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="sparkle-animation absolute top-20 left-10 text-3xl text-sunshine-yellow">✨</div>
        <div className="sparkle-animation absolute top-40 right-20 text-2xl text-magic-orange" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="sparkle-animation absolute bottom-40 left-20 text-xl text-tale-purple" style={{ animationDelay: '2s' }}>💫</div>
        <div className="sparkle-animation absolute bottom-20 right-10 text-3xl text-adventure-green" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="relative">
              <FontAwesomeIcon icon={faMagicWandSparkles} className="text-5xl text-magic-orange sparkle-animation" />
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-gentle border border-magic-orange/20">
              <span className="friendly-text text-tale-purple font-bold text-lg">Simple Magic</span>
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-tale-purple sparkle-animation" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -top-1 -left-1 text-xl animate-pulse">💫</div>
            </div>
          </div>
          
          <div className="relative">
            <h2 className="font-fredoka font-bold text-5xl md:text-6xl mb-6 text-inkwell-black relative z-10">
              How the Magic 
              <span className="text-magic-orange relative">
                Happens!
                <div className="absolute -top-4 -right-4 text-3xl animate-spin-slow">⭐</div>
              </span>
            </h2>
            
            {/* Decorative elements behind title */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-full h-full opacity-10 pointer-events-none">
              <div className="relative w-full h-full">
                <div className="absolute top-4 left-1/4 text-4xl text-sunshine-yellow animate-pulse">✨</div>
                <div className="absolute top-8 right-1/4 text-3xl text-magic-orange animate-bounce" style={{ animationDelay: '1s' }}>🌟</div>
                <div className="absolute bottom-4 left-1/3 text-2xl text-tale-purple animate-pulse" style={{ animationDelay: '2s' }}>💫</div>
                <div className="absolute bottom-8 right-1/3 text-4xl text-adventure-green animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-soft-pink/30 via-lavender/30 to-cream/30 rounded-magical p-8 backdrop-blur-sm border border-white/50 shadow-magical">
              <p className="friendly-xl text-charcoal leading-relaxed font-medium">
                Watch your child transform from a simple photo into the 
                <span className="text-tale-purple font-bold"> hero of their very own </span>
                personalized storybook adventure!
              </p>
              <div className="flex justify-center items-center gap-2 mt-4">
                <span className="text-2xl animate-bounce">📸</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-magic-orange text-xl animate-pulse" />
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎨</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-magic-orange text-xl animate-pulse" style={{ animationDelay: '0.6s' }} />
                <span className="text-2xl animate-bounce" style={{ animationDelay: '0.9s' }}>📚</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Timeline */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                {/* Step Content */}
                <div className="flex flex-col items-center text-center max-w-sm">
                  {/* Step Number */}
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-white rounded-full shadow-magical flex items-center justify-center border-4 border-magic-orange">
                      <span className="text-2xl">{step.emoji}</span>
                    </div>
                  </div>
                  
                  {/* Image */}
                  <div className="relative w-48 h-48 mb-6 rounded-magical overflow-hidden shadow-magical hover:shadow-adventure transition-all duration-300 transform hover:scale-105">
                    <Image 
                      src={step.image} 
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="font-fredoka font-bold text-xl mb-2 text-inkwell-black">
                    {step.title}
                  </h3>
                  <p className="friendly-text text-tale-purple font-semibold mb-3">
                    {step.subtitle}
                  </p>
                  <p className="friendly-text text-charcoal leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow (except for last step) */}
                {index < timelineSteps.length - 1 && (
                  <div className="flex-shrink-0">
                    <div className="hidden lg:block">
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="text-3xl text-magic-orange sparkle-animation" 
                        style={{ animationDelay: `${index * 0.5}s` }}
                      />
                    </div>
                    <div className="lg:hidden rotate-90">
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="text-3xl text-magic-orange sparkle-animation" 
                        style={{ animationDelay: `${index * 0.5}s` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Centered CTA after timeline */}
        <div className="text-center mb-16">
          <Button href="/create" size="lg" className="adventure-button text-lg px-8 py-4">
            <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
            <span className="hidden sm:inline">Start Creating Your Adventure</span>
            <span className="sm:hidden">Start Creating</span>
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="bg-white rounded-magical p-8 shadow-gentle mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faHeart} className="text-4xl text-reading-red mb-3" />
              <h4 className="friendly-lg font-semibold text-inkwell-black mb-2">Made with Love</h4>
              <p className="friendly-text text-charcoal">Every book is crafted with care and attention to detail</p>
            </div>
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faShippingFast} className="text-4xl text-adventure-green mb-3" />
              <h4 className="friendly-lg font-semibold text-inkwell-black mb-2">Fast & Free Shipping</h4>
              <p className="friendly-text text-charcoal">Your magical book arrives in 7-10 business days</p>
            </div>
            <div className="flex flex-col items-center">
              <FontAwesomeIcon icon={faMagicWandSparkles} className="text-4xl text-magic-orange mb-3" />
              <h4 className="friendly-lg font-semibold text-inkwell-black mb-2">Professional Quality</h4>
              <p className="friendly-text text-charcoal">Premium printing that will last for years to come</p>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-tale-purple rounded-magical p-8 shadow-magical text-white">
            <FontAwesomeIcon icon={faBookOpen} className="text-5xl mb-4 sparkle-animation" />
            <h3 className="font-fredoka font-bold text-3xl mb-4">
              Ready to Create Magic Together?
            </h3>
            <p className="friendly-lg mb-6 opacity-90">
              Join thousands of families who have created unforgettable reading adventures!
            </p>
            <Button href="/create" size="lg" className="bg-white text-tale-purple hover:bg-cream text-lg px-8 py-4">
              <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
              Start Your Adventure Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
