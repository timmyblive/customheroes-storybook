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
      image: "/images/Upload.png",
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
    <section className="py-16 md:py-24 bg-hero-gradient relative overflow-hidden">
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
          <div className="flex justify-center items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faMagicWandSparkles} className="text-4xl text-magic-orange sparkle-animation" />
            <span className="friendly-text text-tale-purple font-semibold">Simple Magic</span>
          </div>
          
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl mb-6 text-inkwell-black">
            How the Magic 
            <span className="text-magic-orange"> Happens!</span>
          </h2>
          
          <p className="friendly-lg text-charcoal max-w-3xl mx-auto leading-relaxed">
            Watch your child transform from a simple photo into the hero of their very own personalized storybook adventure!
          </p>
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
                      <span className="text-2xl font-fredoka font-bold text-magic-orange">{step.number}</span>
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
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-3xl">{step.emoji}</span>
                    </div>
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
