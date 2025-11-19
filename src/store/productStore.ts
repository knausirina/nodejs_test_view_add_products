import { create } from "zustand";
import { Product } from "@/types/product";
import { getUnicId } from "@/app/utils/unicId";
import { API_URL } from "@/configs/Config";

interface ProductsState {
  products: Product[];
  favorites: Set<string>;
  loading: boolean;
  loaded: boolean;
  currentPage: number;
  fetchProducts: () => Promise<void>;
  toggleLike: (id: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  getProductById: (id: string) => Product | undefined;
  deleteProduct: (id: string) => void;
  setPage: (page: number) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => {
  return {
    products: [] as Product[],
    favorites: new Set<string>(),
    currentPage: 1,
    loading: false,
    loaded: false,

    setPage: (newPage: number) => {
      set((state) => {
        return {
          ...state,
          currentPage: newPage,
        };
      });
    },
    fetchProducts: async () => {
      const stateBefore = get();
      if (stateBefore.loaded) {
        return;
      }

      if (stateBefore.loading) {
        return;
      }

      set((state) => ({ ...state, loading: true }));

      try {
        const url = new URL(API_URL);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let products: Product[] = [];

        if (Array.isArray(data)) products = data;
        else products = data.books || data.data || [];

        const mergedProducts = [...products, ...stateBefore.products];

        set((state) => ({
          ...state,
          products: mergedProducts,
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
      return state.products.find((p) => p.id == id);
    },
    deleteProduct: (id: string) => {
      set((state) => {
        const newProducts = state.products.filter(
          (product) => product.id !== id
        );
        const totalProducts = newProducts.length;
        return {
          ...state,
          products: newProducts,
          totalProducts: totalProducts,
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
        const oldCount = state.products.length;
        return {
          ...state,
          products: [product, ...state.products],
          totalProducts: oldCount + 1,
        };
      });
    },
  };
});
