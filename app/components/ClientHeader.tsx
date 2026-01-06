'use client';

import dynamic from 'next/dynamic';
import { SaveProvider } from './SaveContext';

// Header를 클라이언트 전용으로 감싸고 SaveProvider로 감싸기
const Header = dynamic(() => import('./Header'), { ssr: false });

export default function ClientHeader() {
  return (
    <SaveProvider>
      <Header />
    </SaveProvider>
  );
}
