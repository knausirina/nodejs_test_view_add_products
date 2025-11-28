"use client";

import { useEffect, useState, useMemo } from "react";
import { useProductsStore } from "../store/productStore";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { DELAY_SEARCH_MS, ITEMS_PER_PAGE } from "../configs/Config";
import { Product } from "@/types/product";

enum TypeVisibleCards {
  All,
  Favorites,
}

export default function Products() {
  const allProducts = useProductsStore((state) => state.products);
  const favorites = useProductsStore((state) => state.favorites);
  const loading = useProductsStore((state) => state.loading);
  const currentPage = useProductsStore((state) => state.currentPage);

  const [search, setSearch] = useState("");
  const [typeVisibleCards, setTypeVisibleCards] = useState(
    TypeVisibleCards.All
  );
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const productsStore = useProductsStore.getState();

  useEffect(() => {
    if (!productsStore.loaded)
      productsStore.fetchProducts();
  });

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(search.trim()),
      DELAY_SEARCH_MS
    );
    return () => clearTimeout(t);
  }, [search]);

  const productsOnPage: Product[] = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, allProducts.length);
    const productsForPage = allProducts.slice(start, end);
    return productsForPage;
  }, [allProducts, currentPage]);

  useEffect(() => {
    if (currentPage > 1) {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      if (start >= allProducts.length) {
        setTimeout(() => productsStore.setPage(Math.max(1, currentPage - 1)));
      }
    }
  }, [allProducts, currentPage, productsStore]);

  const filteredProducts = useMemo(() => {
    let list =
      typeVisibleCards === TypeVisibleCards.Favorites
        ? productsOnPage.filter((product) => favorites.includes(product.id))
        : productsOnPage;

    const query = debouncedSearch.toLowerCase();
    if (query) {
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const isbnMatch = p.isbn.toLowerCase().includes(query);
        return titleMatch || isbnMatch;
      });
    }

    return list;
  }, [productsOnPage, favorites, typeVisibleCards, debouncedSearch]);

  return (
    <div className="max-w-[600px] mx-auto px-4">
      <h1 className="text-2xl mb-4">List products</h1>
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
          <button
            onClick={() => setTypeVisibleCards(TypeVisibleCards.All)}
            className={`mr-2 p-2 ${
              typeVisibleCards === TypeVisibleCards.All
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            All cards
          </button>
          <button
            onClick={() => setTypeVisibleCards(TypeVisibleCards.Favorites)}
            className={`p-2 ${
              typeVisibleCards === TypeVisibleCards.Favorites
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch w-full">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={favorites.includes(product.id)}
            />
          ))}
        </div>
        {typeVisibleCards === TypeVisibleCards.All && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={loading}
              onPageChange={(page) => {
                productsStore.setPage(page);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
