import { footer } from "../../components/footer.ts";
import { header } from "../../components/header.ts";
import { loading } from "./loading.ts";
import { detail } from "./detail.ts";
import { getProductItemDetail } from "../../state/proudcDetail.ts";
import { breadcrumb } from "./breadcrumb.ts";
import { products } from "./products.ts";
import { router } from "../../router.ts";
import { createEventDelegation } from "../../utils/eventDelegation.ts";

const loadInitialProductDetail = (state: any, getProductDetail: any, id: string, setState: any) => {
  const shouldLoad = Object.keys(state.product).length === 0 || state.product.productId !== id;

  if (shouldLoad) {
    getProductDetail(id);
  } else if (state.productList.length > 0) {
    // 같은 상품인데 productList가 있으면 이전 세션의 데이터 -> 초기화 필요
    setState({ productList: [] });
    getProductDetail(id);
  }
};

export const productDetail = (id: string) => {
  const { state, getProductDetail, setState } = getProductItemDetail();

  loadInitialProductDetail(state, getProductDetail, id, setState);

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

  // 렌더링 시점에 productList 결정: loading 중이거나 다른 상품이면 빈 배열
  const currentProductList = state.loading || state.product.productId !== id ? [] : state.productList;

  return `${header(true)}
            <main class="max-w-md mx-auto px-4 py-4">
              ${state.loading ? loading() : `${breadcrumb(state.product?.category1, state.product?.category2)}${detail(state.product)}${currentProductList.length > 0 ? products(currentProductList) : ""}`}
            </main>
          ${footer()}`;
};
