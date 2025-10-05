import { header } from "../../components/header.js";
import { footer } from "../../components/footer.js";
import { card } from "./card.js";
import { searchBar } from "./searchBar.js";
import { skeleton } from "../../components/skeleton.js";
import { loading } from "./loading.js";
import { Filters } from "../../type/index.js";

export const productList = () => {
  const listLoading = true;
  const products = [];
  const filters = {} as Filters;
  const limit = 0;
  const total = 0;
  const categories = {};

  return /*HTML*/ `
          ${header()} 
          <main class="max-w-md mx-auto px-4 py-4"> 
            ${searchBar(listLoading, filters, limit, categories)} 
            <!-- 상품 목록 -->
            <div class="mb-6">
              <div>
                <!-- 상품 개수 정보 (loading 중일 때는 안보임) -->
                ${
                  listLoading
                    ? ""
                    : `<div class="mb-4 text-sm text-gray-600">
                  총 <span class="font-medium text-gray-900">${total}개</span>의 상품
                </div>`
                } 
                <!-- 상품 그리드 -->
                <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid"> 
                  ${listLoading ? skeleton() : products.map((product) => card(product)).join("")}
                </div>
                ${
                  listLoading
                    ? loading()
                    : `
                  <div class="text-center py-4 text-sm text-gray-500">
                    모든 상품을 확인했습니다
                  </div>
                  `
                }
              </div>
            </div>
          </main>
          ${footer()}`;
};
