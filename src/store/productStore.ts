import { create } from "zustand";
import { Product } from "@/types/product";
import { getUnicId } from "@/app/utils/unicId";
import { API_URL } from "@/configs/Config";
import { persist, PersistOptions, createJSONStorage } from "zustand/middleware";

interface ProductsState {
  products: Product[];
  favorites: string[];
  loading: boolean;
  loaded: boolean;
  currentPage: number;
  totalProducts?: number;
  fetchProducts: () => Promise<void>;
  toggleLike: (id: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  getProductById: (id: string) => Product | undefined;
  deleteProduct: (id: string) => void;
  setPage: (page: number) => void;
}

type PersistedState = Pick<
  ProductsState,
  "products" | "favorites" | "currentPage" | "totalProducts"
>;

const persistOptions: PersistOptions<ProductsState, PersistedState> = {
  name: "products-storage",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    loaded: state.loaded,
    products: state.products,
    favorites: state.favorites,
    currentPage: state.currentPage,
    totalProducts: state.totalProducts,
  }),
  merge: (persistedState, currentState) => {
    return {
      ...currentState,
      ...(persistedState ?? {}),
      fetchProducts: currentState.fetchProducts,
      toggleLike: currentState.toggleLike,
    };
  },
};

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [] as Product[],
      favorites: [] as string[],
      currentPage: 1,
      loading: false,
      loaded: false,
      totalProducts: 0,
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
          console.log("xxx fetch data! ", stateBefore.loaded);
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
            totalProducts: mergedProducts.length,
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
          const favs = Array.isArray(state.favorites)
            ? [...state.favorites]
            : [];
          const idx = favs.indexOf(id);
          if (idx >= 0) favs.splice(idx, 1);
          else favs.unshift(id);

          return {
            ...state,
            favorites: favs,
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
          return {
            ...state,
            products: [product, ...state.products],
            totalProducts: (state.totalProducts || 0) + 1,
          };
        });
      },
    }),
    persistOptions
  )
);
