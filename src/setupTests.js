import "@testing-library/jest-dom";
import { configure } from "@testing-library/dom";
import { afterAll, beforeAll } from "vitest";
import { server } from "./__tests__/mockServerHandler.js";

configure({
  asyncUtilTimeout: 5000,
});

// window.scrollTo mock (JSDOM에서 구현되지 않음)
window.scrollTo = () => {};

// IntersectionObserver mock - 전역으로 모든 인스턴스 추적
const allObservers = [];

// 모든 옵저버 정리 공용 함수
global.cleanupAllObservers = () => {
  allObservers.forEach((observer) => observer.disconnect());
  allObservers.length = 0;
};

// cleanupAllObservers를 확장할 수 있는 유틸리티 함수
global.extendCleanupAllObservers = (additionalCleanup) => {
  const originalCleanup = global.cleanupAllObservers;

  global.cleanupAllObservers = () => {
    // 1. 원본 cleanup (IntersectionObserver 정리)
    if (originalCleanup) {
      originalCleanup();
    }

    // 2. 추가 cleanup (도메인 코드에서 전달)
    if (additionalCleanup) {
      additionalCleanup();
    }
  };
};

// 테스트 전용: 도메인 cleanup을 등록하는 함수
global.registerDomainCleanup = (cleanupFn) => {
  const cleanupWrapper = () => cleanupFn();

  // window에 등록
  if (typeof window !== "undefined") {
    window.resetProductListPage = cleanupFn;
    window.cleanupProductListPage = cleanupWrapper;
  }

  // cleanupAllObservers 확장
  global.extendCleanupAllObservers(cleanupWrapper);
};

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    allObservers.push(this);
  }

  observe(target) {
    this.targets.push(target);

    // 스크롤 이벤트 발생 시 콜백 호출
    const handleScroll = () => {
      // DOM에서 제거된 요소는 무시
      if (!document.body.contains(target)) {
        this.unobserve(target);
        return;
      }
      this.callback([
        {
          target,
          isIntersecting: true,
        },
      ]);
    };

    // 스크롤 이벤트 리스너 등록
    if (!target._handleScroll) {
      window.addEventListener("scroll", handleScroll);
      target._handleScroll = handleScroll;
      target._observer = this;
    }
  }

  unobserve(target) {
    if (target._handleScroll) {
      window.removeEventListener("scroll", target._handleScroll);
      delete target._handleScroll;
      delete target._observer;
    }
    const index = this.targets.indexOf(target);
    if (index > -1) {
      this.targets.splice(index, 1);
    }
  }

  disconnect() {
    this.targets.forEach((target) => {
      if (target._handleScroll) {
        window.removeEventListener("scroll", target._handleScroll);
        delete target._handleScroll;
        delete target._observer;
      }
    });
    this.targets = [];
    const index = allObservers.indexOf(this);
    if (index > -1) {
      allObservers.splice(index, 1);
    }
  }
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});
