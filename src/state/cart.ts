import { Product } from "../type";
import { createStore } from "./baseStore";

const getLocalData = () => {
  return localStorage.getItem("shopping_cart") ?? "";
};

const createInitialState = () => ({
  isOpen: false,
  productList: (getLocalData().length > 0 ? JSON.parse(getLocalData()) : []) as unknown as Array<
    { quantity: number } & Product
  >,
  checkbox: {} as { [key: string]: boolean },
  isAll: false,
});

const baseCart = createStore(createInitialState());

const cart = {
  ...baseCart,
  setState: (newState: Partial<ReturnType<typeof createInitialState>>) => {
    baseCart.setState(newState);

    const currentState = baseCart.getState();
    localStorage.setItem("shopping_cart", JSON.stringify(currentState.productList));
  },
  reset: () => {
    // 구독자 알림 없이 상태만 초기화 (무한 루프 방지)
    const initialState = createInitialState();
    const currentState = baseCart.getState();

    // 직접 상태 업데이트 (listeners 호출 안 함)
    Object.assign(currentState, initialState);
  },
};

export const cartStore = cart;

export const resetCartState = cart.reset;

export const cartModal = () => {
  const openCartModal = () => {
    const state = cart.getState();
    cart.setState({ isOpen: !state.isOpen, checkbox: {}, isAll: false });
  };

  const addCartItem = (product: Product) => {
    const state = cart.getState();
    const productItem = state.productList.filter((item) => item.productId === product.productId);
    const productList =
      productItem.length > 0
        ? state.productList.map((item) =>
            item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.productList, { ...product, quantity: 1 }];
    cart.setState({ productList });
  };

  const deleteCartItem = (productId: string) => {
    const state = cart.getState();
    const productList = state.productList.filter((item) => item.productId !== productId);
    const entries = Object.entries(state.checkbox).filter(([key]) => key !== productId);
    const checkbox = Object.fromEntries(entries);

    cart.setState({ productList, checkbox });
  };

  const deleteAllCartItem = () => {
    cart.setState({ productList: [], checkbox: {} });
  };

  const decreaseQuantity = (productId: string) => {
    const state = cart.getState();
    const productList = state.productList.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity - 1 === 0 ? 1 : item.quantity - 1 } : item,
    );

    cart.setState({ productList });
  };

  const increaseQuantity = (productId: string) => {
    const state = cart.getState();
    const productList = state.productList.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    cart.setState({ productList });
  };

  const setCheckBox = (productId: string) => {
    const state = cart.getState();
    const checkbox = state.checkbox[productId]
      ? { ...state.checkbox, [productId]: !state.checkbox[productId] }
      : { ...state.checkbox, [productId]: true };

    cart.setState({ checkbox });
  };

  const deletePartCart = () => {
    const state = cart.getState();
    const productList = state.productList.filter((item) => !state.checkbox[item.productId]);

    cart.setState({ productList });
  };

  const setAllCheckbox = () => {
    const state = cart.getState();
    const isAll = !state.isAll;

    const checkbox = state.productList.reduce((acc, cur) => {
      acc[cur.productId] = isAll; // key는 id, 값은 전체 객체
      return acc;
    }, {});

    cart.setState({ checkbox, isAll });
  };

  return {
    getState: () => cart.getState(),
    openCartModal,
    addCartItem,
    deleteCartItem,
    deleteAllCartItem,
    decreaseQuantity,
    increaseQuantity,
    setCheckBox,
    deletePartCart,
    setAllCheckbox,
  };
};
