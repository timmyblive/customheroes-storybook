// Dynamic route for /create/[step]
// This redirects to the main create page with the step parameter
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CreateStorybook from './index';

export default function CreateStep() {
  return <CreateStorybook />;
}
