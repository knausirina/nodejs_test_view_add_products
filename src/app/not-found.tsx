// app/not-found.tsx
import { Suspense } from 'react';
import Client404 from '../components/Client404';

export default function NotFound() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Client404 />
    </Suspense>
  );
}