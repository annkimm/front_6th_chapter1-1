import { getProduct, getProducts } from "../api/productApi";
import { router } from "../router";
import { Product, ProductItem } from "../type";

const createInitialState = () => ({
  loading: true,
  loadingRelated: false,
  product: {} as ProductItem,
  productList: [] as Array<Product>,
});

const createProductDetail = () => {
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

const product = createProductDetail();

export const resetProductState = product.reset;

export const getProductItemDetail = () => {
  const getProductDetail = async (id: string) => {
    try {
      product.setState({ loading: true, loadingRelated: true, productList: [] });

      // 상품 상세 정보 로드
      const productDetail = (await getProduct(id)) as ProductItem;
      product.setState({
        loading: false,
        product: productDetail,
      });
      router().render();

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
        });

        router().render();
      }
    } catch (error) {
      router().push("/error");
    }
  };

  return {
    state: product.getState(),
    getProductDetail,
    setState: product.setState,
  };
};
