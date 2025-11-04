import { loading } from "./loading.ts";
import { detail } from "./detail.ts";
import { productItemDetail } from "../../state/productDetail.ts";
import { breadcrumb } from "./breadcrumb.ts";
import { products } from "./products.ts";
import { router } from "../../router.ts";
import { createEventDelegation } from "../../utils/eventDelegation.ts";
import { layout } from "../../components/layout.ts";
import { cartModal } from "../../state/cart.ts";
import { toastMessage } from "../../state/toast.ts";
import { getParams } from "../../utils/fetch.ts";
import { Product, ProductItem } from "../../type/index.ts";

const loadInitialProductDetail = (
  state: {
    loading: boolean;
    loadingRelated: boolean;
    quantity: number;
    product: ProductItem;
    productList: Array<Product>;
    isFetching: boolean;
  },
  getProductDetail: (id: string) => Promise<void>,
  id: string,
) => {
  // 이미 API 호출 중이면 다시 호출하지 않음 (무한 루프 방지)
  if (state.isFetching) {
    return;
  }

  if (Object.keys(state.product).length === 0 || state.product.productId !== id) {
    getProductDetail(id);
  }
};

export const productDetail = (id: string) => {
  const { state, getProductDetail, setState } = productItemDetail();
  const { addCartItem } = cartModal();
  const { openToast } = toastMessage();

  loadInitialProductDetail(state, getProductDetail, id);

  createEventDelegation({
    clickByClass: {
      "related-product-card": (_e: Event, element: HTMLElement) => {
        const productId = element.getAttribute("data-product-id");
        if (productId) {
          router().push(`/product/${productId}`);
        }
      },
      "breadcrumb-link": (_e: Event, element: HTMLElement) => {
        const currentValue = Object.values(element.dataset);
        const children = element.parentElement?.children;
        const params = {};

        if (children) {
          const buttons = Array.from(children)
            .filter(({ tagName }) => tagName === "BUTTON")
            .map((item) => (item as HTMLElement)?.dataset);

          for (const btn of buttons) {
            const [[key, value]] = Object.entries(btn);
            params[key] = value;

            if (currentValue[0] === value) {
              break;
            }
          }

          // history.pushState(null, "", `${window.location.pathname}?${getParams(params)}`);
          // router().render();
          router().push(`/?${getParams(params)}`);
        }
      },
    },
    click: {
      "quantity-increase": (e: Event) => {
        setState({ quantity: state.quantity + 1 });
        // router().render();
      },
      "quantity-decrease": (e: Event) => {
        const decreaseQuantity = state.quantity - 1;
        setState({ quantity: decreaseQuantity === 0 ? 1 : decreaseQuantity });
        // router().render();
      },
      "add-to-cart-btn": (e: Event) => {
        addCartItem(state.product);
        openToast("장바구니에 추가되었습니다", "green");
      },
    },
  })();

  // 관련 상품은 loadingRelated가 false일 때만 표시
  const currentProductList = state.loadingRelated ? [] : state.productList;

  return `${layout(
    `<main class="max-w-md mx-auto px-4 py-4">
      ${state.loading ? loading() : `${breadcrumb(state.product?.category1, state.product?.category2)}${detail(state.product, state.quantity)}${currentProductList.length > 0 ? products(currentProductList) : ""}`}
    </main>`,
    true,
  )}`;
};
