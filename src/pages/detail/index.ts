import { footer } from "../../components/footer.ts";
import { header } from "../../components/header.ts";
import { loading } from "./loading.ts";
import { detail } from "./detail.ts";
import { getProductItemDetail } from "../../state/proudcDetail.ts";
import { breadcrumb } from "./breadcrumb.ts";
import { products } from "./products.ts";
import { router } from "../../router.ts";
import { createEventDelegation } from "../../utils/eventDelegation.ts";

const loadInitialProductDetail = (state: any, getProductDetail: any, id: string) => {
  if (Object.keys(state.product).length === 0 || state.product.productId !== id) {
    getProductDetail(id);
  }
};

export const productDetail = (id: string) => {
  const { state, getProductDetail, setState } = getProductItemDetail();

  loadInitialProductDetail(state, getProductDetail, id);

  createEventDelegation({
    clickByClass: {
      "related-product-card": (_e: Event, element: HTMLElement) => {
        const productId = element.getAttribute("data-product-id");
        if (productId) {
          router().push(`/product/${productId}`);
        }
      },
    },
    click: {
      "quantity-increase": (e: Event) => {
        setState({ quantity: state.quantity + 1 });
        router().render();
      },
      "quantity-decrease": (e: Event) => {
        const decreaseQuantity = state.quantity - 1;
        setState({ quantity: decreaseQuantity === 0 ? 1 : decreaseQuantity });
        router().render();
      },
    },
  })();

  // 관련 상품은 loadingRelated가 false일 때만 표시
  const currentProductList = state.loadingRelated ? [] : state.productList;

  return `${header(true)}
            <main class="max-w-md mx-auto px-4 py-4">
              ${state.loading ? loading() : `${breadcrumb(state.product?.category1, state.product?.category2)}${detail(state.product, state.quantity)}${currentProductList.length > 0 ? products(currentProductList) : ""}`}
            </main>
          ${footer()}`;
};
