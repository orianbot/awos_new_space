/**
 * S11｜商品資料結構化 (products.js)
 * ----------------------------------
 * 所有商品的結構化資料，供 startOrder() 和未來金流串接使用。
 * 圖片路徑、文案、價格皆以目前已確認的資訊為準。
 * 標示「null」的價格 = 尚待確認，前端顯示「洽詢報價」。
 */

const AWOS_PRODUCTS = {

  // ── 白玉螺肉 ──────────────────────────────────
  escargot_special: {
    id: 'escargot_special',
    category: 'escargot',
    name: '八桑安(蝸)牛',
    nameEn: 'Basangan Premium Escargot',
    grade: '特級',
    spec: '約 55 顆/斤・僅供餐廳等級採購',
    price: null,          // 洽詢報價
    priceDisplay: '洽詢報價',
    unit: '斤',
    shipping: 'frozen',   // frozen | room | booking
    image: 'assets/escargot-sample.png',
    orderType: 'inquiry',  // inquiry | direct | booking
  },

  escargot_premium: {
    id: 'escargot_premium',
    category: 'escargot',
    name: '頂級白玉螺肉',
    nameEn: 'Premium Escargot',
    grade: '頂級',
    spec: '約 70 顆/斤・真空冷凍包裝',
    price: { min: 600, max: 1650 },
    priceDisplay: 'NT$600 — 1,650',
    unit: '依規格',
    shipping: 'frozen',
    image: 'assets/escargot-detail.jpg',
    orderType: 'direct',
  },

  escargot_grade_a: {
    id: 'escargot_grade_a',
    category: 'escargot',
    name: 'A級白玉螺肉',
    nameEn: 'Grade A Escargot',
    grade: 'A級',
    spec: '約 90 顆/斤・真空冷凍包裝',
    price: { min: 800, max: 1850 },
    priceDisplay: 'NT$800 — 1,850',
    unit: '依規格',
    shipping: 'frozen',
    image: 'assets/escargot-detail.jpg',
    orderType: 'direct',
  },

  // ── 有機米 ────────────────────────────────────
  rice_large: {
    id: 'rice_large',
    category: 'rice',
    name: '長濱有機一等米',
    nameEn: 'Changbin Organic Rice (Box)',
    grade: '大包裝',
    spec: '高雄 139 品種・篩選率 55%',
    price: { min: 2100, max: 4000 },
    priceDisplay: 'NT$2,100 — 4,000',
    unit: '箱',
    shipping: 'room',
    image: 'assets/rice-2kg.png',
    orderType: 'direct',
  },

  rice_small: {
    id: 'rice_small',
    category: 'rice',
    name: '長濱有機一等米',
    nameEn: 'Changbin Organic Rice (Pack)',
    grade: '小包裝',
    spec: '高雄 139 品種・篩選率 55%・1 公斤',
    price: 200,
    priceDisplay: 'NT$200',
    unit: '包',
    shipping: 'room',
    image: 'assets/rice-1kg.png',
    orderType: 'direct',
  },

  // ── 美妝面膜 ──────────────────────────────────
  cosmetics_essence: {
    id: 'cosmetics_essence',
    category: 'cosmetics',
    name: '賦活精萃露',
    nameEn: 'White Jade Revitalizing Essence',
    spec: '白玉蝸牛萃取原液・35ml',
    price: 1380,
    priceOriginal: 1980,
    priceDisplay: 'NT$1,380',
    unit: '瓶',
    shipping: 'room',
    image: 'assets/essence.png',
    orderType: 'direct',
  },

  cosmetics_mask_firm: {
    id: 'cosmetics_mask_firm',
    category: 'cosmetics',
    name: '緊緻撫紋面膜',
    nameEn: 'Firming & Smoothing Mask',
    spec: '白玉蝸牛萃取原液',
    price: null,
    priceDisplay: '價格洽詢',
    unit: '盒',
    shipping: 'room',
    image: 'assets/cosmetics-2.jpg',
    orderType: 'inquiry',
  },

  cosmetics_mask_hydra: {
    id: 'cosmetics_mask_hydra',
    category: 'cosmetics',
    name: '保濕活顏面膜',
    nameEn: 'Hydrating & Brightening Mask',
    spec: '白玉蝸牛萃取原液',
    price: null,
    priceDisplay: '價格洽詢',
    unit: '盒',
    shipping: 'room',
    image: 'assets/cosmetics-1.jpg',
    orderType: 'inquiry',
  },

  // ── 即食調理 ──────────────────────────────────
  instant_korean: {
    id: 'instant_korean',
    category: 'instant',
    name: '韓式醬菇白玉螺調理包',
    nameEn: 'Korean Style Escargot Pack',
    spec: '200 克/包・可搭辣炒年糕、部隊鍋、韓式烤肉',
    price: 330,
    priceDisplay: 'NT$330',
    unit: '包',
    shipping: 'frozen',
    image: 'assets/baked-escargot.png',
    orderType: 'direct',
  },

  // ── 農場導覽體驗 ──────────────────────────────
  tour_adult: {
    id: 'tour_adult',
    category: 'tour',
    name: '農場導覽體驗（成人）',
    nameEn: 'Farm Tour — Adult',
    spec: '14:00-16:00・田間導覽・餵食體驗・下午茶・彩繪',
    price: 1280,
    priceDisplay: 'NT$1,280',
    unit: '人',
    shipping: 'booking',
    image: 'assets/tour.png',
    orderType: 'booking',
  },

  tour_child: {
    id: 'tour_child',
    category: 'tour',
    name: '農場導覽體驗（未滿18歲）',
    nameEn: 'Farm Tour — Under 18',
    spec: '14:00-16:00・田間導覽・餵食體驗・下午茶・彩繪',
    price: 980,
    priceDisplay: 'NT$980',
    unit: '人',
    shipping: 'booking',
    image: 'assets/tour.png',
    orderType: 'booking',
  },
};

// ── 分類定義 ────────────────────────────────────
const AWOS_CATEGORIES = {
  escargot: { id: 'escargot', name: '白玉螺肉', anchor: '#escargot' },
  rice:     { id: 'rice',     name: '有機米',   anchor: '#rice' },
  cosmetics:{ id: 'cosmetics',name: '美妝面膜', anchor: '#cosmetics' },
  instant:  { id: 'instant',  name: '即食調理', anchor: '#instant' },
  tour:     { id: 'tour',     name: '農場導覽', anchor: '#tour' },
};

// ── 工具函式 ────────────────────────────────────
/** 取得指定分類的所有商品 */
function getProductsByCategory(categoryId) {
  return Object.values(AWOS_PRODUCTS).filter(p => p.category === categoryId);
}

/** 取得單一商品 */
function getProduct(productId) {
  return AWOS_PRODUCTS[productId] || null;
}

// Export for module usage (if bundler is used later)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AWOS_PRODUCTS, AWOS_CATEGORIES, getProductsByCategory, getProduct };
}
