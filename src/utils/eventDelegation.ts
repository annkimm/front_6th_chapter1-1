type EventHandlers = {
  input?: Record<string, (e: Event) => void>;
  change?: Record<string, (e: Event) => void>;
  click?: Record<string, (e: Event) => void>;
  clickByClass?: Record<string, (e: Event, element: HTMLElement) => void>;
  clickByData?: Record<string, (e: Event, element: HTMLElement) => void>;
  keydown?: Record<string, (e: KeyboardEvent) => void>;
  globalKeydown?: (e: KeyboardEvent) => void;
};

// 팩토리 함수로 EventManager 생성
const createEventManager = () => {
  const registeredHandlers: {
    input: Map<string, (e: Event) => void>;
    change: Map<string, (e: Event) => void>;
    click: Map<string, (e: Event) => void>;
    clickByClass: Map<string, (e: Event, element: HTMLElement) => void>;
    clickByData: Map<string, (e: Event, element: HTMLElement) => void>;
    keydown: Map<string, (e: KeyboardEvent) => void>;
    globalKeydown: ((e: KeyboardEvent) => void) | null;
  } = {
    input: new Map(),
    change: new Map(),
    click: new Map(),
    clickByClass: new Map(),
    clickByData: new Map(),
    keydown: new Map(),
    globalKeydown: null,
  };

  let globalInitialized = false;
  let abortController = new AbortController();

  // 공통 로직을 헬퍼 함수로 추출
  const registerHandlers = <T>(
    handlerType: keyof typeof registeredHandlers,
    handlers: Record<string, T> | undefined,
    attachDirectListener?: (selector: string, handler: T) => void,
  ) => {
    if (!handlers) return;

    Object.entries(handlers).forEach(([key, handler]) => {
      (registeredHandlers[handlerType] as Map<string, T>).set(key, handler);

      // 테스트 환경 직접 리스너 등록
      if (attachDirectListener) {
        attachDirectListener(key, handler);
      }
    });
  };

  const initializeGlobalListeners = () => {
    if (globalInitialized) return;

    document.addEventListener("input", (e: Event) => {
      const id = (e.target as HTMLElement).id;
      registeredHandlers.input.get(id)?.(e);
    });

    document.addEventListener("change", (e: Event) => {
      const id = (e.target as HTMLElement).id;
      registeredHandlers.change.get(id)?.(e);
    });

    document.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      // ID 기반 클릭 처리 - 버블링 고려
      registeredHandlers.click.forEach((handler, id) => {
        const element = target.closest(`#${id}`) as HTMLElement;
        if (element) {
          handler(e);
        }
      });

      // 클래스 기반 클릭 처리
      registeredHandlers.clickByClass.forEach((handler, className) => {
        const element = target.closest(`.${className}`) as HTMLElement;
        if (element) {
          handler(e, element);
        }
      });

      // data 속성 기반 클릭 처리
      registeredHandlers.clickByData.forEach((handler, dataAttr) => {
        const element = target.closest(`[${dataAttr}]`) as HTMLElement;
        if (element) {
          handler(e, element);
        }
      });
    });

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      // 전역 키 이벤트 먼저 처리
      registeredHandlers.globalKeydown?.(e);

      // ID 기반 키 이벤트 처리
      const id = (e.target as HTMLElement).id;
      registeredHandlers.keydown.get(id)?.(e);
    });

    globalInitialized = true;
  };

  return {
    register: (handlers: EventHandlers) => {
      initializeGlobalListeners();

      registerHandlers("input", handlers.input);
      registerHandlers("change", handlers.change);

      registerHandlers("click", handlers.click, (id, handler) => {
        document.querySelectorAll(`#${id}`).forEach((element) => {
          if (!element.hasAttribute("data-click-attached")) {
            element.setAttribute("data-click-attached", "true");
            element.addEventListener("click", handler, { signal: abortController.signal });
          }
        });
      });

      registerHandlers("clickByClass", handlers.clickByClass, (className, handler) => {
        document.querySelectorAll(`.${className}`).forEach((element) => {
          if (!element.hasAttribute("data-click-attached")) {
            element.setAttribute("data-click-attached", "true");
            element.addEventListener("click", (e) => handler(e, element as HTMLElement), {
              signal: abortController.signal,
            });
          }
        });
      });

      registerHandlers("clickByData", handlers.clickByData, (dataAttr, handler) => {
        document.querySelectorAll(`[${dataAttr}]`).forEach((element) => {
          if (!element.hasAttribute("data-click-attached")) {
            element.setAttribute("data-click-attached", "true");
            element.addEventListener("click", (e) => handler(e, element as HTMLElement), {
              signal: abortController.signal,
            });
          }
        });
      });

      registerHandlers("keydown", handlers.keydown);

      if (handlers.globalKeydown) {
        registeredHandlers.globalKeydown = handlers.globalKeydown;
      }
    },

    cleanup: () => {
      abortController.abort();
      abortController = new AbortController();
    },
  };
};

// 싱글톤 인스턴스
const manager = createEventManager();

export const createEventDelegation = (handlers: EventHandlers) => {
  return () => manager.register(handlers);
};

// 이벤트 리스너 정리 함수
export const cleanupEventDelegationListeners = () => {
  manager.cleanup();
};
