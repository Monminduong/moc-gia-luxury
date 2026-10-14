// Load and initialize products from localStorage or fallback to PRODUCTS_DATA
function initProductsDatabase() {
  const stored = localStorage.getItem('mocgia_products_db');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Lỗi đọc dữ liệu localStorage:", e);
    }
  }
  // Initialize with PRODUCTS_DATA
  localStorage.setItem('mocgia_products_db', JSON.stringify(PRODUCTS_DATA));
  return PRODUCTS_DATA;
}

// State Quản lý ứng dụng Mộc Gia Luxury
const state = {
  products: initProductsDatabase(),
  isAdmin: localStorage.getItem('mocgia_is_admin') === 'true',
  activeCategory: 'all',
  selectedWood: 'all',
  selectedPriceRange: 'all',
  selectedCondition: 'all', // 'all', 'new', 'used'
  searchQuery: '',
  sortBy: 'featured',
  cart: JSON.parse(localStorage.getItem('mocgia_cart') || '[]'),
  wishlist: new Set(JSON.parse(localStorage.getItem('mocgia_wishlist') || '[]')),
  appliedCoupon: null,
  discountRate: 0,
  quickViewProduct: null,
  selectedColor: null,
  selectedSize: null,
  editingProductId: null,
  adminCurrentTab: 'inventory'
};

// Hàm định dạng tiền tệ VND
function formatMoney(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', '₫');
}

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryTabs();
  renderProducts();
  updateCartBadge();
  updateWishlistBadge();
  renderWoodGuide();
  renderTestimonials();
  setupEventListeners();
  setupCostEstimator();
  updateAdminUI();

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
});

// Render danh mục phòng
function renderCategoryTabs() {
  const container = document.getElementById('category-tabs-container');
  if (!container) return;

  container.innerHTML = ROOM_CATEGORIES.map(cat => {
    const isActive = state.activeCategory === cat.id;
    // Count based on current product list
    const count = cat.id === 'all' 
      ? state.products.length 
      : state.products.filter(p => p.category === cat.id).length;

    return `
      <button 
        onclick="setCategory('${cat.id}')"
        class="tab-btn px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 flex items-center space-x-2 ${
          isActive 
            ? 'active bg-[#52362b] text-white border-[#52362b]' 
            : 'bg-white text-stone-700 border-stone-200 hover:border-[#52362b] hover:text-[#52362b]'
        }"
      >
        <span>${cat.name}</span>
        <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-amber-600/40 text-amber-100' : 'bg-stone-100 text-stone-500'}">
          ${count}
        </span>
      </button>
    `;
  }).join('');
}

// Thay đổi danh mục
function setCategory(catId) {
  state.activeCategory = catId;
  renderCategoryTabs();
  renderProducts();
}

// Thay đổi lọc Tình trạng hàng: Mới vs Cũ
function setConditionFilter(cond) {
  state.selectedCondition = cond;
  document.querySelectorAll('.condition-filter-btn').forEach(btn => {
    btn.classList.remove('bg-[#52362b]', 'text-white');
    btn.classList.add('bg-white', 'text-stone-700');
  });
  const activeBtn = document.getElementById(`cond-btn-${cond}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-stone-700');
    activeBtn.classList.add('bg-[#52362b]', 'text-white');
  }
  renderProducts();
}

// Lọc sản phẩm
function getFilteredProducts() {
  return state.products.filter(prod => {
    // Lọc theo phòng
    if (state.activeCategory !== 'all' && prod.category !== state.activeCategory) {
      return false;
    }
    // Lọc theo tình trạng hàng mới / hàng cũ
    if (state.selectedCondition !== 'all') {
      const isUsed = prod.condition === 'used';
      if (state.selectedCondition === 'used' && !isUsed) return false;
      if (state.selectedCondition === 'new' && isUsed) return false;
    }
    // Lọc theo chất liệu gỗ
    if (state.selectedWood !== 'all') {
      const match = (prod.woodType || '').toLowerCase().includes(state.selectedWood.toLowerCase()) || 
                    (prod.description || '').toLowerCase().includes(state.selectedWood.toLowerCase());
      if (!match) return false;
    }
    // Lọc theo khoảng giá
    if (state.selectedPriceRange === 'under5' && prod.price >= 5000000) return false;
    if (state.selectedPriceRange === '5to15' && (prod.price < 5000000 || prod.price > 15000000)) return false;
    if (state.selectedPriceRange === '15to25' && (prod.price < 15000000 || prod.price > 25000000)) return false;
    if (state.selectedPriceRange === 'above25' && prod.price <= 25000000) return false;

    // Tìm kiếm theo từ khóa
    if (state.searchQuery.trim() !== '') {
      const query = state.searchQuery.toLowerCase();
      const matchName = (prod.name || '').toLowerCase().includes(query);
      const matchWood = (prod.woodType || '').toLowerCase().includes(query);
      const matchCat = (prod.categoryName || '').toLowerCase().includes(query);
      const matchDesc = (prod.description || '').toLowerCase().includes(query);
      const matchSku = (prod.sku || '').toLowerCase().includes(query);
      if (!matchName && !matchWood && !matchCat && !matchDesc && !matchSku) return false;
    }

    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'price-asc') return a.price - b.price;
    if (state.sortBy === 'price-desc') return b.price - a.price;
    if (state.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    if (state.sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
    // Featured default
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });
}

// Render danh sách sản phẩm
function renderProducts() {
  const container = document.getElementById('products-grid');
  const countEl = document.getElementById('products-count');
  if (!container) return;

  const filtered = getFilteredProducts();
  if (countEl) {
    countEl.innerText = `Hiển thị ${filtered.length} sản phẩm tinh hoa (${state.products.length} trong kho)`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-[#aa843b]">
          <i data-lucide="package-search" class="w-8 h-8"></i>
        </div>
        <h3 class="text-xl font-serif text-stone-800 font-bold mb-2">Không tìm thấy sản phẩm phù hợp</h3>
        <p class="text-stone-500 max-w-md mx-auto mb-6 text-sm">Quý khách hãy thử đổi tiêu chí lọc hoặc từ khóa tìm kiếm, hoặc thêm sản phẩm mới nếu đang là Quản trị viên.</p>
        <div class="flex items-center justify-center gap-3">
          <button onclick="resetFilters()" class="px-5 py-2.5 bg-[#52362b] text-white rounded-lg text-sm font-medium hover:bg-[#3d271e] transition">
            Xóa toàn bộ bộ lọc
          </button>
          ${state.isAdmin ? `
            <button onclick="openProductModal()" class="px-5 py-2.5 bg-amber-500 text-stone-950 rounded-lg text-sm font-bold hover:bg-amber-400 transition">
              + Thêm Sản Phẩm Mới
            </button>
          ` : ''}
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(prod => {
    const isWished = state.wishlist.has(prod.id);
    const isUsed = prod.condition === 'used';

    return `
      <div class="product-card bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm flex flex-col justify-between group relative ${state.isAdmin ? 'ring-1 ring-amber-400/40' : ''}">
        
        <!-- Admin Floating Controls (When logged in) -->
        ${state.isAdmin ? `
          <div class="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-stone-950/90 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-amber-400/40">
            <button 
              onclick="openProductModal('${prod.id}')" 
              class="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 hover:bg-amber-300 flex items-center justify-center transition"
              title="Chỉnh sửa sản phẩm này"
            >
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            <button 
              onclick="toggleProductCondition('${prod.id}')" 
              class="w-7 h-7 rounded-lg bg-stone-800 text-amber-300 hover:bg-stone-700 flex items-center justify-center transition"
              title="Chuyển Hàng Mới ↔ Hàng Cũ Thanh Lý"
            >
              <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
            </button>
            <button 
              onclick="deleteProduct('${prod.id}')" 
              class="w-7 h-7 rounded-lg bg-red-600 text-white hover:bg-red-500 flex items-center justify-center transition"
              title="Xóa sản phẩm này"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        ` : ''}

        <div>
          <!-- Image Wrapper -->
          <div class="product-image-container relative bg-[#f7f5f0] aspect-[4/3] overflow-hidden">
            <img 
              src="${prod.image}" 
              alt="${prod.name}" 
              class="w-full h-full object-cover object-center"
              loading="lazy"
              onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'"
            />
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <!-- Condition Badge -->
              ${isUsed ? `
                <span class="badge-used text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm flex items-center">
                  <i data-lucide="tag" class="w-3 h-3 mr-1"></i> Thanh Lý (${prod.conditionPercent || 95}%)
                </span>
              ` : `
                <span class="badge-new text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm flex items-center">
                  <i data-lucide="sparkles" class="w-3 h-3 mr-1"></i> Mới 100%
                </span>
              `}

              ${prod.tag ? `
                <span class="badge-gold text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                  ${prod.tag}
                </span>
              ` : ''}

              ${prod.discountPercent > 0 ? `
                <span class="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm w-fit">
                  -${prod.discountPercent}%
                </span>
              ` : ''}
            </div>

            <!-- Customer Wishlist button (when not admin or placed lower) -->
            ${!state.isAdmin ? `
              <div class="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-90 group-hover:opacity-100 transition">
                <button 
                  onclick="toggleWishlist('${prod.id}')"
                  class="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-stone-700 hover:text-red-500 hover:scale-110 flex items-center justify-center shadow-md transition"
                  title="Thêm vào danh sách yêu thích"
                >
                  <i data-lucide="heart" class="w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}"></i>
                </button>
              </div>
            ` : ''}

            <!-- Hover Quick View Bar -->
            <div class="absolute inset-x-3 bottom-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <button 
                onclick="openQuickView('${prod.id}')"
                class="w-full py-2.5 bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold rounded-xl backdrop-blur flex items-center justify-center space-x-1.5 shadow-lg"
              >
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                <span>Xem Chi Tiết & Tùy Chọn Gỗ</span>
              </button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between text-xs text-stone-500 mb-1.5">
              <span class="font-medium text-[#aa843b]">${prod.categoryName || 'Nội thất'}</span>
              <span class="flex items-center text-amber-500 font-semibold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1"></i>
                ${prod.rating || 5.0} <span class="text-stone-400 ml-1">(${prod.reviewsCount || 10})</span>
              </span>
            </div>

            <h3 class="font-serif font-bold text-stone-900 text-base leading-snug line-clamp-2 hover:text-[#52362b] cursor-pointer mb-2" onclick="openQuickView('${prod.id}')">
              ${prod.name}
            </h3>

            <!-- Condition Note if Used -->
            ${isUsed && prod.conditionNote ? `
              <div class="text-[11px] text-amber-900 bg-amber-50/90 border border-amber-200/80 rounded-lg p-2 mb-2 line-clamp-2">
                <strong>Tình trạng:</strong> ${prod.conditionNote}
              </div>
            ` : ''}

            <!-- Wood Material Badge -->
            <div class="inline-flex items-center text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md mb-2">
              <i data-lucide="trees" class="w-3.5 h-3.5 mr-1.5 text-stone-500"></i>
              <span class="truncate max-w-[200px]">${prod.woodType}</span>
            </div>

            <!-- Dimensions Preview -->
            <p class="text-xs text-stone-500 mb-2 line-clamp-1 flex items-center">
              <i data-lucide="ruler" class="w-3.5 h-3.5 mr-1 text-stone-400"></i>
              ${prod.dimensions || 'Theo kích thước tiêu chuẩn'}
            </p>
          </div>
        </div>

        <!-- Price & CTA -->
        <div class="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
          <div class="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <div class="text-lg font-extrabold text-[#52362b]">
                ${formatMoney(prod.price)}
              </div>
              ${prod.originalPrice ? `
                <div class="text-xs text-stone-400 line-through">
                  ${formatMoney(prod.originalPrice)}
                </div>
              ` : ''}
            </div>

            <button 
              onclick="addToCart('${prod.id}', 1)"
              class="px-3.5 py-2.5 bg-[#52362b] hover:bg-[#3d271e] active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
              title="Thêm vào giỏ hàng"
            >
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span class="hidden sm:inline">Chọn Mua</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Reset filters
function resetFilters() {
  state.activeCategory = 'all';
  state.selectedWood = 'all';
  state.selectedPriceRange = 'all';
  state.selectedCondition = 'all';
  state.searchQuery = '';
  state.sortBy = 'featured';

  const woodSelect = document.getElementById('wood-filter-select');
  if (woodSelect) woodSelect.value = 'all';

  const priceSelect = document.getElementById('price-filter-select');
  if (priceSelect) priceSelect.value = 'all';

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  const searchInput = document.getElementById('header-search-input');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.condition-filter-btn').forEach(btn => {
    btn.classList.remove('bg-[#52362b]', 'text-white');
    btn.classList.add('bg-white', 'text-stone-700');
  });
  const allBtn = document.getElementById('cond-btn-all');
  if (allBtn) {
    allBtn.classList.add('bg-[#52362b]', 'text-white');
    allBtn.classList.remove('bg-white', 'text-stone-700');
  }

  renderCategoryTabs();
  renderProducts();
  showToast('Bộ lọc đã được đặt lại', 'Hiển thị toàn bộ danh mục sản phẩm.', 'info');
}

// Quick View Modal
function openQuickView(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.quickViewProduct = product;
  state.selectedColor = product.colors ? product.colors[0] : null;
  state.selectedSize = product.sizes ? product.sizes[0] : null;

  const modal = document.getElementById('quickview-modal');
  const content = document.getElementById('quickview-content');
  if (!modal || !content) return;

  const specsList = Object.entries(product.specs || {}).map(([key, val]) => `
    <li class="flex items-start text-xs py-1.5 border-b border-stone-100 last:border-none">
      <span class="w-36 text-stone-500 font-medium shrink-0">${key}:</span>
      <span class="text-stone-800 font-medium">${val}</span>
    </li>
  `).join('');

  const colorsHtml = (product.colors || []).map((col, idx) => `
    <button 
      onclick="selectColor('${col}', this)"
      class="color-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition ${idx === 0 ? 'border-[#52362b] bg-[#52362b] text-white' : 'border-stone-200 text-stone-700 hover:border-stone-400'}"
    >
      ${col}
    </button>
  `).join('');

  const sizesHtml = (product.sizes || []).map((sz, idx) => `
    <button 
      onclick="selectSize('${sz}', this)"
      class="size-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition ${idx === 0 ? 'border-[#52362b] bg-[#52362b] text-white' : 'border-stone-200 text-stone-700 hover:border-stone-400'}"
    >
      ${sz}
    </button>
  `).join('');

  const thumbnailsHtml = (product.gallery && product.gallery.length > 1) ? `
    <div class="flex gap-2 mt-3 overflow-x-auto pb-1">
      ${product.gallery.map((img, i) => `
        <img 
          src="${img}" 
          alt="thumb" 
          onclick="changeMainImage('${img}')"
          class="w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition ${i === 0 ? 'border-[#52362b]' : 'border-transparent hover:border-stone-300'}"
        />
      `).join('')}
    </div>
  ` : '';

  const isUsed = product.condition === 'used';

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 lg:p-8">
      <!-- Image Gallery -->
      <div>
        <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
          <img 
            id="modal-main-image"
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 left-3 flex flex-col gap-1">
            ${isUsed ? `
              <span class="badge-used text-[11px] font-bold px-3 py-1 rounded-md uppercase">
                Hàng Thanh Lý • ${product.conditionPercent || 95}%
              </span>
            ` : `
              <span class="badge-gold text-[11px] font-bold px-3 py-1 rounded-md uppercase">
                ${product.tag || 'Mới 100%'}
              </span>
            `}
          </div>
        </div>
        ${thumbnailsHtml}

        <!-- Tình trạng chi tiết nếu là hàng cũ -->
        ${isUsed ? `
          <div class="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-950">
            <h5 class="font-bold flex items-center mb-1 text-orange-800">
              <i data-lucide="alert-circle" class="w-4 h-4 mr-1.5 text-orange-600"></i>
              Ghi Chú Hàng Trưng Bày / Thanh Lý (Độ mới ${product.conditionPercent || 95}%)
            </h5>
            <p class="leading-relaxed text-stone-700">${product.conditionNote || 'Sản phẩm đã qua kiểm định nghiêm ngặt của xưởng mộc, không ảnh hưởng đến độ bền kết cấu.'}</p>
          </div>
        ` : `
          <!-- Cam kết chất lượng gỗ mới -->
          <div class="mt-4 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-stone-700 flex items-start space-x-2.5">
            <i data-lucide="shield-check" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
            <div>
              <p class="font-semibold text-stone-900">Cam Kết Chất Lượng Mộc Gia (Hàng Mới 100%)</p>
              <p class="text-stone-600 mt-0.5">Gỗ tự nhiên chuẩn xuất khẩu FAS, tẩm sấy công nghệ cao chống cong vênh nứt nẻ. Bảo hành chính hãng 5 năm.</p>
            </div>
          </div>
        `}
      </div>

      <!-- Specs & Action -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span class="font-semibold text-[#aa843b] uppercase tracking-wider">${product.categoryName || 'Nội thất'}</span>
            <span>Mã SKU: <strong class="text-stone-700">${product.sku || 'MG-001'}</strong></span>
          </div>

          <h2 class="text-xl lg:text-2xl font-serif font-bold text-stone-900 leading-tight mb-2">
            ${product.name}
          </h2>

          <div class="flex items-center space-x-3 mb-4">
            <div class="flex items-center text-amber-500 text-xs font-bold">
              <i data-lucide="star" class="w-4 h-4 fill-amber-400 mr-1"></i>
              ${product.rating || 5.0} / 5.0
            </div>
            <span class="text-stone-300">|</span>
            <span class="text-xs text-stone-500">${product.reviewsCount || 10} khách hàng đánh giá</span>
            <span class="text-stone-300">|</span>
            <span class="text-xs ${product.inStock !== false ? 'text-emerald-600' : 'text-red-500'} font-semibold flex items-center">
              <i data-lucide="${product.inStock !== false ? 'check' : 'x'}" class="w-3.5 h-3.5 mr-0.5"></i> 
              ${product.inStock !== false ? 'Còn hàng trong kho' : 'Tạm hết hàng'}
            </span>
          </div>

          <!-- Price Display -->
          <div class="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60 mb-5 flex items-baseline space-x-3">
            <span class="text-2xl lg:text-3xl font-extrabold text-[#52362b]">
              ${formatMoney(product.price)}
            </span>
            ${product.originalPrice ? `
              <span class="text-sm text-stone-400 line-through">
                ${formatMoney(product.originalPrice)}
              </span>
              <span class="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                Tiết kiệm ${formatMoney(product.originalPrice - product.price)}
              </span>
            ` : ''}
          </div>

          <p class="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
            ${product.description}
          </p>

          <!-- Tùy chọn Màu Sắc -->
          ${product.colors ? `
            <div class="mb-4">
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Tông Màu Hoàn Thiện:
              </label>
              <div class="flex flex-wrap gap-2">
                ${colorsHtml}
              </div>
            </div>
          ` : ''}

          <!-- Tùy chọn Kích Thước -->
          ${product.sizes ? `
            <div class="mb-4">
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Kích Thước Tiêu Chuẩn:
              </label>
              <div class="flex flex-wrap gap-2">
                ${sizesHtml}
              </div>
            </div>
          ` : ''}

          <!-- Thông số kỹ thuật -->
          <div class="mb-5 bg-white rounded-xl border border-stone-200 p-3.5">
            <div class="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center">
              <i data-lucide="sliders" class="w-3.5 h-3.5 mr-1.5 text-stone-500"></i>
              Thông Số Kỹ Thuật Chi Tiết
            </div>
            <ul class="divide-y divide-stone-100">
              ${specsList}
            </ul>
          </div>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
          <div class="flex items-center border border-stone-300 rounded-xl bg-stone-50 h-12 shrink-0">
            <button 
              onclick="adjustModalQty(-1)" 
              class="w-10 h-full flex items-center justify-center text-stone-600 hover:text-stone-900 text-base font-bold"
            >-</button>
            <input 
              id="modal-qty-input" 
              type="number" 
              value="1" 
              min="1" 
              class="w-12 text-center bg-transparent text-stone-900 font-bold text-sm focus:outline-none"
              readonly
            />
            <button 
              onclick="adjustModalQty(1)" 
              class="w-10 h-full flex items-center justify-center text-stone-600 hover:text-stone-900 text-base font-bold"
            >+</button>
          </div>

          <button 
            onclick="addModalToCart()"
            class="flex-1 h-12 bg-[#52362b] hover:bg-[#3d271e] text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition"
          >
            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
            <span>Thêm Vào Giỏ Hàng</span>
          </button>

          ${state.isAdmin ? `
            <button 
              onclick="closeQuickView(); openProductModal('${product.id}')"
              class="h-12 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition"
            >
              <i data-lucide="pencil" class="w-4 h-4"></i>
              <span>Sửa Admin</span>
            </button>
          ` : `
            <button 
              onclick="openCustomDesignModal('${product.name}')"
              class="h-12 px-4 border border-[#52362b] text-[#52362b] hover:bg-[#52362b]/5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
              title="Tùy chỉnh theo diện tích phòng của bạn"
            >
              <i data-lucide="compass" class="w-4 h-4"></i>
              <span>May Đo Riêng</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function changeMainImage(src) {
  const mainImg = document.getElementById('modal-main-image');
  if (mainImg) mainImg.src = src;
}

function selectColor(color, btn) {
  state.selectedColor = color;
  document.querySelectorAll('.color-btn').forEach(b => {
    b.className = 'color-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition border-stone-200 text-stone-700 hover:border-stone-400';
  });
  btn.className = 'color-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition border-[#52362b] bg-[#52362b] text-white';
}

function selectSize(size, btn) {
  state.selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => {
    b.className = 'size-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition border-stone-200 text-stone-700 hover:border-stone-400';
  });
  btn.className = 'size-btn px-3 py-1.5 rounded-lg border text-xs font-medium transition border-[#52362b] bg-[#52362b] text-white';
}

function adjustModalQty(delta) {
  const input = document.getElementById('modal-qty-input');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
}

function addModalToCart() {
  if (!state.quickViewProduct) return;
  const input = document.getElementById('modal-qty-input');
  const qty = input ? parseInt(input.value) || 1 : 1;
  addToCart(state.quickViewProduct.id, qty, state.selectedColor, state.selectedSize);
  closeQuickView();
}

// ==========================================
// ADMIN SYSTEM (THÊM, SỬA, XÓA, QUẢN LÝ KHO)
// ==========================================

function updateAdminUI() {
  const topBar = document.getElementById('admin-top-bar');
  const adminBtnText = document.getElementById('admin-nav-btn-text');
  
  if (topBar) {
    topBar.classList.toggle('hidden', !state.isAdmin);
  }
  if (adminBtnText) {
    adminBtnText.innerText = state.isAdmin ? 'Admin (Bật)' : 'Đăng Nhập Admin';
  }
}

function openAdminLoginModal() {
  if (state.isAdmin) {
    openAdminDashboard();
    return;
  }
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeAdminLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function handleAdminLogin(event) {
  if (event) event.preventDefault();
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');

  const username = usernameInput ? usernameInput.value.trim() : 'admin';
  const password = passwordInput ? passwordInput.value.trim() : 'admin123';

  // Demo credential validation (admin / admin123 or any test fill)
  if (username === 'admin' && (password === 'admin123' || password === '123' || password === 'admin')) {
    state.isAdmin = true;
    localStorage.setItem('mocgia_is_admin', 'true');
    closeAdminLoginModal();
    updateAdminUI();
    renderProducts();
    showToast('Đăng Nhập Thành Công', 'Chào mừng Quản trị viên Mộc Gia Luxury! Các nút Sửa/Xóa đã sẵn sàng.', 'success');
  } else {
    showToast('Sai thông tin', 'Tài khoản thử nghiệm: admin / mật khẩu: admin123', 'warning');
  }
}

function quickAdminLogin() {
  state.isAdmin = true;
  localStorage.setItem('mocgia_is_admin', 'true');
  closeAdminLoginModal();
  updateAdminUI();
  renderProducts();
  showToast('Đã Bật Quyền Quản Trị Viên', 'Bạn có toàn quyền thêm, sửa, xóa hàng mới và hàng cũ thanh lý.', 'success');
}

function logoutAdmin() {
  state.isAdmin = false;
  localStorage.removeItem('mocgia_is_admin');
  updateAdminUI();
  renderProducts();
  showToast('Đã Đăng Xuất Admin', 'Bạn đã quay trở lại giao diện xem của khách hàng.', 'info');
}

// Bảng Quản Trị Toàn Diện (Dashboard Modal)
function openAdminDashboard(initialTab = 'inventory') {
  const modal = document.getElementById('admin-dashboard-modal');
  if (!modal) return;
  state.adminCurrentTab = initialTab;
  switchAdminTab(initialTab);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeAdminDashboard() {
  const modal = document.getElementById('admin-dashboard-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function switchAdminTab(tabName) {
  state.adminCurrentTab = tabName;
  ['inventory', 'orders', 'analytics'].forEach(t => {
    const tabBtn = document.getElementById(`admin-tab-btn-${t}`);
    const tabPane = document.getElementById(`admin-tab-pane-${t}`);
    if (tabBtn) {
      if (t === tabName) {
        tabBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-[#52362b] text-white transition';
      } else {
        tabBtn.className = 'px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition';
      }
    }
    if (tabPane) {
      tabPane.classList.toggle('hidden', t !== tabName);
    }
  });

  if (tabName === 'inventory') renderAdminInventoryTable();
  if (tabName === 'orders') renderAdminOrdersTable();
  if (tabName === 'analytics') renderAdminAnalytics();
  if (window.lucide) lucide.createIcons();
}

// Render Bảng Quản Lý Sản Phẩm trong Admin Dashboard
function renderAdminInventoryTable() {
  const tbody = document.getElementById('admin-inventory-tbody');
  const searchInput = document.getElementById('admin-table-search');
  const condSelect = document.getElementById('admin-table-cond-filter');
  if (!tbody) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const condFilter = condSelect ? condSelect.value : 'all';

  const list = state.products.filter(p => {
    if (condFilter !== 'all') {
      const isUsed = p.condition === 'used';
      if (condFilter === 'used' && !isUsed) return false;
      if (condFilter === 'new' && isUsed) return false;
    }
    if (query) {
      const match = (p.name || '').toLowerCase().includes(query) ||
                    (p.sku || '').toLowerCase().includes(query) ||
                    (p.woodType || '').toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-10 text-center text-stone-400 text-xs">
          Không tìm thấy sản phẩm nào trong kho.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map((p, idx) => {
    const isUsed = p.condition === 'used';
    return `
      <tr class="border-b border-stone-100 hover:bg-stone-50/80 transition text-xs">
        <td class="p-3 text-stone-400 font-mono text-[11px]">${idx + 1}</td>
        <td class="p-3">
          <div class="flex items-center space-x-3">
            <img src="${p.image}" alt="${p.name}" class="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'" />
            <div>
              <span class="font-bold text-stone-900 block leading-snug">${p.name}</span>
              <span class="text-[10px] text-stone-500 font-mono">SKU: ${p.sku || 'MG-001'}</span>
            </div>
          </div>
        </td>
        <td class="p-3">
          ${isUsed ? `
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-700 border border-orange-300">
              🏷️ Cũ / Thanh Lý (${p.conditionPercent || 95}%)
            </span>
          ` : `
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✨ Mới 100%
            </span>
          `}
        </td>
        <td class="p-3 text-stone-600">
          <span class="font-medium text-stone-800 block">${p.categoryName || 'Nội thất'}</span>
          <span class="text-[10px] text-stone-500 truncate max-w-[140px] block">${p.woodType}</span>
        </td>
        <td class="p-3 font-extrabold text-[#52362b] whitespace-nowrap">
          ${formatMoney(p.price)}
          ${p.originalPrice ? `<span class="block text-[10px] text-stone-400 line-through font-normal">${formatMoney(p.originalPrice)}</span>` : ''}
        </td>
        <td class="p-3">
          <button 
            onclick="toggleStockStatus('${p.id}')"
            class="px-2.5 py-1 rounded-full text-[10px] font-bold transition ${p.inStock !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}"
          >
            ${p.inStock !== false ? 'Còn hàng' : 'Hết hàng'}
          </button>
        </td>
        <td class="p-3 text-right whitespace-nowrap">
          <div class="flex items-center justify-end space-x-1.5">
            <button 
              onclick="openProductModal('${p.id}')" 
              class="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 transition"
              title="Chỉnh sửa sản phẩm"
            >
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            <button 
              onclick="toggleProductCondition('${p.id}')" 
              class="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
              title="Đổi Mới ↔ Cũ"
            >
              <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
            </button>
            <button 
              onclick="deleteProduct('${p.id}')" 
              class="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-600 transition"
              title="Xóa sản phẩm"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Render Đơn hàng trong Admin
function renderAdminOrdersTable() {
  const container = document.getElementById('admin-orders-container');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('mocgia_orders') || '[]');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-stone-400">
        <i data-lucide="clipboard-list" class="w-10 h-10 mx-auto mb-2 text-stone-300"></i>
        <p class="text-sm font-serif font-bold text-stone-700">Chưa có đơn hàng nào</p>
        <p class="text-xs text-stone-400 mt-1">Khi khách hàng đặt hàng qua giỏ hàng trên web, đơn sẽ tự động hiển thị tại đây.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-stone-100 text-stone-600 font-bold border-b border-stone-200">
          <tr>
            <th class="p-3">Mã Đơn</th>
            <th class="p-3">Khách Hàng</th>
            <th class="p-3">Số Điện Thoại</th>
            <th class="p-3">Địa Chỉ Giao</th>
            <th class="p-3">Tổng Tiền</th>
            <th class="p-3">Thanh Toán</th>
            <th class="p-3">Thời Gian</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          ${orders.map(ord => `
            <tr class="hover:bg-stone-50">
              <td class="p-3 font-mono font-bold text-amber-700">${ord.code}</td>
              <td class="p-3 font-bold text-stone-900">${ord.name}</td>
              <td class="p-3 font-mono">${ord.phone}</td>
              <td class="p-3 max-w-[180px] truncate" title="${ord.address}">${ord.address}</td>
              <td class="p-3 font-extrabold text-[#52362b]">${formatMoney(ord.total)}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 uppercase">
                  ${ord.paymentMethod || 'COD'}
                </span>
              </td>
              <td class="p-3 text-[11px] text-stone-400">${ord.date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// Render Thống Kê Nhanh Admin
function renderAdminAnalytics() {
  const container = document.getElementById('admin-analytics-container');
  if (!container) return;

  const totalProducts = state.products.length;
  const newProducts = state.products.filter(p => p.condition !== 'used').length;
  const usedProducts = state.products.filter(p => p.condition === 'used').length;
  const totalStockValue = state.products.reduce((sum, p) => sum + (p.price || 0), 0);
  const orders = JSON.parse(localStorage.getItem('mocgia_orders') || '[]');
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs font-semibold text-stone-500 block mb-1">Tổng Sản Phẩm Trong Kho</span>
        <div class="text-2xl font-black text-stone-900">${totalProducts}</div>
        <span class="text-[11px] text-emerald-600 font-medium">Đang kinh doanh hoạt động</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs font-semibold text-stone-500 block mb-1">Hàng Mới 100% Xuất Xưởng</span>
        <div class="text-2xl font-black text-emerald-600">${newProducts}</div>
        <span class="text-[11px] text-stone-400">Bảo hành 5-10 năm</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs font-semibold text-stone-500 block mb-1">Hàng Cũ / Thanh Lý Outlet</span>
        <div class="text-2xl font-black text-orange-600">${usedProducts}</div>
        <span class="text-[11px] text-stone-400">Độ mới 90-99%</span>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <span class="text-xs font-semibold text-stone-500 block mb-1">Tổng Giá Trị Kho Hàng</span>
        <div class="text-xl font-black text-[#52362b] truncate">${formatMoney(totalStockValue)}</div>
        <span class="text-[11px] text-stone-400">Tính theo giá bán niêm yết</span>
      </div>
    </div>

    <div class="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h4 class="font-serif font-bold text-stone-900 text-base mb-1">Doanh Số Bán Hàng Qua Web (Demo)</h4>
        <p class="text-xs text-stone-600">Đã ghi nhận <strong>${orders.length} đơn hàng</strong> thành công từ hệ thống checkout trực tuyến.</p>
      </div>
      <div class="text-right">
        <span class="text-xs text-stone-500 block">Tổng doanh thu demo:</span>
        <span class="text-2xl font-black text-[#aa843b]">${formatMoney(totalRevenue)}</span>
      </div>
    </div>
  `;
}

// Modal Thêm / Chỉnh Sửa Sản Phẩm
function openProductModal(productId = null) {
  state.editingProductId = productId;
  const modal = document.getElementById('admin-product-modal');
  const titleEl = document.getElementById('product-modal-title');
  const form = document.getElementById('admin-product-form');
  if (!modal || !form) return;

  if (productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    if (titleEl) titleEl.innerText = `Chỉnh Sửa Sản Phẩm: ${prod.name}`;

    form.elements['name'].value = prod.name || '';
    form.elements['sku'].value = prod.sku || '';
    form.elements['category'].value = prod.category || 'livingroom';
    form.elements['woodType'].value = prod.woodType || '';
    form.elements['price'].value = prod.price || '';
    form.elements['originalPrice'].value = prod.originalPrice || '';
    form.elements['dimensions'].value = prod.dimensions || '';
    form.elements['warranty'].value = prod.warranty || '';
    form.elements['image'].value = prod.image || '';
    form.elements['tag'].value = prod.tag || '';
    form.elements['description'].value = prod.description || '';
    
    // Condition
    const isUsed = prod.condition === 'used';
    form.elements['condition'].value = isUsed ? 'used' : 'new';
    toggleConditionInputs(isUsed);

    if (form.elements['conditionPercent']) {
      form.elements['conditionPercent'].value = prod.conditionPercent || 95;
    }
    if (form.elements['conditionNote']) {
      form.elements['conditionNote'].value = prod.conditionNote || '';
    }

    form.elements['inStock'].checked = prod.inStock !== false;
    form.elements['isFeatured'].checked = !!prod.isFeatured;

  } else {
    if (titleEl) titleEl.innerText = 'Thêm Sản Phẩm Mới (Hàng Mới / Hàng Cũ)';
    form.reset();
    form.elements['sku'].value = 'MG-' + Math.floor(100 + Math.random() * 900);
    form.elements['condition'].value = 'new';
    toggleConditionInputs(false);
    form.elements['inStock'].checked = true;
    form.elements['isFeatured'].checked = false;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeProductModal() {
  const modal = document.getElementById('admin-product-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function toggleConditionInputs(isUsed) {
  const box = document.getElementById('used-condition-extra-box');
  if (box) {
    box.classList.toggle('hidden', !isUsed);
  }
}

// Lưu Sản Phẩm (Thêm hoặc Sửa)
function handleSaveProduct(event) {
  event.preventDefault();
  const form = document.getElementById('admin-product-form');
  if (!form) return;

  const name = form.elements['name'].value.trim();
  const sku = form.elements['sku'].value.trim() || ('MG-' + Date.now().toString().slice(-4));
  const category = form.elements['category'].value;
  const woodType = form.elements['woodType'].value.trim() || 'Gỗ Tự Nhiên';
  const price = parseInt(form.elements['price'].value) || 0;
  const originalPrice = parseInt(form.elements['originalPrice'].value) || Math.round(price * 1.2);
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const dimensions = form.elements['dimensions'].value.trim() || 'Theo kích thước tiêu chuẩn';
  const warranty = form.elements['warranty'].value.trim() || '5 năm chính hãng';
  const image = form.elements['image'].value.trim() || './assets/products/tu-ke-trang-tri-walnut.jpg';
  const tag = form.elements['tag'].value.trim() || '';
  const description = form.elements['description'].value.trim() || 'Sản phẩm nội thất chế tác tỉ mỉ từ gỗ tự nhiên tuyển chọn.';
  const condition = form.elements['condition'].value; // 'new' | 'used'
  const isUsed = condition === 'used';
  const conditionPercent = isUsed ? (parseInt(form.elements['conditionPercent']?.value) || 95) : 100;
  const conditionNote = isUsed ? (form.elements['conditionNote']?.value.trim() || 'Hàng trưng bày showroom like new') : '';
  const inStock = form.elements['inStock'].checked;
  const isFeatured = form.elements['isFeatured'].checked;

  const categoryNames = {
    'livingroom': 'Phòng Khách',
    'bedroom': 'Phòng Ngủ',
    'dining': 'Phòng Ăn & Bếp',
    'office': 'Phòng Làm Việc'
  };
  const categoryName = categoryNames[category] || 'Nội thất';

  if (state.editingProductId) {
    // Cập nhật sản phẩm cũ
    const index = state.products.findIndex(p => p.id === state.editingProductId);
    if (index > -1) {
      state.products[index] = {
        ...state.products[index],
        name,
        sku,
        category,
        categoryName,
        woodType,
        price,
        originalPrice,
        discountPercent,
        dimensions,
        warranty,
        image,
        tag: tag || (isUsed ? `Thanh Lý (${conditionPercent}%)` : 'Hàng Mới'),
        description,
        condition,
        conditionPercent,
        conditionNote,
        inStock,
        isFeatured
      };
      showToast('Đã Cập Nhật Sản Phẩm', `Sản phẩm "${name}" đã được cập nhật thành công.`, 'success');
    }
  } else {
    // Thêm sản phẩm mới
    const newProduct = {
      id: 'prod-' + Date.now(),
      name,
      sku,
      category,
      categoryName,
      woodType,
      price,
      originalPrice,
      discountPercent,
      rating: 5.0,
      reviewsCount: 1,
      dimensions,
      warranty,
      image,
      gallery: [image],
      tag: tag || (isUsed ? `Thanh Lý (${conditionPercent}%)` : 'Mẫu Mới 2026'),
      description,
      specs: {
        "Chất liệu": woodType,
        "Kích thước": dimensions,
        "Tình trạng": isUsed ? `Hàng cũ / trưng bày (${conditionPercent}%)` : 'Hàng mới 100% xuất xưởng',
        "Bảo hành": warranty
      },
      colors: ["Tự Nhiên Chuẩn", "Nâu Óc Chó", "Sồi Sáng"],
      sizes: [dimensions],
      condition,
      conditionPercent,
      conditionNote,
      inStock,
      isFeatured
    };

    state.products.unshift(newProduct);
    showToast('Đã Thêm Sản Phẩm Mới', `"${name}" (${isUsed ? 'Hàng cũ thanh lý' : 'Hàng mới 100%'}) đã được thêm vào kho!`, 'success');
  }

  saveProductsDatabase();
  closeProductModal();
  renderCategoryTabs();
  renderProducts();

  if (state.adminCurrentTab) {
    switchAdminTab(state.adminCurrentTab);
  }
}

// Xóa Sản Phẩm
function deleteProduct(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa sản phẩm:\n"${prod.name}" (SKU: ${prod.sku || ''})?\n\nThao tác này sẽ gỡ sản phẩm khỏi trang web ngay lập tức.`);
  if (!confirmDelete) return;

  state.products = state.products.filter(p => p.id !== productId);
  saveProductsDatabase();
  renderCategoryTabs();
  renderProducts();

  if (document.getElementById('admin-dashboard-modal') && !document.getElementById('admin-dashboard-modal').classList.contains('hidden')) {
    switchAdminTab(state.adminCurrentTab);
  }

  showToast('Đã Xóa Sản Phẩm', `Đã xóa sản phẩm "${prod.name}" khỏi hệ thống.`, 'info');
}

// Đổi nhanh tình trạng Hàng Mới ↔ Hàng Cũ
function toggleProductCondition(productId) {
  const index = state.products.findIndex(p => p.id === productId);
  if (index === -1) return;

  const current = state.products[index].condition || 'new';
  if (current === 'new') {
    state.products[index].condition = 'used';
    state.products[index].conditionPercent = 95;
    state.products[index].conditionNote = 'Hàng mẫu trưng bày showroom like new 95%';
    state.products[index].tag = 'Thanh Lý Showroom';
    showToast('Chuyển Thành Hàng Cũ/Thanh Lý', `"${state.products[index].name}" hiện đã là hàng thanh lý.`, 'warning');
  } else {
    state.products[index].condition = 'new';
    state.products[index].conditionPercent = 100;
    state.products[index].conditionNote = '';
    state.products[index].tag = 'Mới 100%';
    showToast('Chuyển Thành Hàng Mới', `"${state.products[index].name}" hiện là hàng mới 100%.`, 'success');
  }

  saveProductsDatabase();
  renderProducts();
  if (document.getElementById('admin-dashboard-modal') && !document.getElementById('admin-dashboard-modal').classList.contains('hidden')) {
    switchAdminTab(state.adminCurrentTab);
  }
}

// Đổi nhanh trạng thái còn hàng / hết hàng
function toggleStockStatus(productId) {
  const index = state.products.findIndex(p => p.id === productId);
  if (index === -1) return;

  state.products[index].inStock = !(state.products[index].inStock !== false);
  saveProductsDatabase();
  renderProducts();
  if (state.adminCurrentTab === 'inventory') {
    renderAdminInventoryTable();
  }
  showToast('Cập Nhật Trạng Thái Kho', `Sản phẩm hiện: ${state.products[index].inStock ? 'Còn hàng' : 'Hết hàng'}`, 'info');
}

// Khôi phục dữ liệu mẫu ban đầu
function resetProductsToDefault() {
  const confirmReset = confirm("Bạn có chắc chắn muốn khôi phục toàn bộ danh sách sản phẩm về dữ liệu ban đầu của Mộc Gia?\n(Mọi chỉnh sửa thử nghiệm sẽ được làm mới).");
  if (!confirmReset) return;

  state.products = [...PRODUCTS_DATA];
  saveProductsDatabase();
  renderCategoryTabs();
  renderProducts();
  if (document.getElementById('admin-dashboard-modal') && !document.getElementById('admin-dashboard-modal').classList.contains('hidden')) {
    switchAdminTab(state.adminCurrentTab);
  }
  showToast('Khôi Phục Thành Công', 'Toàn bộ 18 sản phẩm mẫu đã được nạp lại đầy đủ.', 'success');
}

function saveProductsDatabase() {
  localStorage.setItem('mocgia_products_db', JSON.stringify(state.products));
}

// Chọn nhanh ảnh mẫu trong Modal Thêm/Sửa
function selectSampleImage(url) {
  const input = document.getElementById('admin-input-image');
  if (input) {
    input.value = url;
    showToast('Đã chọn ảnh mẫu', 'Đường dẫn ảnh đã được điền vào form.', 'info');
  }
}

// ==========================================
// SHOPPING CART & CHECKOUT
// ==========================================

function addToCart(productId, qty = 1, color = null, size = null) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  const itemColor = color || (prod.colors ? prod.colors[0] : 'Tiêu chuẩn');
  const itemSize = size || (prod.sizes ? prod.sizes[0] : 'Tiêu chuẩn');

  const existingIndex = state.cart.findIndex(
    item => item.id === productId && item.color === itemColor && item.size === itemSize
  );

  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += qty;
  } else {
    state.cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      woodType: prod.woodType,
      condition: prod.condition || 'new',
      color: itemColor,
      size: itemSize,
      quantity: qty
    });
  }

  saveCart();
  updateCartBadge();
  showToast(
    'Đã thêm vào giỏ hàng!',
    `"${prod.name}" (SL: ${qty}) đã có trong giỏ của bạn.`,
    'success'
  );

  openCartDrawer();
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function updateCartQuantity(index, delta) {
  if (!state.cart[index]) return;
  state.cart[index].quantity += delta;
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  localStorage.setItem('mocgia_cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.innerText = totalItems;
    badge.classList.toggle('hidden', totalItems === 0);
  }
}

// Wishlist
function toggleWishlist(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  if (state.wishlist.has(productId)) {
    state.wishlist.delete(productId);
    showToast('Đã bỏ yêu thích', `Đã xóa "${prod.name}" khỏi mục yêu thích.`, 'info');
  } else {
    state.wishlist.add(productId);
    showToast('Đã lưu yêu thích', `Đã thêm "${prod.name}" vào danh sách yêu thích.`, 'success');
  }

  localStorage.setItem('mocgia_wishlist', JSON.stringify(Array.from(state.wishlist)));
  updateWishlistBadge();
  renderProducts();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  if (badge) {
    badge.innerText = state.wishlist.size;
    badge.classList.toggle('hidden', state.wishlist.size === 0);
  }
}

// Cart Drawer UI
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('translate-x-full');
    document.getElementById('cart-backdrop').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.add('translate-x-full');
    document.getElementById('cart-backdrop').classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountEl = document.getElementById('cart-discount');
  const finalTotalEl = document.getElementById('cart-final-total');
  const freeShipBar = document.getElementById('cart-freeship-progress');
  const freeShipText = document.getElementById('cart-freeship-text');

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <p class="font-serif font-bold text-stone-800 text-base mb-1">Giỏ hàng của bạn đang trống</p>
        <p class="text-xs text-stone-500 mb-6">Hãy khám phá bộ sưu tập nội thất gỗ cao cấp của Mộc Gia.</p>
        <button onclick="closeCartDrawer()" class="px-5 py-2 bg-[#52362b] text-white text-xs font-semibold rounded-lg hover:bg-[#3d271e]">
          Tiếp tục mua sắm
        </button>
      </div>
    `;
    if (subtotalEl) subtotalEl.innerText = '0 ₫';
    if (discountEl) discountEl.innerText = '0 ₫';
    if (finalTotalEl) finalTotalEl.innerText = '0 ₫';
    if (freeShipBar) freeShipBar.style.width = '0%';
    if (window.lucide) lucide.createIcons();
    return;
  }

  const rawSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = state.discountRate > 0 ? Math.round(rawSubtotal * state.discountRate) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // Free shipping threshold: 15,000,000 VND
  const freeShipThreshold = 15000000;
  const freeShipPercent = Math.min(100, Math.round((rawSubtotal / freeShipThreshold) * 100));

  if (freeShipBar) freeShipBar.style.width = `${freeShipPercent}%`;
  if (freeShipText) {
    if (rawSubtotal >= freeShipThreshold || state.appliedCoupon === 'FREESHIP') {
      freeShipText.innerHTML = `<span class="text-emerald-600 font-bold flex items-center"><i data-lucide="check-circle" class="w-3.5 h-3.5 mr-1"></i> Quý khách được MIỄN PHÍ VẬN CHUYỂN toàn quốc!</span>`;
    } else {
      const remaining = freeShipThreshold - rawSubtotal;
      freeShipText.innerText = `Mua thêm ${formatMoney(remaining)} để nhận MIỄN PHÍ VẬN CHUYỂN!`;
    }
  }

  container.innerHTML = state.cart.map((item, index) => `
    <div class="flex gap-3 py-3.5 border-b border-stone-100 last:border-none">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'" />
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <h4 class="font-serif font-bold text-xs sm:text-sm text-stone-900 leading-snug line-clamp-1">${item.name}</h4>
            <button onclick="removeFromCart(${index})" class="text-stone-400 hover:text-red-500 transition p-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
          <div class="text-[11px] text-stone-500 mt-0.5">
            ${item.condition === 'used' ? '<span class="text-orange-600 font-bold">[Thanh lý]</span> • ' : ''}
            ${item.color ? `<span>Màu: ${item.color}</span> • ` : ''}
            <span>${item.size}</span>
          </div>
        </div>

        <div class="flex items-center justify-between mt-2">
          <span class="text-xs font-extrabold text-[#52362b]">${formatMoney(item.price)}</span>
          <div class="flex items-center border border-stone-200 rounded-lg bg-stone-50 h-7 text-xs">
            <button onclick="updateCartQuantity(${index}, -1)" class="w-6 h-full flex items-center justify-center hover:bg-stone-200 text-stone-700 font-bold">-</button>
            <span class="w-7 text-center font-bold text-stone-800">${item.quantity}</span>
            <button onclick="updateCartQuantity(${index}, 1)" class="w-6 h-full flex items-center justify-center hover:bg-stone-200 text-stone-700 font-bold">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.innerText = formatMoney(rawSubtotal);
  if (discountEl) discountEl.innerText = `-${formatMoney(discountAmount)}`;
  if (finalTotalEl) finalTotalEl.innerText = formatMoney(finalTotal);

  if (window.lucide) lucide.createIcons();
}

// Coupon Voucher
function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'MOCGIA10') {
    state.appliedCoupon = 'MOCGIA10';
    state.discountRate = 0.10;
    showToast('Áp dụng thành công!', 'Voucher MOCGIA10 giảm 10% tổng hóa đơn.', 'success');
  } else if (code === 'FREESHIP') {
    state.appliedCoupon = 'FREESHIP';
    showToast('Áp dụng thành công!', 'Miễn phí vận chuyển toàn quốc cho đơn hàng.', 'success');
  } else {
    showToast('Mã không hợp lệ', 'Vui lòng thử mã "MOCGIA10" hoặc "FREESHIP".', 'warning');
    return;
  }
  renderCartDrawer();
}

// Checkout Modal
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Giỏ hàng trống', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.', 'warning');
    return;
  }
  closeCartDrawer();

  const modal = document.getElementById('checkout-modal');
  const summaryContainer = document.getElementById('checkout-summary-items');
  const totalAmountEl = document.getElementById('checkout-total-amount');

  if (!modal) return;

  const rawSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = state.discountRate > 0 ? Math.round(rawSubtotal * state.discountRate) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  if (summaryContainer) {
    summaryContainer.innerHTML = state.cart.map(item => `
      <div class="flex items-center justify-between text-xs py-2 border-b border-stone-100 last:border-none">
        <div class="flex items-center space-x-2">
          <span class="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-[10px]">${item.quantity}</span>
          <span class="font-medium text-stone-800 line-clamp-1 max-w-[180px]">${item.name}</span>
        </div>
        <span class="font-semibold text-stone-900">${formatMoney(item.price * item.quantity)}</span>
      </div>
    `).join('');
  }

  if (totalAmountEl) {
    totalAmountEl.innerText = formatMoney(finalTotal);
  }

  // Generate dynamic QR VietQR code
  const qrImage = document.getElementById('vietqr-image');
  if (qrImage) {
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=247Napas|MOCGIALUXURY|0988776655|${finalTotal}|DonHangNoiThat`;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function handlePaymentMethodChange(method) {
  const qrBox = document.getElementById('vietqr-box');
  const installmentBox = document.getElementById('installment-box');
  if (qrBox) qrBox.classList.toggle('hidden', method !== 'bank');
  if (installmentBox) installmentBox.classList.toggle('hidden', method !== 'installment');
}

function submitOrder(event) {
  event.preventDefault();
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const customerName = form.elements['name']?.value || 'Quý khách';
  const customerPhone = form.elements['phone']?.value || '';
  const customerAddress = form.elements['address']?.value || '';
  const paymentMethod = form.elements['paymentMethod']?.value || 'COD';
  const randomOrderCode = 'MG-' + Math.floor(100000 + Math.random() * 900000);

  const rawSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = state.discountRate > 0 ? Math.round(rawSubtotal * state.discountRate) : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // Save order to localStorage for Admin visibility
  const existingOrders = JSON.parse(localStorage.getItem('mocgia_orders') || '[]');
  const newOrder = {
    code: randomOrderCode,
    name: customerName,
    phone: customerPhone,
    address: customerAddress,
    total: finalTotal,
    paymentMethod,
    items: [...state.cart],
    date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  };
  existingOrders.unshift(newOrder);
  localStorage.setItem('mocgia_orders', JSON.stringify(existingOrders));

  // Clear cart
  state.cart = [];
  saveCart();
  updateCartBadge();
  closeCheckoutModal();

  // Show Success Modal
  const successModal = document.getElementById('order-success-modal');
  if (successModal) {
    document.getElementById('success-order-code').innerText = randomOrderCode;
    document.getElementById('success-customer-name').innerText = customerName;
    document.getElementById('success-customer-phone').innerText = customerPhone;
    document.getElementById('success-customer-address').innerText = customerAddress;
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  showToast('Đặt hàng thành công!', `Mã đơn hàng: ${randomOrderCode}. Nhân viên sẽ gọi xác nhận trong 15 phút.`, 'success');
}

function closeSuccessModal() {
  const successModal = document.getElementById('order-success-modal');
  if (successModal) successModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Báo Giá May Đo Riêng Modal
function openCustomDesignModal(productTitle = '') {
  const modal = document.getElementById('custom-design-modal');
  const titleInput = document.getElementById('custom-product-name');
  if (titleInput && productTitle) {
    titleInput.value = productTitle;
  }
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCustomDesignModal() {
  const modal = document.getElementById('custom-design-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function submitCustomDesign(event) {
  event.preventDefault();
  closeCustomDesignModal();
  showToast(
    'Đã tiếp nhận yêu cầu may đo!',
    'Kiến trúc sư của Mộc Gia sẽ liên hệ lại qua Zalo/Điện thoại để gửi bản vẽ 3D miễn phí.',
    'success'
  );
}

// Cost Estimator Calculator
function setupCostEstimator() {
  const form = document.getElementById('estimator-form');
  if (!form) return;

  form.addEventListener('input', calculateEstimate);
  calculateEstimate();
}

function calculateEstimate() {
  const areaType = document.querySelector('input[name="est-type"]:checked')?.value || 'apartment2';
  const woodQuality = document.querySelector('input[name="est-wood"]:checked')?.value || 'oak';

  let basePrice = 45000000;
  if (areaType === 'apartment1') basePrice = 35000000;
  if (areaType === 'apartment2') basePrice = 65000000;
  if (areaType === 'apartment3') basePrice = 95000000;
  if (areaType === 'townhouse') basePrice = 140000000;
  if (areaType === 'villa') basePrice = 280000000;

  let woodMultiplier = 1.0;
  if (woodQuality === 'mdf') woodMultiplier = 0.85;
  if (woodQuality === 'oak') woodMultiplier = 1.0;
  if (woodQuality === 'ash') woodMultiplier = 1.15;
  if (woodQuality === 'walnut') woodMultiplier = 1.75;

  const roomCheckboxes = document.querySelectorAll('input[name="est-rooms"]:checked');
  let roomFactor = 0;
  roomCheckboxes.forEach(cb => {
    roomFactor += parseFloat(cb.dataset.weight || 0.25);
  });
  if (roomFactor === 0) roomFactor = 0.5;

  const estimatedTotal = Math.round(basePrice * woodMultiplier * roomFactor);
  const minRange = Math.round(estimatedTotal * 0.95);
  const maxRange = Math.round(estimatedTotal * 1.15);

  const resultEl = document.getElementById('estimate-result-range');
  if (resultEl) {
    resultEl.innerText = `${formatMoney(minRange)} – ${formatMoney(maxRange)}`;
  }
}

// Wood Guide Data Render
function renderWoodGuide() {
  const container = document.getElementById('wood-guide-cards');
  if (!container) return;

  container.innerHTML = WOOD_GUIDE.map(item => `
    <div class="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:border-[#aa843b] transition duration-300">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-serif font-bold text-base text-stone-900">${item.name}</h4>
        <span class="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
          ${item.grade}
        </span>
      </div>
      <p class="text-xs text-stone-500 mb-2 font-medium">Xuất xứ: <strong class="text-stone-700">${item.origin}</strong></p>
      <p class="text-xs text-stone-600 mb-3 leading-relaxed">${item.features}</p>
      <div class="pt-3 border-t border-stone-100 text-xs text-stone-500">
        <strong class="text-stone-800">Ứng dụng khuyên dùng:</strong> ${item.usage}
      </div>
    </div>
  `).join('');
}

// Testimonials Render
function renderTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map(t => `
    <div class="bg-white rounded-2xl p-6 border border-stone-200/70 shadow-sm flex flex-col justify-between">
      <div>
        <div class="flex items-center space-x-1 text-amber-400 mb-3">
          ${Array(t.rating).fill('<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>').join('')}
        </div>
        <p class="text-stone-700 text-sm leading-relaxed mb-4 italic">
          "${t.comment}"
        </p>
      </div>

      <div class="pt-4 border-t border-stone-100 flex items-center space-x-3">
        <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover border border-stone-200" />
        <div>
          <h5 class="text-xs font-bold text-stone-900">${t.name}</h5>
          <p class="text-[11px] text-stone-500">${t.role}</p>
          <span class="text-[10px] text-[#aa843b] font-medium block mt-0.5">Đã mua: ${t.purchased}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Toast Notifications
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item bg-stone-900 text-white rounded-xl px-4 py-3 shadow-2xl flex items-start space-x-3 border border-stone-700 max-w-sm mb-3';

  let iconName = 'info';
  let iconColor = 'text-amber-400';
  if (type === 'success') { iconName = 'check-circle'; iconColor = 'text-emerald-400'; }
  if (type === 'warning') { iconName = 'alert-triangle'; iconColor = 'text-yellow-400'; }

  toast.innerHTML = `
    <div class="${iconColor} shrink-0 mt-0.5">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <h5 class="text-xs font-bold text-white">${title}</h5>
      <p class="text-[11px] text-stone-300 mt-0.5">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-stone-400 hover:text-white">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Setup Event Listeners
function setupEventListeners() {
  const woodFilter = document.getElementById('wood-filter-select');
  if (woodFilter) {
    woodFilter.addEventListener('change', (e) => {
      state.selectedWood = e.target.value;
      renderProducts();
    });
  }

  const priceFilter = document.getElementById('price-filter-select');
  if (priceFilter) {
    priceFilter.addEventListener('change', (e) => {
      state.selectedPriceRange = e.target.value;
      renderProducts();
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  const searchInput = document.getElementById('header-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Admin table search
  const adminSearch = document.getElementById('admin-table-search');
  if (adminSearch) {
    adminSearch.addEventListener('input', () => {
      renderAdminInventoryTable();
    });
  }
  const adminCondFilter = document.getElementById('admin-table-cond-filter');
  if (adminCondFilter) {
    adminCondFilter.addEventListener('change', () => {
      renderAdminInventoryTable();
    });
  }
}
