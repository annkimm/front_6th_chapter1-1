import { getProduct, getProducts } from "../api/productApi";
import { router } from "../router";
import { Product, ProductItem } from "../type";
import { createStore } from "./baseStore";

const createInitialState = () => ({
  loading: true,
  loadingRelated: false,
  quantity: 1,
  product: {} as ProductItem,
  productList: [] as Array<Product>,
  isFetching: false, // API 호출 중인지 확인하는 flag
});

const baseProduct = createStore(createInitialState());

const product = {
  ...baseProduct,
  reset: () => {
    // 구독자 알림 없이 상태만 초기화
    const initialState = createInitialState();
    const currentState = baseProduct.getState();
    Object.assign(currentState, initialState);
  },
};

export const productStore = product;

export const resetProductState = product.reset;

export const productItemDetail = () => {
  const getProductDetail = async (id: string) => {
    try {
      product.setState({ loading: true, loadingRelated: true, productList: [], isFetching: true });

      // 상품 상세 정보 로드
      const productDetail = (await getProduct(id)) as ProductItem;
      product.setState({
        loading: false,
        product: productDetail,
      });
      // router().render();

      // 관련 상품 로드
      if (productDetail.category1) {
        const products = await getProducts({
          limit: 20,
          page: 1,
          category1: productDetail.category1,
          category2: productDetail.category2,
          sort: "price_asc",
        });

        product.setState({
          loadingRelated: false,
          productList: ((products.products ?? []) as Array<Product>).filter((item) => item.productId !== id),
          isFetching: false,
        });

        // router().render();
      }
    } catch (error) {
      router().push("/error");
    }
  };

  return {
    getState: () => product.getState(),
    getProductDetail,
    setState: product.setState,
  };
};
