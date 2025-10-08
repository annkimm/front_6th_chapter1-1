type EventHandlers = {
  input?: Record<string, (e: Event) => void>;
  change?: Record<string, (e: Event) => void>;
  click?: Record<string, (e: Event) => void>;
  clickByClass?: Record<string, (e: Event, element: HTMLElement) => void>;
  keydown?: Record<string, (e: KeyboardEvent) => void>;
  globalKeydown?: (e: KeyboardEvent) => void;
};

const registeredHandlers: {
  input: Map<string, (e: Event) => void>;
  change: Map<string, (e: Event) => void>;
  click: Map<string, (e: Event) => void>;
  clickByClass: Map<string, (e: Event, element: HTMLElement) => void>;
  keydown: Map<string, (e: KeyboardEvent) => void>;
  globalKeydown: ((e: KeyboardEvent) => void) | null;
} = {
  input: new Map(),
  change: new Map(),
  click: new Map(),
  clickByClass: new Map(),
  keydown: new Map(),
  globalKeydown: null,
};

let globalInitialized = false;

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

export const createEventDelegation = (handlers: EventHandlers) => {
  return () => {
    initializeGlobalListeners();

    if (handlers.input) {
      Object.entries(handlers.input).forEach(([id, handler]) => {
        registeredHandlers.input.set(id, handler);
      });
    }

    if (handlers.change) {
      Object.entries(handlers.change).forEach(([id, handler]) => {
        registeredHandlers.change.set(id, handler);
      });
    }

    if (handlers.click) {
      Object.entries(handlers.click).forEach(([id, handler]) => {
        registeredHandlers.click.set(id, handler);

        document.querySelectorAll(`#${id}`).forEach((element) => {
          if (!element.hasAttribute("data-click-attached")) {
            element.setAttribute("data-click-attached", "true");
            element.addEventListener("click", (e) => handler(e));
          }
        });
      });
    }

    if (handlers.clickByClass) {
      Object.entries(handlers.clickByClass).forEach(([className, handler]) => {
        registeredHandlers.clickByClass.set(className, handler);

        // 테스트 환경 userEvent.click 지원
        document.querySelectorAll(`.${className}`).forEach((element) => {
          if (!element.hasAttribute("data-click-attached")) {
            element.setAttribute("data-click-attached", "true");
            element.addEventListener("click", (e) => handler(e, element as HTMLElement));
          }
        });
      });
    }

    if (handlers.keydown) {
      Object.entries(handlers.keydown).forEach(([id, handler]) => {
        registeredHandlers.keydown.set(id, handler);
      });
    }

    if (handlers.globalKeydown) {
      registeredHandlers.globalKeydown = handlers.globalKeydown;
    }
  };
};
