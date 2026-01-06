'use client';

import dynamic from 'next/dynamic';
import { SaveProvider } from './SaveContext';

const Header = dynamic(() => import('./Header'), { ssr: false });

export default function ClientHeader() {
  return (
    <SaveProvider>
      <Header />
    </SaveProvider>
  );
}
