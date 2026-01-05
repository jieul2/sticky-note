'use client';

import dynamic from 'next/dynamic';

// Header를 클라이언트 전용으로 감싸기
const ClientHeader = dynamic(() => import('./Header'), { ssr: false });

export default ClientHeader;
