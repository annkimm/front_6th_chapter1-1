import { getCategories, getProducts } from "../api/productApi";
import { router } from "../router";
import { Filters, Pagination, Product } from "../type";
import { getParams } from "../utils/fetch";
import { createStore } from "./baseStore";

const createInitialState = () => ({
  loading: true,
  products: [] as Array<Product>,
  pagination: {} as Pagination,
  filters: {} as Filters,
  categories: {} as { [key: string]: {} },
  search: "",
  isLoadingMore: false,
  _loadingLock: false, // 무한 스크롤 중복 방지용 플래그
  isFirstFetching: true,
});

const baseProductList = createStore(createInitialState());

const productListManager = {
  ...baseProductList,
  reset: () => {
    // 구독자 알림 없이 상태만 초기화 (무한 루프 방지)
    const initialState = createInitialState();
    const currentState = baseProductList.getState();
    Object.assign(currentState, initialState);
  },
};

export const productListStore = productListManager;

export const resetProductListState = productListManager.reset;

export const productItemList = () => {
  const getInitProductList = async (params: {
    limit?: number | string;
    search?: string;
    category1?: string;
    category2?: string;
    sort?: string;
    current?: number | string;
  }) => {
    // 한 번의 setState로 모든 상태 업데이트 (불필요한 리렌더링 방지)

    try {
      const result = await getProducts(params);
      const categories = await getCategories();
      const newProducts = result.products;

      productListManager.setState({
        loading: false,
        products: newProducts,
        pagination: result.pagination,
        filters: result.filters,
        categories: categories,
        isFirstFetching: false,
      });

      const searchParams = getParams(params);

      // URL 업데이트
      history.pushState(
        null,
        "",
        searchParams.length === 0 ? window.location.pathname : `${window.location.pathname}?${searchParams}`,
      );

      // setState가 구독자에게 알림 → 자동 렌더링
    } catch (error) {
      productListManager.setState({ _loadingLock: false });
      router().render("/error");
    }
  };

  const getProductList = async (
    params: {
      limit?: number | string;
      search?: string;
      category1?: string;
      category2?: string;
      sort?: string;
      current?: number | string;
    },
    isScroll?: boolean,
  ) => {
    const state = productListManager.getState();

    // 중복 호출 방지
    if (isScroll && state._loadingLock) {
      return;
    }

    // 한 번의 setState로 모든 상태 업데이트 (불필요한 리렌더링 방지)
    productListManager.setState({
      [isScroll ? "isLoadingMore" : "loading"]: true,
      ...(isScroll ? { _loadingLock: true } : {}),
    });

    try {
      const result = await getProducts(params);
      let categories = {};

      if (!isScroll) {
        categories = await getCategories();
      }

      const currentState = productListManager.getState();
      const newProducts = isScroll ? [...currentState.products, ...result.products] : result.products;

      productListManager.setState({
        [isScroll ? "isLoadingMore" : "loading"]: false,
        products: newProducts,
        pagination: result.pagination,
        filters: result.filters,
        _loadingLock: false,
        ...(!isScroll ? { categories: categories } : {}),
      });

      const searchParams = getParams(params);

      // URL 업데이트
      history.pushState(
        null,
        "",
        searchParams.length === 0 ? window.location.pathname : `${window.location.pathname}?${searchParams}`,
      );

      // setState가 구독자에게 알림 → 자동 렌더링
    } catch (error) {
      productListManager.setState({ _loadingLock: false });
      router().render("/error");
    }
  };

  return {
    getState: () => productListManager.getState(), // 함수로 반환하여 항상 최신 state 가져오기
    getProductList,
    getInitProductList,
  };
};
