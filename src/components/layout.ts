import { cartModal } from "../state/cart";
import { toastMessage } from "../state/toast";
import { createEventDelegation } from "../utils/eventDelegation";
import { cart } from "./cart";
import { footer } from "./footer";
import { header } from "./header";
import { toast } from "./toast/toast";

export const layout = (child: string, isDetail?: boolean) => {
  const {
    state: { isOpen, productList },
    openCartModal,
  } = cartModal();
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
    },
  })();

  return `
            ${header(productList.length, isDetail)}
            ${child}
            ${footer()}
            ${isOpen ? cart() : ""}
            ${toastState.isOpen ? toast(toastState.color, toastState.message) : ""}
        `;
};
