import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ 
  children, 
  title = 'CustomHereos - Personalized Storybooks' 
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Create magical, personalized storybooks featuring your child as the hero with CustomHereos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
