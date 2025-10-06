import { header } from "../../components/header.js";
import { footer } from "../../components/footer.js";
import { card } from "./card.js";
import { searchBar } from "./searchBar.js";
import { skeleton } from "../../components/skeleton.js";
import { loading } from "./loading.js";
import { getProductList, resetProductListState } from "../../state/proudctList.js";
import { createEventDelegation } from "../../utils/eventDelegation.js";
import { router } from "../../router.js";

// 상태 초기화 로직
const ensureCleanState = () => {
  const root = document.getElementById("root");
  if (root?.innerHTML === "") {
    resetProductListState();
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
  const { state, getProudcts } = getProductList();

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
      "product-image": (e, element) => {
        const productId = (element.closest("[data-product-id]") as HTMLElement)?.dataset.productId;
        if (productId) {
          router().push(`/detail/${productId}`);
        }
      },
    },
  })();

  return /*HTML*/ `
    ${header()}
    <main class="max-w-md mx-auto px-4 py-4">
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
    </main>
    ${footer()}
  `;
};
