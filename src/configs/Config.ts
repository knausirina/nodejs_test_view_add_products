const env = process.env.NODE_ENV;

const PRODUCTION = "production";
export const ITEMS_PER_PAGE: number = 3;
export const PAGINATION_BUTTONS_COUNT: number = 10;
export const DELAY_SEARCH_MS: number = 300;
export const REVALIDATE_TIME: number = 3600000;
export const API_URL: string = "https://softwium.com/api/books";
export const BASE_PATH: string = env == PRODUCTION ? "/nodejs_test_view_add_products" : "";
