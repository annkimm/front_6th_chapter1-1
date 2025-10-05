import { productList } from "./pages/list/index.js";
import { productDetail } from "./pages/detail/index.js";

const routes = {
  "/": productList,
  "/product/:id": productDetail,
};

export const router = () => {
  const render = (path?: string) => {
    const link = path ? path : location.pathname;
    const pathnames = link.split("/");
    let key = "";
    let params = "";
    let html = "";

    if (routes[link]) {
      html = routes[link]();
    } else {
      for (let pattern in routes) {
        const patternParts = pattern.split("/").filter((part) => part !== "");
        const urlParts = pathnames.filter((part) => part !== "");

        if (patternParts.length !== urlParts.length) {
          continue;
        }

        let isMatch = true;
        let extractedParams = "";

        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(":")) {
            // 동적 파라미터 부분 - URL의 해당 값 저장
            extractedParams = urlParts[i];
          } else if (patternParts[i] !== urlParts[i]) {
            // 고정 부분이 다르면 매칭 실패
            isMatch = false;
            break;
          }
        }

        // 3단계: 매칭 성공하면 저장
        if (isMatch) {
          key = pattern;
          params = extractedParams;
          break; // 찾았으니 루프 종료
        }
      }
      html = routes[key](params);
    }

    // DOM 업데이트
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = html;
    }
    return html;
  };

  const push = (path: string) => {
    window.history.pushState(null, "", path);
    const html = render(path);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = html;
    }
  };

  return { render, push };
};
