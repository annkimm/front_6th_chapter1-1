import { router } from "../router";
import { Product } from "../type";

const createInitialState = () => ({
  isOpen: false,
  color: "",
  message: "",
});

const createToast = () => {
  let state = createInitialState();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return {
    getState: () => state,
    setState: (newState: Partial<ReturnType<typeof createInitialState>>) => {
      state = { ...state, ...newState };
    },
    reset: () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      state = createInitialState();
    },
    clearTimeout: () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
    setTimeoutId: (id: ReturnType<typeof setTimeout>) => {
      timeoutId = id;
    },
  };
};

const toast = createToast();

export const resetCartState = toast.reset;

export const toastMessage = () => {
  const openToast = (message: string, color: string) => {
    toast.clearTimeout();

    toast.setState({ isOpen: true, message, color });
    router().render();

    const id = setTimeout(() => {
      toast.setState({ isOpen: false, message: "", color: "" });
      router().render();
    }, 3000);

    toast.setTimeoutId(id);
  };

  return {
    state: toast.getState(),
    openToast,
  };
};
