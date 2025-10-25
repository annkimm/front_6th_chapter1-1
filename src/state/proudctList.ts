import { getCategories, getProducts } from "../api/productApi";
import { router } from "../router";
import { Filters, Pagination, Product } from "../type";
import { getParams } from "../utils/fetch";

const createInitialState = () => ({
  loading: true,
  products: [] as Array<Product>,
  pagination: {} as Pagination,
  filters: {} as Filters,
  categories: {} as { [key: string]: {} },
  search: "",
  isLoadingMore: false,
  _loadingLock: false, // 중복 로딩 방지용 플래그
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
  const getProudcts = async (
    params: {
      limit: number;
      search: string;
      category1: string;
      category2: string;
      sort: string;
      current?: number;
    },
    isScroll?: boolean,
  ) => {
    // 중복 호출 방지
    if (isScroll && manager.getState()._loadingLock) {
      return;
    }

    if (isScroll) {
      manager.setState({ _loadingLock: true });
    }

    manager.setState({ [isScroll ? "isLoadingMore" : "loading"]: true });

    // 로딩 상태를 즉시 UI에 반영
    if (isScroll) {
      router().render();
    }

    try {
      const result = await getProducts(params);
      let categories = {};

      if (!isScroll) {
        categories = await getCategories();
      }

      const newProducts = isScroll ? [...manager.getState().products, ...result.products] : result.products;

      manager.setState({
        [isScroll ? "isLoadingMore" : "loading"]: false,
        products: newProducts,
        pagination: result.pagination,
        filters: result.filters,
        _loadingLock: false,
        ...(!isScroll ? { categories: categories } : {}),
      });

      const searchParams = getParams(params);

      // 여기서 리렌더링!
      history.pushState(null, "", `${window.location.pathname}?${searchParams}`);

      router().render();
    } catch (error) {
      manager.setState({ _loadingLock: false });
      router().render("/error");
    }
  };

  return {
    state: manager.getState(),
    getProudcts,
  };
};
