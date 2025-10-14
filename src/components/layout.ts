import { cartModal } from "../state/cart";
import { toastMessage } from "../state/toast";
import { createEventDelegation } from "../utils/eventDelegation";
import { cart } from "./cart";
import { footer } from "./footer";
import { header } from "./header";
import { toast } from "./toast/toast";

export const layout = (child: string, isDetail?: boolean) => {
  const { state, openCartModal, deleteCartItem, deleteAllCartItem } = cartModal();
  const { state: toastState } = toastMessage();

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
      "cart-modal-clear-cart-btn": deleteAllCartItem,
    },
    clickByClass: {
      "cart-item-remove-btn": (_e: Event, element: HTMLElement) => {
        const productId = element?.dataset.productId;
        if (productId) {
          deleteCartItem(productId);
        }
      },
    },
  })();

  return `
            ${header(state.productList.length, isDetail)}
            ${child}
            ${footer()}
            ${state.isOpen ? cart(state.productList, state.checkbox) : ""}
            ${toastState.isOpen ? toast(toastState.color, toastState.message) : ""}
        `;
};
