import { router } from "./router.ts";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

function main() {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = router().render();
  }

  // popstate 이벤트 리스너 등록 (뒤로가기/앞으로가기, 테스트의 goTo 지원)
  window.addEventListener("popstate", () => {
    router().render();
  });
}

// 애플리케이션 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(main);
} else {
  main();
}
