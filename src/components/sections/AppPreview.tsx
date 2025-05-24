import OptionCard from '../ui/OptionCard';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';

export default function AppPreview() {
  return (
    <section className="py-16 md:py-24 bg-hero-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4 text-inkwell-black">
            Easy Creation Process
          </h2>
          <p className="text-charcoal text-lg max-w-3xl mx-auto">
            Our intuitive interface guides you through each step of creating your personalized storybook.
          </p>
        </div>
        
        <div className="bg-paper-white rounded-lg shadow-level-4 max-w-4xl mx-auto overflow-hidden">
          {/* App Header */}
          <div className="bg-brand-gradient text-white px-6 py-4 flex justify-between items-center">
            <h3 className="font-montserrat font-semibold text-lg">Create Your Storybook</h3>
            <span>Project #12345</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative flex justify-between bg-fog py-4 px-8">
            {/* Background line */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-300 -translate-y-1/2 z-0"></div>
            
            {/* Progress line */}
            <div className="absolute top-1/2 left-8 w-1/4 h-1 bg-brand-gradient -translate-y-1/2 z-0"></div>
            
            {/* Step circles */}
            <div className="relative z-10 w-8 h-8 rounded-full bg-adventure-green border-adventure-green text-white flex items-center justify-center font-semibold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-story-blue border-story-blue text-white flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-charcoal flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-charcoal flex items-center justify-center font-semibold text-sm">
              4
            </div>
            <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-charcoal flex items-center justify-center font-semibold text-sm">
              5
            </div>
          </div>
          
          {/* App Content */}
          <div className="p-6 md:p-8">
            <h3 className="font-montserrat font-bold text-2xl mb-3 text-inkwell-black">
              Step 2: Describe Your Story
            </h3>
            <p className="text-charcoal mb-6">
              Tell us what kind of story you'd like to create. This helps our AI generate a personalized narrative.
            </p>
            
            <TextArea
              label="Story Description"
              id="story-description"
              placeholder="Enter a brief description, like 'A magical adventure where my daughter explores a fantasy kingdom'"
              rows={4}
              value="A story about my son and his cat exploring a jungle, where they discover hidden ruins and make friends with the animals."
              onChange={(e) => {/* Handle text change */}}
              className="mb-6"
            />
            
            <div className="mb-6">
              <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                Target Age Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OptionCard
                  icon={<i className="fas fa-baby"></i>}
                  title="3-5 Years"
                  description="Simple words, short sentences"
                />
                <OptionCard
                  icon={<i className="fas fa-child"></i>}
                  title="6-8 Years"
                  description="Engaging narratives, more details"
                  selected={true}
                />
                <OptionCard
                  icon={<i className="fas fa-running"></i>}
                  title="9-12 Years"
                  description="Complex plots, rich vocabulary"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block font-montserrat font-semibold mb-3 text-inkwell-black">
                Story Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OptionCard
                  icon={<i className="fas fa-crown"></i>}
                  title="Fairytale"
                  description="Magical, enchanting"
                />
                <OptionCard
                  icon={<i className="fas fa-compass"></i>}
                  title="Adventure"
                  description="Exciting, action-packed"
                  selected={true}
                />
                <OptionCard
                  icon={<i className="fas fa-rocket"></i>}
                  title="Sci-Fi"
                  description="Futuristic, imaginative"
                />
              </div>
            </div>
            
            <div>
              <h4 className="font-montserrat font-semibold mb-3 text-inkwell-black">
                Uploaded Photos
              </h4>
              <div className="flex flex-wrap gap-4">
                <div className="w-24 h-24 relative rounded-md overflow-hidden shadow-level-1 bg-blue-100">
                  <div className="w-full h-full flex items-center justify-center text-story-blue">
                    <i className="fas fa-user-circle text-3xl"></i>
                  </div>
                  <button className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-reading-red hover:bg-reading-red hover:text-white transition-colors">
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
                <div className="w-24 h-24 relative rounded-md overflow-hidden shadow-level-1 bg-blue-100">
                  <div className="w-full h-full flex items-center justify-center text-story-blue">
                    <i className="fas fa-cat text-3xl"></i>
                  </div>
                  <button className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-reading-red hover:bg-reading-red hover:text-white transition-colors">
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
                <button className="w-24 h-24 bg-fog flex items-center justify-center rounded-md text-story-blue hover:bg-blue-50 transition-colors">
                  <i className="fas fa-plus text-xl"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* App Footer */}
          <div className="bg-fog px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <Button variant="secondary">Back</Button>
            <Button>Continue</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
