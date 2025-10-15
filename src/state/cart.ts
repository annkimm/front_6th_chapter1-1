import { router } from "../router";
import { Product } from "../type";

const createInitialState = () => ({
  isOpen: false,
  productList: [] as Array<{ quantity: number } & Product>,
  checkbox: {} as { [key: string]: string },
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

  return {
    state: cart.getState(),
    openCartModal,
    addCartItem,
    deleteCartItem,
    deleteAllCartItem,
    decreaseQuantity,
    increaseQuantity,
  };
};
