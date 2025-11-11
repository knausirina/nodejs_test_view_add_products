"use client";

import React from "react";
import { useProductStore } from "../store/productStore";
import { Heart, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product,
  isLiked: boolean;
}

const ProductCard = ({ product, isLiked }: ProductCardProps) => {
  const toggleLike = useProductStore((state) => state.toggleLike);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteProduct(product.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("like toggled for product id:", product.id);
    toggleLike(product.id);
  };

  return (
    <Link href={`/products/${product.id}`} passHref>
      <div className="flex flex-col h-full p-4 border rounded-lg shadow-md">
        <Image
          width={200}
          height={200}
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-contain mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">
          <div>{product.title}</div>
        </h2>
        <p
          className="text-gray-600 mb-4 grow overflow-hidden line-clamp-3"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg font-bold">${product.price}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <Heart
                color={isLiked ? "red" : "gray"}
                fill={isLiked ? "red" : "gray"}
                size={20}
              />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <Trash className="text-gray-400" size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
