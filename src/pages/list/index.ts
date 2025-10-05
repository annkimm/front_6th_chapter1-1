import { header } from "../../components/header.js";
import { footer } from "../../components/footer.js";
import { card } from "./card.js";
import { searchBar } from "./searchBar.js";
import { skeleton } from "../../components/skeleton.js";
import { loading } from "./loading.js";
import { getProductList, resetProductListState } from "../../state/proudctList.js";

let inputController: AbortController | null = null;
let changeController: AbortController | null = null;

export const productList = () => {
  const { state, getProudcts } = getProductList();

  // DOM이 비어있으면 이전 테스트가 정리한 것이므로 상태 리셋
  const root = document.getElementById("root");
  if (root) {
    resetProductListState();
  }

  // 초기 로딩
  if (state.loading && Object.keys(state.pagination).length === 0) {
    getProudcts({ limit: 20, search: "", category1: "", category2: "", sort: "price_asc" });
  }

  // 이전 input 리스너 제거
  if (inputController) {
    inputController.abort();
  }
  inputController = new AbortController();

  document.addEventListener(
    "input",
    (e: Event) => {
      if ((e.target as HTMLElement).id === "search-input") {
        const target = e.target as HTMLInputElement;
        state.search = target.value;
      }
    },
    { signal: inputController.signal },
  );

  const handleLimitChange = (e: Event) => {
    if ((e.target as HTMLElement).id === "limit-select") {
      const target = e.target as HTMLInputElement;

      getProudcts({
        limit: Number(target.value) ?? 20,
        search: state.search,
        category1: state.filters.category1,
        category2: state.filters.category2,
        sort: state.filters.sort,
      });
    }
  };

  // 이전 change 리스너 제거
  if (changeController) {
    changeController.abort();
  }
  changeController = new AbortController();

  document.addEventListener("change", handleLimitChange, { signal: changeController.signal });

  const handleSortChange = (e: Event) => {
    if ((e.target as HTMLElement).id === "sort-select") {
      const target = e.target as HTMLInputElement;

      getProudcts({
        limit: state.pagination.limit,
        search: state.search,
        category1: state.filters.category1,
        category2: state.filters.category2,
        sort: target.value ?? "price_asc",
      });
    }
  };

  document.addEventListener("change", handleSortChange, { signal: changeController.signal });

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
                  ${state.loading ? skeleton() : state.products.map((product) => card(product)).join("")}
                </div>
                ${
                  state.loading
                    ? loading()
                    : `
                  <div class="text-center py-4 text-sm text-gray-500">
                    모든 상품을 확인했습니다
                  </div>
                  `
                }
              </div>
            </div>
          </main>
          ${footer()}`;
};
