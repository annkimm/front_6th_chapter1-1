import { cartModal } from "../state/cart";
import { createEventDelegation } from "../utils/eventDelegation";
import { cart } from "./cart";
import { footer } from "./footer";
import { header } from "./header";

export const layout = (child: string, isDetail?: boolean) => {
  const { state, openCartModal } = cartModal();

  createEventDelegation({
    globalKeydown: (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        openCartModal();
      }
    },
    click: {
      "cart-icon-btn": openCartModal,
      "cart-modal-close-btn": openCartModal,
      cart: (e: Event) => {
        if ((e.target as HTMLElement).id === "cart") {
          openCartModal();
        }
      },
    },
  })();

  return `
            ${header(state.productList.length, isDetail)}
            ${child}
            ${footer()}
            ${state.isOpen ? cart(state.productList) : ""}
        `;
};
