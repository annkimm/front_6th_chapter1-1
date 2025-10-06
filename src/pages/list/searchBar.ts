import { Filters } from "../../type";
import { limit, sort } from "./constants";

export const searchBar = (
  loading: boolean,
  filter: Filters,
  currentLimit: number,
  categories: { [key: string]: {} },
) => {
  return /* HTML*/ `        
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                ${
                  (filter.category1 ?? "") !== ""
                    ? `<span class="text-xs text-gray-500">&gt;</span>
                <button data-breadcrumb="category1" data-category1="${filter.category1}" class="text-xs hover:text-blue-800 hover:underline">${filter.category1}</button>`
                    : ""
                }
                <!-- 카테고리 있을 때 -->
                ${
                  (filter.category2 ?? "") !== ""
                    ? `<span class="text-xs text-gray-500">&gt;</span>
                <span class="text-xs text-gray-600 cursor-default">${filter.category2}</span>`
                    : ""
                }
                <!-- 카테고리 있을 때 // -->
              </div>
              <!-- 1depth 카테고리 -->
              <div class="flex flex-wrap gap-2">
                ${
                  loading
                    ? `<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`
                    : filter.category1.length === 0
                      ? Object.keys(categories)
                          .map(
                            (category) =>
                              `<button data-category1="${category}" class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50">${category}</button>`,
                          )
                          .join("")
                      : ""
                }
              </div>
              ${
                loading
                  ? ""
                  : filter.category1.length > 0
                    ? `
                      <!-- 2depth 카테고리 -->
                      <!-- 카테고리 있을 때 -->
                      <div class="space-y-2">
                        <div class="flex flex-wrap gap-2">
                          ${Object.keys(categories[filter.category1])
                            .map(
                              (category) => `
                            <button data-category1="${filter.category1}" data-category2="${category}" class="category2-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors bg-white ${filter.category2 === category ? `bg-blue-100 border-blue-300 text-blue-800` : `border-gray-300 text-gray-700 hover:bg-gray-50`}">
                              ${category}
                            </button>  
                          `,
                            )
                            .join("")}
                        </div>
                      </div>
                      <!-- 카테고리 있을 때 // -->
                    `
                    : ``
              }
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  ${limit.map((item) => {
                    return `<option value="${item.value}" ${String(currentLimit) === item.value ? `selected=""` : ""}>${item.name}개</option>`;
                  })}
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                             focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  ${sort.map((item) => {
                    return `<option value="${item.value}" ${filter.sort === item.value ? `selected=""` : ""}>${item.name}</option>`;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>`;
};
