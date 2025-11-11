"use client";

import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "../store/productStore";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import {DelaySearchMs, ItemsPerPage} from "./configs/Config";

enum TypeVisibleCards {
  All,
  Favorites,
}

export default function Products() {
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const products = useProductStore(state => state.products);
  const favorites = useProductStore(state => state.favorites);
  const currentPage = useProductStore(state => state.currentPage);
  const loading = useProductStore(state => state.loading);
  const visibleFilter = useProductStore(state => state.visibleFilter);
  const setVisibleFilter = useProductStore(state => state.setVisibleFilter);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage, products.length]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), DelaySearchMs);
    return () => clearTimeout(t);
  }, [search]);

  const filteredProducts = useMemo(() => {
    let list = visibleFilter === TypeVisibleCards.Favorites
      ? products.filter((product) => favorites.has(product.id))
      : products;

    const q = debouncedSearch.toLowerCase();
    if (q) {
      const num = Number(q);
      const isNum = !isNaN(num);

      list = list.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const priceMatch = isNum && Number(p.price) === num;
        return titleMatch || descMatch || priceMatch;
      });
    }

    return list;
  }, [products, favorites, visibleFilter, debouncedSearch]);
  
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
          onClick={() => setVisibleFilter(TypeVisibleCards.All)}
          className={`mr-2 p-2 ${
            visibleFilter === TypeVisibleCards.All
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          All cards
        </button>
        <button
          onClick={() => setVisibleFilter(TypeVisibleCards.Favorites)}
          className={`p-2 ${
            visibleFilter === TypeVisibleCards.Favorites
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
              isLiked={favorites.has(product.id)}
            />
          ))}
        </div>
  {visibleFilter === TypeVisibleCards.All && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / ItemsPerPage)}
              isLoading={loading}
              onPageChange={(page) => {
                if (loading) return;
                fetchProducts(page);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
