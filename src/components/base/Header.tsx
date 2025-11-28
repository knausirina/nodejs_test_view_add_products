import { BASE_PATH } from '@/configs/Config';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <link rel="icon" href={`${BASE_PATH}/favicon.png`} type="image/png" />
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-2xl font-bold">
          Next.js App
        </Link>
        <div>
          <Link
            href="/create-product"
            className="ml-4 inline-flex items-center gap-2 bg-white text-blue-600 px-3 py-1 rounded hover:opacity-90"
            aria-label="Create product"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Create product</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}