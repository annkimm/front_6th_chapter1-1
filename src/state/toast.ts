import { createStore } from "./baseStore";

const createInitialState = () => ({
  isOpen: false,
  color: "",
  message: "",
});

// ✅ baseStore 사용 - timeout 관리는 별도로
const baseToast = createStore(createInitialState());
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const toast = {
  ...baseToast,
  clearTimeout: () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  },
  setTimeoutId: (id: ReturnType<typeof setTimeout>) => {
    timeoutId = id;
  },
  reset: () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    baseToast.reset();
  },
};

// ✅ router가 구독할 수 있도록 export
export const toastStore = toast;
export const resetCartState = toast.reset;

export const toastMessage = () => {
  const openToast = (message: string, color: string) => {
    toast.clearTimeout();

    toast.setState({ isOpen: true, message, color });

    const id = setTimeout(() => {
      toast.setState({ isOpen: false, message: "", color: "" });
    }, 3000);

    toast.setTimeoutId(id);
  };

  return {
    getState: () => toast.getState(),
    openToast,
  };
};
