import { getCategories, getProducts } from "../api/productApi";
import { router } from "../router";
import { Filters, Pagination, Product } from "../type";

const createInitialState = () => ({
  loading: true,
  products: [] as Array<Product>,
  pagination: {} as Pagination,
  filters: {} as Filters,
  categories: {} as { [key: string]: {} },
  search: "",
});

let productState = createInitialState();

// 상태 초기화 함수 (테스트 간 격리를 위해 필요)
export const resetProductListState = () => {
  productState = createInitialState();
};

export const getProductList = () => {
  const getProudcts = async (params: {
    limit: number;
    search: string;
    category1: string;
    category2: string;
    sort: string;
  }) => {
    productState.loading = true;
    const result = await getProducts(params);
    const categories = await getCategories();
    console.log(categories);

    productState.loading = false;
    productState.products = result.products;
    productState.pagination = result.pagination;
    productState.filters = result.filters;
    productState.categories = categories;
    // 여기서 리렌더링!
    router().render();
  };

  return {
    state: productState,
    getProudcts,
  };
};
