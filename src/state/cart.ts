import { router } from "../router";
import { Product } from "../type";

const createInitialState = () => ({
  isOpen: false,
  productList: [] as Array<{ quantity: number } & Product>,
  checkbox: {} as { [key: string]: boolean },
  isAll: false,
});

const createCart = () => {
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

const cart = createCart();

export const resetCartState = cart.reset;

export const cartModal = () => {
  const openCartModal = () => {
    const state = cart.getState();
    cart.setState({ isOpen: !state.isOpen });
    router().render();
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

    router().render();
  };

  const deleteCartItem = (productId: string) => {
    const state = cart.getState();
    const productList = state.productList.filter((item) => item.productId !== productId);
    const entries = Object.entries(state.checkbox).filter(([key]) => key !== productId);
    const checkbox = Object.fromEntries(entries);

    cart.setState({ productList, checkbox });

    router().render();
  };

  const deleteAllCartItem = () => {
    cart.setState({ productList: [], checkbox: {} });

    router().render();
  };

  const decreaseQuantity = (productId: string) => {
    const state = cart.getState();
    const productList = state.productList.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity - 1 === 0 ? 1 : item.quantity - 1 } : item,
    );

    cart.setState({ productList });
    router().render();
  };

  const increaseQuantity = (productId: string) => {
    const state = cart.getState();
    const productList = state.productList.map((item) =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
    );

    cart.setState({ productList });
    router().render();
  };

  const setCheckBox = (productId: string) => {
    const state = cart.getState();
    const checkbox = state.checkbox[productId]
      ? { ...state.checkbox, [productId]: !state.checkbox[productId] }
      : { ...state.checkbox, [productId]: true };

    cart.setState({ checkbox });

    router().render();
  };

  const deletePartCart = () => {
    const state = cart.getState();
    const productList = state.productList.filter((item) => !state.checkbox[item.productId]);

    cart.setState({ productList });

    router().render();
  };

  const setAllCheckbox = () => {
    const state = cart.getState();
    const isAll = !state.isAll;

    const checkbox = state.productList.reduce((acc, cur) => {
      acc[cur.productId] = isAll; // key는 id, 값은 전체 객체
      return acc;
    }, {});

    cart.setState({ checkbox, isAll });

    router().render();
  };

  return {
    state: cart.getState(),
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
