(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e){if(t.type!==`childList`)continue;for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();const e=`modulepreload`,t=function(e){return`/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=function(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))},s=document.getElementsByTagName(`link`),c=document.querySelector(`meta[property=csp-nonce]`),l=c?.nonce||c?.getAttribute(`nonce`);o=r(i.map(r=>{if(r=t(r,a),r in n)return;n[r]=!0;let i=r.endsWith(`.css`),o=i?`[rel="stylesheet"]`:``,c=!!a;if(c)for(let e=s.length-1;e>=0;e--){let t=s[e];if(t.href===r&&(!i||t.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${r}"]${o}`))return;let u=document.createElement(`link`);if(u.rel=i?`stylesheet`:e,i||(u.as=`script`),u.crossOrigin=``,u.href=r,l&&u.setAttribute(`nonce`,l),document.head.appendChild(u),i)return new Promise((e,t)=>{u.addEventListener(`load`,e),u.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[]){if(t.status!==`rejected`)continue;s(t.reason)}return r().catch(s)})};async function i(e={}){let{limit:t=20,search:n=``,category1:r=``,category2:i=``,sort:a=`price_asc`}=e,o=e.current??e.page??1,s=new URLSearchParams({page:o.toString(),limit:t.toString(),...n&&{search:n},...r&&{category1:r},...i&&{category2:i},sort:a}),c=await fetch(`/api/products?${s}`);return await c.json()}async function a(e){let t=await fetch(`/api/products/${e}`);return await t.json()}async function o(){let e=await fetch(`/api/categories`);return await e.json()}const s=()=>`
            <!-- 상품 목록 -->
        <div class="mb-6">
            <div>
                <!-- 상품 그리드 -->
                <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                <!-- 로딩 스켈레톤 -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div class="aspect-square bg-gray-200"></div>
                    <div class="p-3">
                    <div class="h-4 bg-gray-200 rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div class="h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div class="aspect-square bg-gray-200"></div>
                    <div class="p-3">
                    <div class="h-4 bg-gray-200 rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div class="h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div class="aspect-square bg-gray-200"></div>
                    <div class="p-3">
                    <div class="h-4 bg-gray-200 rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div class="h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div class="aspect-square bg-gray-200"></div>
                    <div class="p-3">
                    <div class="h-4 bg-gray-200 rounded mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div class="h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
                </div>
                
                <div class="text-center py-4">
                    <div class="inline-flex items-center">
                        <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
                    </div>
                </div>
            </div>
        </div>`,c=({title:e,image:t,lprice:n,productId:r,brand:i})=>` <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
    data-product-id="${r}"
  >
    <!-- 상품 이미지 -->
    <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
      <img
        src="${t}"
        alt="${e}"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        loading="lazy"
      />
    </div>
    <!-- 상품 정보 -->
    <div class="p-3">
      <div class="cursor-pointer product-info mb-3">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">${e.trim()}</h3>
        <p class="text-xs text-gray-500 mb-2">${i}</p>
        <p class="text-lg font-bold text-gray-900">${Number(n).toLocaleString(`en-US`)}원</p>
      </div>
      <!-- 장바구니 버튼 -->
      <button
        class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
        hover:bg-blue-700 transition-colors add-to-cart-btn"
        data-product-id="${r}"
      >
        장바구니 담기
      </button>
    </div>
  </div>`,l=(e,t)=>`
    <!-- 상품 목록 -->
    <div class="mb-6">
      <div>
        <!-- 상품 개수 정보 -->
        <div class="mb-4 text-sm text-gray-600">
          총 <span class="font-medium text-gray-900">${t}개</span>의 상품
        </div>
        <!-- 상품 그리드 -->
        <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
          ${e.map(e=>c(e)).join(``)}
        </div>
      </div>
    </div>
  `,u=e=>` <button
    data-category1="${e}"
    class="category1-filter-btn text-left px-3 py-2 text-sm rounded-md border transition-colors
    bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
  >
    ${e}
  </button>`,d=({pagination:e={},products:t=[],category:n={},filters:r={},isLoading:i=!1})=>{let a=Object.keys(n),o=e?.limit??20,c=r?.sort??`price_asc`;return`
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900">
              <a href="/" data-link="">쇼핑몰</a>
            </h1>
            <div class="flex items-center space-x-2">
              <!-- 장바구니 아이콘 -->
              <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"
                  ></path>
                  <span>${localStorage.getItem(`cart`)?localStorage.getItem(`cart`).split(`,`).length:``}</span>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main class="max-w-md mx-auto px-4 py-4">
        <!-- 검색 및 필터 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <!-- 검색창 -->
          <div class="mb-4">
            <div class="relative">
              <input
                type="text"
                id="search-input"
                placeholder="상품명을 검색해보세요..."
                value="${r?.search??``}"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <!-- 필터 옵션 -->
          <div class="space-y-3">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">카테고리:</label>
                <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
              </div>
              <!-- 1depth 카테고리 -->
              <div class="flex flex-wrap gap-2">
                ${a.length>0?`${a.map(e=>u(e)).join(``)}`:`<div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>`}
              </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
              <!-- 페이지당 상품 수 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">개수:</label>
                <select
                  id="limit-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  ${[10,20,50,100].map(e=>`<option value="${e}" ${e===o?`selected=""`:``}>${e}개</option>`)}
                </select>
              </div>
              <!-- 정렬 -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select
                  id="sort-select"
                  class="text-sm border border-gray-300 rounded px-2 py-1
                            focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  ${[{value:`price_asc`,name:`가격 낮은순`},{value:`price_desc`,name:`가격 높은순`},{value:`name_asc`,name:`이름순`},{value:`name_desc`,name:`이름 역순`}].map(({value:e,name:t})=>`<option value="${e}" ${e===c?`selected=""`:``}>${t}</option>`)}
                </select>
              </div>
            </div>
          </div>

        ${!i&&t&&e.total?l(t,e.total,i):s()}

      </main>
      <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
          <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
      </footer>
    </div>
  `};let f={products:[],pagination:{},filters:{},category:{},isLoading:!1};const p=async()=>{let e=new URLSearchParams(window.location.search),t=e.get(`limit`),n=e.get(`sort`),r=e.get(`search`),a={...t?{limit:t}:{},...n?{sort:n}:{},...r?{search:r}:{}};document.body.querySelector(`#root`).innerHTML=d({});let[s,c]=await Promise.all([i({...a}),o()]);s&&(f.pagination=s.pagination,f.filters=s.filters,f.products=s.products),c&&(f.category=c),document.body.querySelector(`#root`).innerHTML=d(f),y()},m=async function(e,t){e.preventDefault(),f.isLoading=!0,document.body.querySelector(`#root`).innerHTML=d({...f,products:[],isLoading:!0});let n=e.target.value,[r,a]=t===`limit`?[`sort`,f.filters.sort]:[`limit`,f.pagination.limit],o=new URLSearchParams(window.location.search);o.set(t,n),o.set(r,a),history.pushState(null,``,`${window.location.pathname}?${o.toString()}`);let s=await i({[t]:t===`limit`?Number(n):n,[r]:a,search:f.filters.search,category1:f.filters.category1,category2:f.filters.category2});s&&(f.pagination=s.pagination,f.filters=s.filters,f.products=s.products),f.isLoading=!1,document.body.querySelector(`#root`).innerHTML=d(f)},h=async function(e){e.preventDefault();let t=e.target.value;f.filters.search=t},g=function(){document.body.querySelector(`#root`).innerHTML=d(f)},_=async function(e){if(e.key!==`Enter`)return;e.preventDefault();let t=new URLSearchParams(window.location.search);t.set(`search`,f.filters.search),history.pushState(null,``,`${window.location.pathname}?${t.toString()}`),f.isLoading=!1;let n=await i({sort:f.filters.sort,limit:f.pagination.limit,search:f.filters.search,page:f.filters.page});n&&(f.pagination=n.pagination,f.filters=n.filters,f.products=n.products),document.body.querySelector(`#root`).innerHTML=d(f)};document.addEventListener(`change`,e=>{e.target.matches(`#limit-select`)&&m(e,`limit`),e.target.matches(`#sort-select`)&&m(e,`sort`),e.target.matches(`#search-input`)&&g(e)}),document.addEventListener(`input`,e=>{e.target.matches(`#search-input`)&&h(e)}),document.addEventListener(`keydown`,e=>{e.target.matches(`#search-input`)&&_(e)}),document.addEventListener(`click`,e=>{e.target.matches(`.add-to-cart-btn`)&&v(e)});const v=e=>{let t=e.target.closest(`.product-card`),n=t.dataset.productId;if(localStorage.getItem(`cart`)===null)localStorage.setItem(`cart`,String(n)),document.body.querySelector(`#root`).innerHTML=d(f);else{let e=localStorage.getItem(`cart`);if(e.split(`,`).includes(n))alert(`이미 카트에 담겨 있습니다.`);else{let t=`${e},${n}`;localStorage.setItem(`cart`,String(t)),document.body.querySelector(`#root`).innerHTML=d(f)}}};function y(){let e=document.querySelectorAll(`.product-card`);e.forEach(e=>{e.onclick=t=>{if(t.target.closest(`.add-to-cart-btn`))return;let n=e.dataset.productId;history.pushState({},``,`/product/${n}`),j()}})}let b=window.scrollY;window.addEventListener(`scroll`,async()=>{let[,e]=location.pathname.split(`/`);if(e===``){let e=window.scrollY;if(e>b){let t=document.documentElement.scrollHeight,n=e+window.innerHeight;if(!f.isLoading&&f.pagination.hasNext&&n+200>=t){f.isLoading=!0,document.body.querySelector(`#root`).innerHTML=d({...f});let e=await i({sort:f.filters.sort,limit:f.pagination.limit,search:f.filters.search,category1:f.filters.category1,category2:f.filters.category2,page:f.pagination.page+1});e&&(f.pagination=e.pagination,f.filters=e.filters,f.products=[...f.products,...e.products]),f.isLoading=!1,document.body.querySelector(`#root`).innerHTML=d(f)}}else e<b&&(f.isLoading&&=!1);b=e}},{passive:!0}),document.addEventListener(`DOMContentLoaded`,()=>{f={products:[],pagination:{},filters:{},category:{},isLoading:!1}});const x=()=>`
<main class="max-w-md mx-auto px-4 py-4">
  <div class="text-center my-4 py-20 shadow-md p-6 bg-white rounded-lg">
  <svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
      </linearGradient>
      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#000000" flood-opacity="0.1"/>
      </filter>
    </defs>
    
    <!-- 404 Numbers -->
    <text x="160" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="48" font-weight="600" fill="url(#blueGradient)" text-anchor="middle">404</text>
    
    <!-- Icon decoration -->
    <circle cx="80" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
    <circle cx="240" cy="60" r="3" fill="#e8f0fe" opacity="0.8"/>
    <circle cx="90" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
    <circle cx="230" cy="45" r="2" fill="#4285f4" opacity="0.5"/>
    
    <!-- Message -->
    <text x="160" y="110" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" fill="#5f6368" text-anchor="middle">페이지를 찾을 수 없습니다</text>
    
    <!-- Subtle bottom accent -->
    <rect x="130" y="130" width="60" height="2" rx="1" fill="url(#blueGradient)" opacity="0.3"/>
  </svg>
  
  <a href="/" data-link class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">홈으로</a>
</div>
</main>
`,S=({title:e,image:t,lprice:n,description:r,reviewCount:i,rating:a,stock:o,category1:s,category2:c},l,u)=>(console.log(l),`
            <!-- 브레드크럼 -->
        <nav class="mb-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category1=${s}>
            ${s}
          </button>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <button class="breadcrumb-link" data-category2=${c}>
          ${c}
          </button>
        </div>
      </nav>
      <!-- 상품 상세 정보 -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <!-- 상품 이미지 -->
        <div class="p-4">
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src=${t} alt=${e} class="w-full h-full object-cover product-detail-image">
          </div>
          <!-- 상품 정보 -->
          <div>
            <p class="text-sm text-gray-600 mb-1"></p>
            <h1 class="text-xl font-bold text-gray-900 mb-3">${e.trim()}</h1>
            <!-- 평점 및 리뷰 -->
            <div class="flex items-center mb-3">
              <div class="flex items-center">
              ${[1,2,3,4,5].map(e=>`<svg class="w-4 h-4 ${e<=a?`text-yellow-400`:`text-gray-400`}" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>`).join(``)}
              </div>
              <span class="ml-2 text-sm text-gray-600">${a}.0 (${i}개 리뷰)</span>
            </div>
            <!-- 가격 -->
            <div class="mb-4">
              <span class="text-2xl font-bold text-blue-600">${Number(n).toLocaleString(`en-US`)}원</span>
            </div>
            <!-- 재고 -->
            <div class="text-sm text-gray-600 mb-4">
              재고 ${o}개
            </div>
            <!-- 설명 -->
            <div class="text-sm text-gray-700 leading-relaxed mb-6">
              ${r}
            </div>
          </div>
        </div>
        <!-- 수량 선택 및 액션 -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-gray-900">수량</span>
            <div class="flex items-center">
              <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                 rounded-l-md bg-gray-50 hover:bg-gray-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <input type="number" id="quantity-input" value=${u} min="1" max="107" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                 rounded-r-md bg-gray-50 hover:bg-gray-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
          <!-- 액션 버튼 -->
          <button id="add-to-cart-btn" data-product-id="85067212996" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
               hover:bg-blue-700 transition-colors font-medium">
            장바구니 담기
          </button>
        </div>
      </div>
      <!-- 상품 목록으로 이동 -->
      <div class="mb-6">
        <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
          hover:bg-gray-200 transition-colors go-to-product-list">
          상품 목록으로 돌아가기
        </button>
      </div>
      <!-- 관련 상품 -->
      ${l&&`      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
          <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-3 responsive-grid">${l.map(({image:e,title:t,lprice:n,productId:r})=>`<div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id=${r}>
                <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
                  <img src=${e} alt=${t} class="w-full h-full object-cover" loading="lazy">
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${t}</h3>
                <p class="text-sm font-bold text-blue-600">${Number(n).toLocaleString(`en-US`)}원</p>
              </div>`).join(``)}
          </div>
        </div>
      </div>`}

  
    `),C=({projectDetail:e,loading:t,otherProducts:n,count:r})=>`
<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-md mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button onclick="window.history.back()" class="p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-900">상품 상세</h1>
        </div>
        <div class="flex items-center space-x-2">
          <!-- 장바구니 아이콘 -->
          <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
            </svg>
            <span>${localStorage.getItem(`cart`)?localStorage.getItem(`cart`).split(`,`).length:``}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  <main class="max-w-md mx-auto px-4 py-4">
    ${t?`<div class="py-20 bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
    </div>`:S(e,n,r)}

    </main>

  <footer class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-md mx-auto py-8 text-center text-gray-500">
      <p>© 2025 항해플러스 프론트엔드 쇼핑몰</p>
    </div>
  </footer>
</div>
`;let w={loading:!1,projectDetail:{},otherProducts:[],count:1};const T=async()=>{let[,e,t]=location.pathname.split(`/`);if(console.log(e),t){w.loading=!0,document.body.querySelector(`#root`).innerHTML=C(w);let e=await a(t),n=e.category1,r=await i({category1:n}),o=r.products.filter(({productId:e})=>e!==t);w.loading=!1,w.projectDetail=e,w.otherProducts=o,document.body.querySelector(`#root`).innerHTML=C(w)}else return x()};function E(){w.count+=1,document.body.querySelector(`#root`).innerHTML=C(w)}function D(){--w.count,document.body.querySelector(`#root`).innerHTML=C(w)}document.addEventListener(`click`,e=>{e.target.closest(`#quantity-increase`)&&E(e),e.target.closest(`#quantity-decrease`)&&D(e)});const O=document.querySelector(`#root`);O.addEventListener(`click`,e=>{let t=e.target.closest(`.related-product-card`);if(!t)return;e.preventDefault();let n=t.dataset.productId;history.pushState({},``,`/product/${n}`),window.dispatchEvent(new PopStateEvent(`popstate`))});const k=`/front_6th_chapter1-1/`,A=()=>r(async()=>{let{worker:e}=await import(`./browser-CcyfQrG1.js`);return{worker:e}},[]).then(({worker:e})=>e.start({onUnhandledRequest:`bypass`,url:`${location.origin}${k}mockServiceWorker.js`}));window.addEventListener(`popstate`,j),window.addEventListener(`hashchange`,j);function j(){let[,e,t]=location.pathname.replace(`/front_6th_chapter1-1`,``).split(`/`);if(e===`product`&&t)return console.log(`project detail page`),T(t);if(console.log(e),!e)return p();document.body.querySelector(`#root`).innerHTML=x()}A().then(j);