import { footer } from "../../components/footer.ts";
import { header } from "../../components/header.ts";
import { loading } from "./loading.ts";
import { detail } from "./detail.ts";
import { getProductItemDetail, resetProductState } from "../../state/proudcDetail.ts";
import { breadcrumb } from "./breadcrumb.ts";
import { products } from "./products.ts";
import { router } from "../../router.ts";
import { createEventDelegation } from "../../utils/eventDelegation.ts";

const ensureCleanState = () => {
  const root = document.getElementById("root");
  if (root?.innerHTML === "") {
    resetProductState();
  }
};

const loadInitialProductDetail = (state: any, getProductDetail: any, id: string) => {
  if (Object.keys(state.product).length === 0 || state.product.productId !== id) {
    getProductDetail(id);
  }
};

export const productDetail = (id: string) => {
  const { state, getProductDetail } = getProductItemDetail();
  ensureCleanState();
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
  })();

  return `${header(true)}
            <main class="max-w-md mx-auto px-4 py-4">
              ${state.loading ? loading() : `${breadcrumb(state.product?.category1, state.product?.category2)}${detail(state.product)}${state.productList.length > 0 ? products(state.productList) : ""}`}
            </main>
          ${footer()}`;
};
