import { create } from "zustand";
import { Product } from "@/types/product";
import { getUnicId } from "@/app/utils/unicId";
import { API_URL } from "@/configs/Config";

interface ProductsState {
  books: Product[];
  favorites: Set<string>;
  loading: boolean;
  loaded: boolean;
  fetchProducts: (page?: number) => Promise<void>;
  toggleLike: (id: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  getProductById: (id: string) => Product | undefined;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductsState>((set, get) => {
  return {
    books: [] as Product[],
    favorites: new Set<string>(),
    loading: false,
    loaded: false,

    setPage: (page: number) =>
      set((state) => ({ ...state, currentPage: page })),
    setVisibleFilter: (visibleFilter: number) =>
      set((state) => ({ ...state, visibleFilter: visibleFilter })),

    fetchProducts: async (page = 1) => {
      const stateBefore = get();

      if (stateBefore.loaded) {
        set((s) => ({ ...s, currentPage: page }));
        return;
      }

      if (stateBefore.loading) {
        return;
      }

      set((state) => ({ ...state, loading: true }));

      try {
        const url = new URL(API_URL);

        console.log(`[Store] Fetching from ${url.toString()}`);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let books: Product[] = [];
        let totalCount: number = 0;

        if (Array.isArray(data)) books = data;
        else books = data.books || data.data || [];

        totalCount = data.length;
        const mergedProducts = [...books, ...stateBefore.books];

        set((state) => ({
          ...state,
          books: mergedProducts,
          currentPage: page,
          totalProducts: totalCount,
          loading: false,
          loaded: true,
        }));
      } catch (error) {
        console.error("[Store] Error fetching books:", error);
        set((state) => ({
          ...state,
          loading: false,
        }));
      }
    },
    toggleLike: (id: string) => {
      set((state) => {
        const newFavorites = new Set(state.favorites);
        if (newFavorites.has(id)) newFavorites.delete(id);
        else newFavorites.add(id);

        return {
          ...state,
          favorites: newFavorites,
        };
      });
    },
    getProductById: (id: string): Product | undefined => {
      const state = get();
      return state.books.find((p) => p.id == id);
    },
    deleteProduct: (id: string) => {
      set((state) => {
        const newProducts = state.books.filter(
          (product) => product.id !== id
        );
        const oldCount = state.books.length;
        const newCount = oldCount - 1;
        console.log(
          "xxx newCount newProducts.count=",
          newProducts.length,
          " oldCount =",
          oldCount
        );
        return {
          ...state,
          books: newProducts,
          totalProducts: newCount,
        };
      });
    },
    addProduct: (newProduct: Omit<Product, "id">) => {
      set((state) => {
        const id = getUnicId();
        const product: Product = {
          id,
          ...newProduct,
        };
        const oldCount = state.books.length;
        return {
          ...state,
          books: [product, ...state.books],
          totalProducts: oldCount + 1,
        };
      });
    },
  };
});
