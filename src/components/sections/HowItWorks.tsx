import Button from '../ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faPencilAlt, faBookOpen, faMagicWandSparkles, faHeart, faShippingFast } from '@fortawesome/free-solid-svg-icons';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Upload & Dream",
      subtitle: "Share Your Photos & Story Ideas",
      description: "Upload clear photos of your little heroes and tell us about the magical adventure you want to create together!",
      features: ["Upload family photos", "Describe your story idea", "Choose adventure themes"],
      icon: faCloudUploadAlt,
      bgColor: "bg-soft-pink",
      iconColor: "text-tale-purple",
      emoji: "📸"
    },
    {
      number: 2,
      title: "Customize & Create",
      subtitle: "Design Your Perfect Adventure",
      description: "Pick your art style, age group, and story length. Our magical AI storytellers will weave your personalized tale!",
      features: ["Choose illustration style", "Select perfect age group", "Pick story length"],
      icon: faPencilAlt,
      bgColor: "bg-lavender",
      iconColor: "text-magic-orange",
      emoji: "🎨"
    },
    {
      number: 3,
      title: "Print & Enjoy",
      subtitle: "Receive Your Magical Book",
      description: "Your beautiful, professional-quality storybook is printed with love and delivered right to your door!",
      features: ["Professional proofreading", "Professional printing", "Fast, free shipping", "Made with love"],
      icon: faBookOpen,
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
            Creating your personalized storybook is as easy as 1-2-3! 
            Follow these simple steps to bring your magical adventure to life.
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-12 h-1 bg-gradient-to-r from-magic-orange to-tale-purple opacity-30 transform translate-x-0 z-0"></div>
              )}
              
              <div className={`${step.bgColor} rounded-magical p-8 shadow-gentle hover:shadow-magical transition-all duration-300 transform hover:-translate-y-2 relative z-10`}>
                {/* Step number and emoji */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-full shadow-gentle flex items-center justify-center">
                      <span className="text-3xl">{step.emoji}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-magic-orange rounded-full flex items-center justify-center">
                      <span className="text-white font-fredoka font-bold text-sm">{step.number}</span>
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="font-fredoka font-bold text-2xl text-center mb-2 text-inkwell-black">
                  {step.title}
                </h3>
                
                {/* Subtitle */}
                <p className="friendly-text text-center mb-4 text-charcoal font-semibold">
                  {step.subtitle}
                </p>
                
                {/* Description */}
                <p className="friendly-text text-center mb-6 text-charcoal leading-relaxed">
                  {step.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <span className="text-adventure-green text-lg">✓</span>
                      <span className="friendly-text text-charcoal">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Centered CTA after all steps */}
        <div className="text-center mb-16">
          <Button href="/create" size="lg" className="adventure-button text-lg px-8 py-4">
            <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
            Start Creating Your Adventure
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
