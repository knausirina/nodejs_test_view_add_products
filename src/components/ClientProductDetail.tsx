"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { useProductsStore } from "@/store/productStore";
import { Product } from "@/types/product";
import LoadingSpinner from "./LoadingSpinner";
import { API_URL } from "@/configs/Config";

export default function ClientProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const getProductById = useProductsStore((state) => state.getProductById);
  const [dynamicProduct, setDynamicProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const staticProduct = getProductById(resolvedParams.id);
  const product = staticProduct || dynamicProduct;

  useEffect(() => {
    if (staticProduct) {
      setDynamicProduct(null);
      setNotFoundFlag(false);
      return;
    }

    const fetchDynamicProduct = async () => {
      setLoading(true);
      setNotFoundFlag(false);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        let products: Product[] = [];
        if (Array.isArray(data)) products = data;
        else products = data?.books || data?.data || [];

        const found = products.find(
          (p) => p.id.toString() === resolvedParams.id
        );
        if (found) {
          setDynamicProduct(found);
          setNotFoundFlag(false);
        } else {
          setNotFoundFlag(true);
        }
      } catch (err) {
        console.error("[ClientProductDetail] Error fetching product:", err);
        setNotFoundFlag(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicProduct();
  }, [resolvedParams.id, staticProduct]);

  if (loading) return <LoadingSpinner />;
  if (notFoundFlag) notFound(); 
  if (!product) return <LoadingSpinner />;

  return <ProductDetail product={product} />;
}
