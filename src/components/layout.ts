import { router } from "../router";
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
        router().render();
      }
    },
    click: {
      "cart-icon-btn": () => {
        openCartModal();
        router().render();
      },
      "cart-modal-close-btn": () => {
        openCartModal();
        router().render();
      },
      cart: (e: Event) => {
        if ((e.target as HTMLElement).id === "cart") {
          openCartModal();
          router().render();
        }
      },
    },
  })();

  return `
            ${header(isDetail)}
            ${child}
            ${footer()}
            ${state.isOpen ? cart() : ""}
        `;
};
