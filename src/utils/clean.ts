export const cleanupObserver = (globalObserverCleanup: (() => void) | null) => {
  if (globalObserverCleanup) {
    globalObserverCleanup();
    globalObserverCleanup = null;
  }
};

export const cleanupEventListener = (globalDOMReadyHandler: (() => void) | null) => {
  if (globalDOMReadyHandler) {
    const root = document.getElementById("root");
    if (root) {
      root.removeEventListener("DOMContentLoaded", globalDOMReadyHandler);
    }
    globalDOMReadyHandler = null;
  }
};
