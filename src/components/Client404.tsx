"use client";

import { useProductsStore } from "../store/productStore";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import ClientProductDetail from "./ClientProductDetail";

const Client404 = () => {
  const pathname = usePathname();
  const match = pathname?.match(/^\/products\/([^\/]+)/);
  const slug = match?.[1] ?? null;

  const normalizedSlug = slug?.startsWith("id-") ? slug.slice(3) : slug?.trim();

  const productsStore = useProductsStore.getState();
  let product = null;
  if (normalizedSlug != null) {
    product = productsStore.getProductById(normalizedSlug);
    if (product != null) {
      const paramsPromise: Promise<{ id: string }> = Promise.resolve({
        id: product.id,
      });

      return (
        <div>
          <Suspense fallback={<div>Загрузка...</div>}>
            <ClientProductDetail params={paramsPromise} />
          </Suspense>
        </div>
      );
    }
  }

  return (
    <div>
      <h1>404 - Not found book</h1>
    </div>
  );
};

export default Client404;
