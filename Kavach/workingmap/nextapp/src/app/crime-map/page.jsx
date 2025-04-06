'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const CrimeMap = dynamic(
  () => import('../../components/common/CrimeMap'),
  { ssr: false }
);

export default function CrimeMapPage() {
  return (
    <div className="h-screen w-full relative">
      <CrimeMap />
    </div>
  );
}