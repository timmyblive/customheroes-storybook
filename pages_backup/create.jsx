/**
 * Next.js page example for integrating with the Children's Book Generator ADK Agent.
 * 
 * This file would be placed in your Next.js project at:
 * /pages/create.jsx
 */

import Head from 'next/head';
import BookGenerator from '../src/components/BookGenerator';

export default function CreatePage() {
  return (
    <>
      <Head>
        <title>Create a Children's Book | Children's Book Generator</title>
        <meta name="description" content="Create a personalized children's book with your own characters and story." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <BookGenerator />
      </main>
    </>
  );
}
