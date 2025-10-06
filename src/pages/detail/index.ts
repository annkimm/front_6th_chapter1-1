import { footer } from "../../components/footer.ts";
import { header } from "../../components/header.ts";
import { loading } from "./loading.ts";
import { detail } from "./detail.ts";
import { getProductItemDetail } from "../../state/proudcDetail.ts";
import { breadcrumb } from "./breadcrumb.ts";
import { products } from "./products.ts";
import { router } from "../../router.ts";
import { createEventDelegation } from "../../utils/eventDelegation.ts";

let hasCheckedStaleData = false;

const loadInitialProductDetail = (
  state: any,
  getProductDetail: any,
  getRelatedProducts: any,
  id: string,
  setState: any,
) => {
  const shouldLoad = Object.keys(state.product).length === 0 || state.product.productId !== id;

  if (shouldLoad) {
    // 새 상품 로드
    getProductDetail(id).then(() => {
      getRelatedProducts(id);
    });
  } else if (!state.loadingRelated && state.productList.length > 0) {
    // 같은 상품인데 관련 상품이 이미 로드된 상태 = 이전 세션 데이터
    // 관련 상품만 다시 로드
    setState({ loadingRelated: true, productList: [] });
    getRelatedProducts(id);
  }
};

export const productDetail = (id: string) => {
  const { state, getProductDetail, getRelatedProducts, setState } = getProductItemDetail();

  loadInitialProductDetail(state, getProductDetail, getRelatedProducts, id, setState);

  createEventDelegation({
    clickByClass: {
      "related-product-card": (_e: Event, element: HTMLElement) => {
        const productId = element.getAttribute("data-product-id");
        if (productId) {
          router().push(`/product/${productId}`);
        }
      },
    },
  })();

  // 관련 상품은 loadingRelated가 false일 때만 표시
  const currentProductList = state.loadingRelated ? [] : state.productList;

  return `${header(true)}
            <main class="max-w-md mx-auto px-4 py-4">
              ${state.loading ? loading() : `${breadcrumb(state.product?.category1, state.product?.category2)}${detail(state.product)}${currentProductList.length > 0 ? products(currentProductList) : ""}`}
            </main>
          ${footer()}`;
};
