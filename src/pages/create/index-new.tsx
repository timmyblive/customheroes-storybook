import dynamic from 'next/dynamic';

// Dynamic import with no SSR to prevent hydration issues
const CreateStorybookForm = dynamic(
  () => import('./form'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
);

export default CreateStorybookForm;
