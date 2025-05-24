import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CTA from '../components/sections/CTA';

export default function ExamplesPage() {
  const exampleBooks = [
    {
      title: "Space Adventure",
      description: "Join your child on an intergalactic journey where they become a brave astronaut exploring distant planets and making friends with aliens.",
      ageRange: "4-8 years",
      image: "/images/placeholder.txt",
      theme: "Adventure"
    },
    {
      title: "Magical Kingdom",
      description: "Your child becomes royalty for a day in this enchanting fairy tale adventure set in a magical kingdom full of friendly creatures.",
      ageRange: "3-6 years",
      image: "/images/placeholder.txt",
      theme: "Fantasy"
    },
    {
      title: "Dinosaur Discovery",
      description: "Travel back in time as your child discovers and learns about different dinosaurs in this educational and exciting prehistoric adventure.",
      ageRange: "5-9 years",
      image: "/images/placeholder.txt",
      theme: "Educational"
    },
    {
      title: "Ocean Explorer",
      description: "Dive deep into the ocean with your child as they explore coral reefs, discover sea creatures, and learn about marine conservation.",
      ageRange: "6-10 years",
      image: "/images/placeholder.txt",
      theme: "Educational/Adventure"
    },
    {
      title: "Superhero Mission",
      description: "Your child becomes the superhero of their dreams, using their special powers to help others and save the day in this action-packed story.",
      ageRange: "4-8 years",
      image: "/images/placeholder.txt",
      theme: "Adventure"
    },
    {
      title: "Bedtime Buddies",
      description: "A gentle bedtime story where your child and their favorite stuffed animals go on a dreamy nighttime adventure before falling asleep.",
      ageRange: "2-5 years",
      image: "/images/placeholder.txt",
      theme: "Bedtime"
    }
  ];

  return (
    <Layout title="Example Storybooks | CustomHereos - Personalized Storybooks">
      <div className="pt-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-8 text-inkwell-black">
            Example Storybooks
          </h1>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-16">
            Browse our collection of personalized storybook examples. Each book can be customized with your child's photos and details to create a truly unique reading experience.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {exampleBooks.map((book, index) => (
              <Card key={index} className="overflow-hidden h-full flex flex-col">
                <div className="h-48 bg-fog flex items-center justify-center">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-montserrat font-bold text-xl text-inkwell-black">
                      {book.title}
                    </h3>
                    <span className="text-xs bg-fog text-charcoal px-2 py-1 rounded-full">
                      {book.ageRange}
                    </span>
                  </div>
                  <p className="text-charcoal mb-4 flex-1">
                    {book.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-story-blue font-semibold">
                      {book.theme}
                    </span>
                    <Button href="/create" size="sm">
                      Create Similar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button href="/create" size="lg">
              Create Your Own Story
            </Button>
          </div>
        </div>
      </div>
      
      <CTA />
    </Layout>
  );
}
