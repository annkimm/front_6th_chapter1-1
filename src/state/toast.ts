import { router } from "../router";
import { Product } from "../type";

const createInitialState = () => ({
  isOpen: false,
  color: "",
  message: "",
});

const createToast = () => {
  let state = createInitialState();

  return {
    getState: () => state,
    setState: (newState: Partial<ReturnType<typeof createInitialState>>) => {
      state = { ...state, ...newState };
    },
    reset: () => {
      state = createInitialState();
    },
  };
};

const toast = createToast();

export const resetCartState = toast.reset;

export const toastMessage = () => {
  const openToast = (message: string, color: string) => {
    toast.setState({ isOpen: true, message, color });
    router().render();

    setTimeout(() => {
      toast.setState({ isOpen: false, message: "", color: "" });
      router().render();
    }, 3000);
  };

  return {
    state: toast.getState(),
    openToast,
  };
};
