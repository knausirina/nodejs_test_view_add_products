import { create } from "zustand";
import { ApiUrl, ItemsPerPage } from "../components/configs/Config";
import { Product } from "@/types/product";
import { getUnicId } from "@/app/utils/unicId";

interface DummyJsonResponse {
  products: Array<Product>;
  total: number;
  skip: number;
  limit: number;
}

interface ProductsState {
  products: Product[];
  favorites: Set<string>;
  totalProducts: number;
  currentPage: number;
  loading: boolean;
  visibleFilter: number;
  fetchProducts: (page?: number) => Promise<void>;
  setPage: (page: number) => void;
  setVisibleFilter: (f: number) => void;
  toggleLike: (id: string) => void;
  deleteProduct: (id: string) => void;
  addProduct: (product: Product) => void;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductsState>((set, get) => {
  return {
    products: [] as Product[],
    favorites: new Set<string>(),
    totalProducts: 0,
    currentPage: 1,
    loading: false,
    visibleFilter: 0,

    setPage: (page: number) =>
      set((state) => ({ ...state, currentPage: page })),
    setVisibleFilter: (visibleFilter: number) =>
      set((state) => ({ ...state, visibleFilter: visibleFilter })),

    fetchProducts: async (page = 1) => {
      const stateBefore = get();
      if (stateBefore.loading) {
        return;
      }

      set((state) => ({ ...state, loading: true }));

      try {
        const skip = (page - 1) * ItemsPerPage;
        const limit = ItemsPerPage;

        let url = ApiUrl;
        url = url.replace("${limit}", limit.toString());
        url = url.replace("${skip}", skip.toString());

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DummyJsonResponse = await response.json();

        const productsWithLikes = data.products.map((p) => ({
          ...p,
          isLiked: stateBefore.favorites.has(p.id),
        }));

        const localProducts = stateBefore.products.filter((p) => p.isLocal);
        const localIds = new Set(localProducts.map((p) => p.id));
        const remoteFiltered = productsWithLikes.filter(
          (p) => !localIds.has(p.id)
        );

        const combined = [...localProducts, ...remoteFiltered];

        set((state) => ({
          ...state,
          products: combined,
          currentPage: page,
          loading: false,
        }));
      } catch (error) {
        console.error("[Client] Error fetching products:", error);
        set((state) => ({
          ...state,
          products: [],
          loading: false,
        }));
      }
    },
    toggleLike: (id: string) => {
      set((state) => {
        const newFavorites = new Set(state.favorites);
        if (newFavorites.has(id)) {
          newFavorites.delete(id);
        } else {
          newFavorites.add(id);
        }

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
        return {
          ...state,
          products: newProducts,
        };
      });
    },
    addProduct: (product: Product) => {
      set((state) => {
        const newId = getUnicId();
        const newProduct: Product = {
          id: newId,
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          isLocal: true,
        };

        return {
          ...state,
          products: [newProduct, ...state.products],
        };
      });
    },
  };
});
