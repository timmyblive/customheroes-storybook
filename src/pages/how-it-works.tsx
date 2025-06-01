import Layout from '../components/layout/Layout';
import HowItWorks from '../components/sections/HowItWorks';
import CTA from '../components/sections/CTA';

export default function HowItWorksPage() {
  return (
    <Layout title="How It Works | CustomHereos - Personalized Storybooks">
      <div className="pt-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-8 text-inkwell-black">
            How CustomHereos Works
          </h1>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-4">
            Creating a personalized storybook is easy with our simple three-step process. 
            Learn how we transform your photos into magical stories that will be cherished for years.
          </p>
        </div>
      </div>
      
      <HowItWorks />
      <CTA />
    </Layout>
  );
}
