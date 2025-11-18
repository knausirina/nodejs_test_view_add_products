import { useProductStore } from "@/store/productStore";
import { Product } from "@/types/product";

export const productService = {
  async loadData(page: number) {
    const store = useProductStore.getState();
    await store.fetchProducts(page);
  },

  toggleFavorite(productId: string) {
    const store = useProductStore.getState();
    store.toggleLike(productId);
  },

  deleteProduct(productId: string) {
    const store = useProductStore.getState();
    store.deleteProduct(productId);
  },

  addProduct(product: Omit<Product, "id">) {
    const store = useProductStore.getState();
    store.addProduct(product);
  },

  getProduct(productId: string): Product | undefined {
    const store = useProductStore.getState();
    return store.getProductById(productId);
  },

  getAllProducts(): Product[] {
    const store = useProductStore.getState();
    return store.books;
  },

  getFavorites(): Set<string> {
    const store = useProductStore.getState();
    return store.favorites;
  },

  isLoading(): boolean {
    const store = useProductStore.getState();
    return store.loading;
  }
};
