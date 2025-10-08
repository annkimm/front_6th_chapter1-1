import { footer } from "./footer";
import { header } from "./header";

export const layout = (child: string, isDetail?: boolean) => {
  return `
        ${header(isDetail)}
        ${child}
        ${footer()}
        `;
};
