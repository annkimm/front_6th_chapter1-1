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

const createProductListManager = () => {
  let state = createInitialState();

  return {
    getState: () => state,
    setState: (newState: Partial<ReturnType<typeof createInitialState>>) => {
      state = { ...state, ...newState };
    },
    reset: () => {
      state = createInitialState();
    },
  };
};

const manager = createProductListManager();

export const resetProductListState = manager.reset;

export const productItemList = () => {
  const getProudcts = async (params: {
    limit: number;
    search: string;
    category1: string;
    category2: string;
    sort: string;
  }) => {
    manager.setState({ loading: true });

    try {
      const result = await getProducts(params);
      const categories = await getCategories();

      manager.setState({
        loading: false,
        products: result.products,
        pagination: result.pagination,
        filters: result.filters,
        categories: categories,
      });

      // 여기서 리렌더링!
      router().render();
    } catch (error) {
      router().render("/error");
    }
  };

  return {
    state: manager.getState(),
    getProudcts,
  };
};
