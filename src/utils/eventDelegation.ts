type EventHandlers = {
  input?: Record<string, (e: Event) => void>;
  change?: Record<string, (e: Event) => void>;
  click?: Record<string, (e: Event) => void>;
  keydown?: Record<string, (e: KeyboardEvent) => void>;
};

const registeredHandlers: {
  input: Map<string, (e: Event) => void>;
  change: Map<string, (e: Event) => void>;
  click: Map<string, (e: Event) => void>;
  keydown: Map<string, (e: KeyboardEvent) => void>;
} = {
  input: new Map(),
  change: new Map(),
  click: new Map(),
  keydown: new Map(),
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
    const id = (e.target as HTMLElement).id;
    registeredHandlers.click.get(id)?.(e);
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
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
      });
    }

    if (handlers.keydown) {
      Object.entries(handlers.keydown).forEach(([id, handler]) => {
        registeredHandlers.keydown.set(id, handler);
      });
    }
  };
};
