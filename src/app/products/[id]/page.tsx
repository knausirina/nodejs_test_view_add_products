"use client";

import { Suspense, use } from "react";
import ProductDetail from "../../../components/ProductDetail";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useProductStore } from "@/store/productStore";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const getProductById = useProductStore((state) => state.getProductById);

  const product = getProductById
    ? getProductById(resolvedParams.id)
    : undefined;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetail product={product} />
    </Suspense>
  );
}
