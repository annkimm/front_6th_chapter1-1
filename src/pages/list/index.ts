import { card } from "./card.js";
import { searchBar } from "./searchBar.js";
import { skeleton } from "../../components/skeleton.js";
import { loading } from "./loading.js";
import { productItemList, resetProductListState } from "../../state/proudctList.js";
import { createEventDelegation } from "../../utils/eventDelegation.js";
import { router } from "../../router.js";
import { layout } from "../../components/layout.js";
import { cartModal, resetCartState } from "../../state/cart.js";
import { toastMessage } from "../../state/toast.js";

// 상태 초기화 로직
const ensureCleanState = () => {
  const root = document.getElementById("root");
  if (root?.innerHTML === "") {
    resetProductListState();
    resetCartState();
  }
};

// 초기 로딩 로직
const loadInitialProducts = (state: any, getProudcts: any) => {
  if (state.loading && Object.keys(state.pagination).length === 0) {
    getProudcts({
      limit: 20,
      search: "",
      category1: "",
      category2: "",
      sort: "price_asc",
    });
  }
};

export const productList = () => {
  const { state, getProudcts } = productItemList();
  const { addCartItem } = cartModal();
  const { openToast } = toastMessage();

  ensureCleanState();
  loadInitialProducts(state, getProudcts);

  createEventDelegation({
    input: {
      "search-input": (e: Event) => {
        state.search = (e.target as HTMLInputElement).value;
      },
    },
    keydown: {
      "search-input": (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          getProudcts({
            limit: Number((e.target as HTMLInputElement).value) ?? 20,
            search: state.search,
            category1: state.filters.category1,
            category2: state.filters.category2,
            sort: state.filters.sort,
          });
        }
      },
    },
    change: {
      "limit-select": (e: Event) => {
        getProudcts({
          limit: Number((e.target as HTMLInputElement).value) ?? 20,
          search: state.search,
          category1: state.filters.category1,
          category2: state.filters.category2,
          sort: state.filters.sort,
        });
      },
      "sort-select": (e: Event) => {
        getProudcts({
          limit: state.pagination.limit,
          search: state.search,
          category1: state.filters.category1,
          category2: state.filters.category2,
          sort: (e.target as HTMLInputElement).value ?? "price_asc",
        });
      },
    },
    clickByClass: {
      "product-image": (_e: Event, element: HTMLElement) => {
        const productId = (element.closest("[data-product-id]") as HTMLElement)?.dataset.productId;
        if (productId) {
          router().push(`/product/${productId}`);
        }
      },
      "category1-filter-btn": (_e: Event, element: HTMLElement) => {
        const category1 = (element.closest("[data-category1]") as HTMLElement)?.dataset.category1;
        if (category1) {
          getProudcts({
            limit: state.pagination.limit,
            search: state.search,
            category1: category1,
            category2: state.filters.category2,
            sort: state.filters.sort,
          });
        }
      },
      "category2-filter-btn": (_e: Event, element: HTMLElement) => {
        const category2 = (element.closest("[data-category2]") as HTMLElement)?.dataset.category2;
        if (category2) {
          getProudcts({
            limit: state.pagination.limit,
            search: state.search,
            category1: state.filters.category1,
            category2: category2,
            sort: state.filters.sort,
          });
        }
      },
      "add-to-cart-btn": (_e: Event, element: HTMLElement) => {
        const productId = element?.dataset.productId;
        const product = state.products.find((item) => item.productId === productId);

        if (product) {
          addCartItem(product);
          openToast("장바구니에 추가되었습니다", "green");
        }
      },
    },
  })();

  return /*HTML*/ `
    ${layout(
      `<main class="max-w-md mx-auto px-4 py-4">
        ${searchBar(state.loading, state.filters, state.pagination.limit, state.categories)}
        <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 개수 정보 (loading 중일 때는 안보임) -->
            ${
              state.loading
                ? ""
                : `<div class="mb-4 text-sm text-gray-600">
              총 <span class="font-medium text-gray-900">${state.pagination.total}개</span>의 상품
            </div>`
            }
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              ${state.loading ? skeleton() : state.products.map((product: any) => card(product)).join("")}
            </div>
            ${
              state.loading
                ? loading()
                : `<div class="text-center py-4 text-sm text-gray-500">
              모든 상품을 확인했습니다
            </div>`
            }
          </div>
        </div>
      </main>`,
    )}
  `;
};
