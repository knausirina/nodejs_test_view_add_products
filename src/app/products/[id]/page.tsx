import { Suspense } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Product } from "@/types/product";
import ClientProductDetail from "../../../components/ClientProductDetail";
import { REVALIDATE_TIME } from "@/configs/Config";

export async function generateStaticParams() {
  try {
    const { API_URL } = await import("@/configs/Config");
    const response = await fetch(API_URL, { next: { revalidate: REVALIDATE_TIME } });

    if (!response.ok) {
      console.warn("[generateStaticParams] Failed to fetch products");
      return [];
    }

    const data = await response.json();
    let products: Product[] = [];

    if (Array.isArray(data)) {
      products = data;
    } else {
      products = data?.books || data?.data || [];
    }

    return products.map((product: Product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error("[generateStaticParams] Error fetching products:", error);
    return [];
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ClientProductDetail params={params} />
    </Suspense>
  );
}
