import { footer } from "../../components/footer.js";
import { header } from "../../components/header.js";
import { loading } from "./loading.js";
import { detail } from "./detail.js";

export const productDetail = (link: string) => {
  console.log(link);

  return `${header()}${loading()}${detail()}${footer()}`;
};
