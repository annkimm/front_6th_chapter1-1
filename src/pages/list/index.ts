import { card } from "./card.js";
import { searchBar } from "./searchBar.js";
import { skeleton } from "../../components/skeleton.js";
import { loading } from "./loading.js";
import { productItemList, resetProductListState } from "../../state/productList.js";
import { createEventDelegation } from "../../utils/eventDelegation.js";
import { router } from "../../router.js";
import { layout } from "../../components/layout.js";
import { cartModal, resetCartState } from "../../state/cart.js";
import { toastMessage } from "../../state/toast.js";
import { getInitParams } from "../../utils/fetch.js";
import { cleanupEventListener, cleanupObserver } from "../../utils/clean.js";

// 전역 observer 관리 (재렌더링 시 이전 observer 정리)
let globalObserverCleanup: (() => void) | null = null;
let isEventListenerInitialized = false;
let globalDOMReadyHandler: (() => void) | null = null;
let isFirstLoad = true; // 첫 로드 플래그

// 통합 초기화 로직
const initializeState = (fullReset = false) => {
  // fullReset이 아닐 때는 조건 확인
  if (!fullReset) {
    const root = document.getElementById("root");
    if (!isFirstLoad && root?.innerHTML !== "") return;
  }

  // 상태 초기화
  resetProductListState();

  // observer cleanup
  cleanupObserver(globalObserverCleanup);

  // fullReset일 때만 추가 cleanup
  if (fullReset) {
    cleanupEventListener(globalDOMReadyHandler);
    isEventListenerInitialized = false;
    isFirstLoad = true;
  } else {
    resetCartState();
    isFirstLoad = false;
  }
};

// 테스트 환경에서 cleanup 등록
if (typeof global !== "undefined" && (global as any).registerDomainCleanup) {
  (global as any).registerDomainCleanup(() => initializeState(true));
}

// 초기 로딩 로직
const loadInitialProducts = (state: any, getProudcts: any) => {
  if (state.loading && Object.keys(state.pagination).length === 0) {
    getProudcts(
      getInitParams()
        ? getInitParams()
        : {
            limit: 20,
            search: "",
            category1: "",
            category2: "",
            sort: "price_asc",
          },
    );
  }
};

export const productList = () => {
  // IMPORTANT: initializeState must be called BEFORE getting state
  initializeState();

  const { state, getProudcts } = productItemList();
  const { addCartItem } = cartModal();
  const { openToast } = toastMessage();

  loadInitialProducts(state, getProudcts);

  // 초기 로딩 시에만 스크롤 최상단으로 이동 (무한 스크롤 후 재렌더링 시에는 스크롤 위치 유지)
  if (state.loading && state.products.length === 0) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }

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
            search: state.filters.search,
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
            search: state.filters.search,
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
    clickByData: {
      "data-breadcrumb": (e, element) => {
        const currentBreadcrumb = element.dataset.breadcrumb;

        getProudcts({
          limit: state.pagination.limit ?? 20,
          search: state.filters.search,
          category1: currentBreadcrumb === "reset" ? "" : state.filters.category1,
          category2: "",
          sort: state.filters.sort,
        });
      },
    },
  })();

  const loadMoreProducts = async () => {
    // 최신 state와 getProudcts를 다시 가져옴
    const { state: currentState, getProudcts: currentGetProudcts } = productItemList();
    await currentGetProudcts(
      {
        limit: currentState.pagination.limit ?? 20,
        search: currentState.search,
        category1: currentState.filters.category1,
        category2: currentState.filters.category2,
        sort: currentState.filters.sort,
        current: currentState.pagination.page + 1,
      },
      true,
    );
  };

  const hasMoreProducts = () => {
    const currentState = productItemList().state;
    return currentState.products.length < currentState.pagination.total;
  };

  const setupInfiniteScroll = (loadMoreProducts: () => Promise<void>) => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        const currentState = productItemList().state;
        if (target.isIntersecting && !currentState.loading && !currentState.isLoadingMore && hasMoreProducts()) {
          loadMoreProducts();
        }
      },
      { rootMargin: "100px" }, // 100px 미리 로드
    );

    // 감시할 요소 (예: 로딩 인디케이터나 마지막 상품)
    const sentinel = document.querySelector("#products-grid > :last-child");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => observer.disconnect(); // 클린업
  };

  // DOM이 완전히 렌더링된 후 IntersectionObserver 설정
  const initObserver = () => {
    // 이전 observer가 있다면 정리
    if (globalObserverCleanup) {
      globalObserverCleanup();
    }
    // 새로운 observer 설정 및 cleanup 함수 저장
    globalObserverCleanup = setupInfiniteScroll(loadMoreProducts);
  };

  // 전역 이벤트 리스너를 한 번만 등록 (중복 등록 방지)
  if (!isEventListenerInitialized) {
    isEventListenerInitialized = true;

    // 핸들러를 전역 변수에 저장
    globalDOMReadyHandler = initObserver;

    // DOMContentLoaded 이벤트 리스너로 observer 설정
    // 모든 렌더링 후에 자동으로 observer가 재설정됨
    const root = document.getElementById("root");
    if (root) {
      root.addEventListener("DOMContentLoaded", globalDOMReadyHandler);
    }
  }

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
              state.loading || state.isLoadingMore
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
