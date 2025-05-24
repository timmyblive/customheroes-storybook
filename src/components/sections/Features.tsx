import Card from '../ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagicWandSparkles, faPalette, faBook, faMobileAlt, faGraduationCap, faGift, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';

export default function Features() {
  const features = [
    {
      icon: faMagicWandSparkles,
      title: "Personalized Stories",
      description: "Advanced AI technology creates unique narratives featuring your child as the main character, tailored to their age and interests.",
      color: "bg-magic-orange/10 text-magic-orange",
      emoji: "✨"
    },
    {
      icon: faPalette,
      title: "Beautiful Illustrations",
      description: "Professional-quality illustrations incorporate your child's likeness and can be customized in multiple artistic styles.",
      color: "bg-tale-purple/10 text-tale-purple",
      emoji: "🎨"
    },
    {
      icon: faBook,
      title: "Premium Quality Books",
      description: "Hardcover, softcover, and deluxe editions printed on high-quality paper with vibrant colors and durable binding.",
      color: "bg-adventure-green/10 text-adventure-green",
      emoji: "📚"
    },
    {
      icon: faMobileAlt,
      title: "Easy Mobile Creation",
      description: "Create your storybook from anywhere using our mobile-optimized interface with simple photo uploads and story options.",
      color: "bg-sunshine-yellow/10 text-sunshine-yellow",
      emoji: "📱"
    },
    {
      icon: faGraduationCap,
      title: "Educational Value",
      description: "Stories designed to match reading levels and developmental stages while promoting literacy and imagination.",
      color: "bg-reading-red/10 text-reading-red",
      emoji: "🎓"
    },
    {
      icon: faGift,
      title: "Perfect Gift",
      description: "Create meaningful presents for birthdays, holidays, or special occasions with gift wrapping and direct shipping options.",
      color: "bg-soft-pink/10 text-soft-pink",
      emoji: "🎁"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-paper-white relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="sparkle-animation absolute top-20 left-10 text-4xl text-magic-orange">✨</div>
        <div className="sparkle-animation absolute top-40 right-20 text-3xl text-tale-purple" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="sparkle-animation absolute bottom-40 left-20 text-2xl text-adventure-green" style={{ animationDelay: '2s' }}>💫</div>
        <div className="sparkle-animation absolute bottom-20 right-10 text-4xl text-sunshine-yellow" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faStar} className="text-3xl text-sunshine-yellow sparkle-animation" />
            <span className="friendly-text text-tale-purple font-semibold">Why Families Love Us</span>
          </div>
          
          <h2 className="font-fredoka font-bold text-4xl md:text-5xl mb-6 text-inkwell-black">
            Why Choose 
            <span className="text-magic-orange"> CustomHereos</span>?
          </h2>
          
          <p className="friendly-lg text-charcoal max-w-3xl mx-auto leading-relaxed">
            Our personalized storybooks combine magical AI technology with professional storytelling 
            to create truly unique reading adventures that your family will treasure forever!
            <FontAwesomeIcon icon={faHeart} className="text-reading-red ml-2" />
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="feature" className="p-8 hover:shadow-magical transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-magical">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-20 h-20 flex items-center justify-center ${feature.color} rounded-magical shadow-gentle relative`}>
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl" />
                  <span className="absolute -top-2 -right-2 text-2xl">{feature.emoji}</span>
                </div>
              </div>
              
              <h3 className="font-fredoka font-bold text-xl mb-4 text-center text-inkwell-black">
                {feature.title}
              </h3>
              
              <p className="friendly-text text-charcoal text-center leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
