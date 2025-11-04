import { router } from "./router.ts";
import { toastStore } from "./state/toast.ts";
import { cartStore } from "./state/cart.ts";
import { productStore } from "./state/productDetail.ts";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const appRouter = router();

  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = appRouter.render();
  }

  // ✅ toast 구독 - toast 상태 변경시 자동 렌더링
  appRouter.subscribeToStore(toastStore);
  // ✅ cart 구독 - cart 상태 변경시 자동 렌더링
  appRouter.subscribeToStore(cartStore);

  appRouter.subscribeToStore(productStore);

  // popstate 이벤트 리스너 등록 (뒤로가기/앞으로가기, 테스트의 goTo 지원)
  window.addEventListener("popstate", () => {
    appRouter.render();
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
