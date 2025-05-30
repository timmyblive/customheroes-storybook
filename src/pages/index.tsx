import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';
import CTA from '../components/sections/CTA';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </Layout>
  );
}
