"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "../types/product";

interface ProductDetailProps {
  product: Product | undefined;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  if (product == null) {
    return (
      <div className="p-4">
        <button onClick={() => router.back()} className="mb-4 text-blue-500">
          &larr; Back to products
        </button>
        <div>Product not found</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="mb-4 text-blue-500">
        &larr; Back to products
      </button>
      <Image
        width={400}
        height={400}
        src="/images/book.png"
        alt={product.title}
        className=" object-contain mb-4"
      />
      <h1 className="text-3xl mb-4">{product.title}</h1>
      <p className="text-lg font-semibold mb-2">ISBN: {product.isbn}</p>
      <p className="text-lg font-semibold mb-4">Pages: {product.pageCount}</p>
      <p className="mb-4">Authors: {product.authors.join(", ")}</p>
    </div>
  );
}
