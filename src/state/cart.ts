const createInitialState = () => ({
  isOpen: false,
  productList: [],
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
  };

  return {
    state: cart.getState(),
    openCartModal,
  };
};
