'use client';

import { useRouter } from 'next/navigation';
import { Product } from '../types/product';
import Image from 'next/image';

interface ProductDetailProps {
  product: Product | undefined;
}

export default function ProductDetail({ product}: ProductDetailProps) {
  const router = useRouter();

  if (product == null) {
    return (
    <div className="p-4">
       <button onClick={() => router.back()} className="mb-4 text-blue-500">
        &larr; Back to products
      </button>
      <div>Product not found</div>
    </div>)
  }

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="mb-4 text-blue-500">
        &larr; Back to products
      </button>
      <h1 className="text-3xl mb-4">{product.title}</h1>
      <Image src={product.thumbnail} width={200} height={200} alt={product.title} className="w-1/2 object-cover mb-4" />
      <p>{product.description}</p>
      <p className="text-2xl font-bold mt-4">${product.price}</p>
    </div>
  );
}