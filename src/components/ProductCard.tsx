"use client";

import React from "react";
import { productService } from "@/services/productService";
import { Heart, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isLiked: boolean;
}

const ProductCard = ({ product, isLiked }: ProductCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    productService.deleteProduct(product.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("like toggled for product id:", product.id);
    productService.toggleFavorite(product.id);
  };

  return (
    <Link href={`/products/${product.id}`} passHref>
      <div className="flex h-[500px]  flex-col p-4 border rounded-lg shadow-md">
        <Image
          width={200}
          height={200}
          src="/images/book.png"
          alt={product.title}
          className="w-full h-48 object-contain mb-4"
        />
        <h2 className="text-xl font-semibold mb-2 overflow-hidden">
          <div>{product.title}</div>
        </h2>
        <span className="text-xs text-gray-600">number of pages:</span>
        <p className="text-sm overflow-hidden line-clamp-1">
          {product.pageCount}
        </p>
        <span className="text-xs mt-2 text-gray-600">authors:</span>
        <p
          className="grow overflow-hidden line-clamp-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.authors}
        </p>
        <div>
          <span className="text-xs text-gray-600">isbn: </span>
          <span className="text-xs">{product.isbn}</span>
        </div>

        <div className="flex mt-auto">
          <div className="">
            <button onClick={handleLike} className="rounded-full p-2 hover:bg-gray-200">
              <Heart color={isLiked ? "red" : "gray"} fill={isLiked ? "red" : "gray"} size={20}/>
            </button>
            <button onClick={handleDelete} className="rounded-full p-2 hover:bg-gray-200">
              <Trash className="text-gray-400" size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
