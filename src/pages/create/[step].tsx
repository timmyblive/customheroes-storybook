// Dynamic route for /create/[step]
// This handles URLs like /create/1, /create/2, /create/3, /create/4
import { GetServerSideProps } from 'next';
import CreateStorybook from './index';

// This component renders the main CreateStorybook component
// The step parameter is handled by the router.query in the main component
export default function CreateStep() {
  return <CreateStorybook />;
}

// Validate the step parameter on the server side
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { step } = context.params!;
  const stepNumber = parseInt(step as string);
  
  // Validate step is between 1-4
  if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 4) {
    return {
      redirect: {
        destination: '/create/1',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};
