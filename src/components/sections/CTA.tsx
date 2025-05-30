import Button from '../ui/Button';

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-cta-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4 text-white drop-shadow-lg">
          Create Your Child's Personalized Adventure Today
        </h2>
        <p className="text-white text-lg max-w-3xl mx-auto mb-8 drop-shadow-md">
          Transform your photos into a magical storybook that will be cherished for years to come. Get started in minutes and receive your professionally printed book in days.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button href="/create" variant="cta" size="lg">
            <span className="hidden sm:inline">Start Creating</span>
            <span className="sm:hidden">Create</span>
          </Button>
          <Button href="/how-it-works" variant="cta-outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
