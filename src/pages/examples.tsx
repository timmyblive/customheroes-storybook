import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function ExamplesPage() {
  const exampleBooks = [
    {
      title: "Space Adventure",
      description: "Join your child on an intergalactic journey where they become a brave astronaut exploring distant planets and making friends with aliens.",
      ageRange: "4-8 years",
      image: "/images/space-adventure.png",
      theme: "Adventure"
    },
    {
      title: "Magical Kingdom",
      description: "Your child becomes royalty for a day in this enchanting fairy tale adventure set in a magical kingdom full of friendly creatures.",
      ageRange: "3-6 years",
      image: "/images/magical-kingdom.png",
      theme: "Fantasy"
    },
    {
      title: "Dinosaur Discovery",
      description: "Travel back in time as your child discovers and learns about different dinosaurs in this educational and exciting prehistoric adventure.",
      ageRange: "5-9 years",
      image: "/images/dinosaur-discovery.png",
      theme: "Educational"
    },
    {
      title: "Ocean Explorer",
      description: "Dive deep into the ocean with your child as they explore coral reefs, discover sea creatures, and learn about marine conservation.",
      ageRange: "6-10 years",
      image: "/images/ocean-explorer.png",
      theme: "Educational/Adventure"
    },
    {
      title: "Superhero Mission",
      description: "Your child becomes the superhero of their dreams, using their special powers to help others and save the day in this action-packed story.",
      ageRange: "4-8 years",
      image: "/images/superhero-mission.png",
      theme: "Adventure"
    },
    {
      title: "Bedtime Buddies",
      description: "A gentle bedtime story where your child and their favorite stuffed animals go on a dreamy nighttime adventure before falling asleep.",
      ageRange: "2-5 years",
      image: "/images/bedtime-buddies.png",
      theme: "Bedtime"
    }
  ];

  return (
    <Layout title="Example Storybooks | CustomHereos - Personalized Storybooks">
      <div className="pt-20 bg-gradient-to-b from-fog/50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-6 text-inkwell-black">
              Example Storybooks
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-tale-purple to-story-blue mx-auto mb-8"></div>
            <p className="text-lg text-center text-charcoal max-w-3xl mx-auto">
              Browse our collection of personalized storybook examples. Each book can be customized with your child's photos and details to create a truly unique reading experience.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {exampleBooks.map((book, index) => (
              <Card key={index} className="overflow-hidden h-full flex flex-col transform hover:translate-y-[-5px] transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="h-64 bg-gradient-to-b from-fog/30 to-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="h-full w-full object-contain hover:scale-105 transition-transform duration-300 shadow-lg"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-montserrat font-bold text-xl text-inkwell-black">
                      {book.title}
                    </h3>
                    <span className="text-xs bg-gradient-to-r from-fog to-lavender/30 text-charcoal px-3 py-1 rounded-full font-medium">
                      {book.ageRange}
                    </span>
                  </div>
                  <p className="text-charcoal mb-5 flex-1">
                    {book.description}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-lavender/20">
                    <span className="text-sm bg-white/80 text-story-blue font-semibold px-2 py-1 rounded-md">
                      {book.theme}
                    </span>
                    <Button href="/create" size="sm" className="bg-gradient-to-r from-adventure-green to-story-blue hover:from-story-blue hover:to-adventure-green text-white">
                      Create Similar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center py-8 px-6 bg-gradient-to-r from-fog/50 to-lavender/30 rounded-2xl shadow-md mb-8">
            <h3 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">
              Ready to Create Your Own Magical Story?
            </h3>
            <p className="text-charcoal max-w-2xl mx-auto mb-6">
              Start your journey today and create a personalized storybook that your child will treasure for years to come.
            </p>
            <Button href="/create" size="lg" className="bg-gradient-to-r from-tale-purple to-story-blue hover:from-story-blue hover:to-tale-purple text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create Your Own Story
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
