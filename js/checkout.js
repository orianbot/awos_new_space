/**
 * S11｜下單流程前端佔位 (checkout.js)
 * ------------------------------------
 * startOrder() 函式 + 訂單面板 UI。
 * Phase 1：走「聯絡方式下單」流程（電話/信箱/LINE）。
 * Phase 2：接金流後，依 CHECKOUT_CONFIG.activeChannel 切換到線上付款。
 *
 * 依賴：products.js、checkout-config.js（需先載入）
 */

(function () {
  'use strict';

  // ── 訂單狀態 ──
  const orderState = {
    product: null,
    quantity: 1,
    note: '',
    panelEl: null,
  };

  // ── 生成訂單編號 ──
  function generateOrderId() {
    const prefix = CHECKOUT_CONFIG.order.orderIdPrefix;
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${ts}-${rand}`;
  }

  // ── 建立訂單面板 DOM ──
  function createOrderPanel() {
    if (orderState.panelEl) return orderState.panelEl;

    const panel = document.createElement('div');
    panel.id = 'order-panel';
    panel.className = 'order-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', '訂購面板');
    panel.innerHTML = `
      <div class="order-panel__backdrop"></div>
      <div class="order-panel__card">
        <button class="order-panel__close" aria-label="關閉">&times;</button>
        <div class="order-panel__body">
          <div class="order-panel__product">
            <img class="order-panel__img" src="" alt="">
            <div class="order-panel__info">
              <h3 class="order-panel__name"></h3>
              <p class="order-panel__spec"></p>
              <p class="order-panel__price"></p>
            </div>
          </div>

          <div class="order-panel__channel" id="order-channel">
            <!-- Phase 1: 聯絡方式下單 -->
            <div class="order-panel__contact-section">
              <p class="order-panel__channel-title">選擇下單方式</p>
              <div class="order-panel__contact-buttons">
                <a id="order-phone" href="" class="order-btn order-btn--phone">
                  📞 電話訂購
                </a>
                <a id="order-email" href="" class="order-btn order-btn--email">
                  ✉ 信箱訂購
                </a>
                <a id="order-ig" href="" class="order-btn order-btn--ig" target="_blank" rel="noopener">
                  📷 IG 私訊
                </a>
                <a id="order-fb" href="" class="order-btn order-btn--fb" target="_blank" rel="noopener">
                  💬 FB 私訊
                </a>
              </div>
            </div>

            <!-- Phase 2: 線上付款（未啟用時隱藏） -->
            <div class="order-panel__pay-section" id="order-pay-section" style="display:none;">
              <button id="order-pay-btn" class="order-btn order-btn--pay">
                前往付款
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    orderState.panelEl = panel;

    // 事件綁定
    panel.querySelector('.order-panel__close').addEventListener('click', closeOrderPanel);
    panel.querySelector('.order-panel__backdrop').addEventListener('click', closeOrderPanel);

    // ESC 關閉
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        closeOrderPanel();
      }
    });

    return panel;
  }

  // ── 組裝訊息文字（電話/信箱/社群用）──
  function buildOrderMessage(product) {
    const lines = [
      `【AWOS 農場訂購】`,
      `商品：${product.name}${product.grade ? ` (${product.grade})` : ''}`,
      `規格：${product.spec}`,
      `價格：${product.priceDisplay}`,
      ``,
      `姓名：`,
      `電話：`,
      `數量：`,
      product.shipping === 'booking' ? `希望日期：` : `配送地址：`,
      `備註：`,
    ];
    return lines.join('\n');
  }

  // ── 填入面板內容 ──
  function populatePanel(product) {
    const panel = orderState.panelEl;
    const contact = CHECKOUT_CONFIG.contact;

    panel.querySelector('.order-panel__img').src = product.image;
    panel.querySelector('.order-panel__img').alt = product.name;
    panel.querySelector('.order-panel__name').textContent =
      product.name + (product.grade ? ` (${product.grade})` : '');
    panel.querySelector('.order-panel__spec').textContent = product.spec;
    panel.querySelector('.order-panel__price').textContent = product.priceDisplay;

    // 電話
    const msg = buildOrderMessage(product);
    panel.querySelector('#order-phone').href = `tel:${contact.phone.replace(/-/g, '')}`;
    // 信箱
    const subject = encodeURIComponent(`AWOS訂購 — ${product.name}`);
    const body = encodeURIComponent(msg);
    panel.querySelector('#order-email').href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    // IG
    panel.querySelector('#order-ig').href = contact.instagram;
    // FB
    panel.querySelector('#order-fb').href = contact.facebook;

    // Phase 2: 線上付款按鈕
    const paySection = panel.querySelector('#order-pay-section');
    const activeChannel = CHECKOUT_CONFIG.activeChannel;
    if (activeChannel !== 'contact' && CHECKOUT_CONFIG[activeChannel]?.enabled) {
      paySection.style.display = 'block';
      panel.querySelector('#order-pay-btn').onclick = () => processPayment(product);
    } else {
      paySection.style.display = 'none';
    }
  }

  // ── Phase 2: 線上付款流程（佔位）──
  function processPayment(product) {
    const channel = CHECKOUT_CONFIG.activeChannel;
    const orderId = generateOrderId();

    console.log(`[AWOS Checkout] 準備付款`, {
      orderId,
      channel,
      product: product.id,
      price: product.price,
    });

    // TODO: 依 channel 呼叫對應的後端 API
    // 例如 ECPay：POST 到後端產生交易表單，再 redirect
    // 例如 LINE Pay：POST 到後端取得 paymentUrl，再 redirect

    alert(
      `⚠️ 線上付款功能尚未啟用\n\n` +
      `訂單編號：${orderId}\n` +
      `金流管道：${channel}\n` +
      `商品：${product.name}\n` +
      `金額：${product.priceDisplay}\n\n` +
      `請先使用電話或信箱訂購。`
    );
  }

  // ── 開啟面板 ──
  function openOrderPanel(product) {
    const panel = createOrderPanel();
    orderState.product = product;
    populatePanel(product);
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ── 關閉面板 ──
  function closeOrderPanel() {
    if (orderState.panelEl) {
      orderState.panelEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ══════════════════════════════════════════════
  //  startOrder() — 公開 API
  // ══════════════════════════════════════════════
  /**
   * 觸發下單流程。
   * @param {string} productId — 對應 AWOS_PRODUCTS 的 key
   *
   * 使用方式：
   *   <button onclick="startOrder('escargot_premium')">立即訂購</button>
   *
   * 或在 JS 中：
   *   startOrder('tour_adult');
   */
  window.startOrder = function (productId) {
    const product = getProduct(productId);
    if (!product) {
      console.error(`[AWOS Checkout] 找不到商品: ${productId}`);
      return;
    }

    // inquiry 類型（洽詢報價）直接跳到聯絡方式
    if (product.orderType === 'inquiry') {
      openOrderPanel(product);
      return;
    }

    // direct / booking 類型
    openOrderPanel(product);
  };

  // ══════════════════════════════════════════════
  //  注入面板樣式
  // ══════════════════════════════════════════════
  const style = document.createElement('style');
  style.textContent = `
    /* ── 訂單面板 ── */
    .order-panel {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease-out;
    }
    .order-panel.open {
      pointer-events: auto;
      opacity: 1;
    }
    .order-panel__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(46, 42, 36, 0.5);
    }
    .order-panel__card {
      position: relative;
      background: var(--bg-main, #F7F4EE);
      border-radius: 16px 16px 0 0;
      width: 100%;
      max-width: 480px;
      max-height: 85vh;
      overflow-y: auto;
      transform: translateY(100%);
      transition: transform 0.3s ease-out;
      box-shadow: 0 -4px 24px rgba(46, 42, 36, 0.12);
    }
    .order-panel.open .order-panel__card {
      transform: translateY(0);
    }
    @media (min-width: 769px) {
      .order-panel {
        align-items: center;
      }
      .order-panel__card {
        border-radius: 12px;
        max-width: 420px;
        transform: translateY(20px) scale(0.97);
      }
      .order-panel.open .order-panel__card {
        transform: translateY(0) scale(1);
      }
    }
    .order-panel__close {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      border: none;
      font-size: 1.6rem;
      color: var(--text-light, #7A7570);
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      transition: color 0.15s;
    }
    .order-panel__close:hover {
      color: var(--text-main, #2E2A24);
    }
    .order-panel__body {
      padding: 28px 24px 32px;
    }
    .order-panel__product {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-light, #DDD8CF);
    }
    .order-panel__img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
      background: #E6E0D6;
    }
    .order-panel__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .order-panel__name {
      font-family: var(--font-heading, 'Noto Serif TC', serif);
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-main, #2E2A24);
      margin: 0;
    }
    .order-panel__spec {
      font-size: 0.85rem;
      color: var(--text-light, #7A7570);
      margin: 0;
    }
    .order-panel__price {
      font-family: var(--font-heading, 'Noto Serif TC', serif);
      font-size: 1.15rem;
      font-weight: 500;
      color: var(--color-primary, #4A5A3F);
      margin: 4px 0 0;
    }
    .order-panel__channel-title {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-main, #2E2A24);
      margin: 0 0 12px;
    }
    .order-panel__contact-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .order-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease-out;
      border: 1.5px solid var(--border-light, #DDD8CF);
      background: var(--card-bg, #fff);
      color: var(--text-main, #2E2A24);
    }
    .order-btn:hover {
      border-color: var(--color-primary, #4A5A3F);
      background: rgba(74, 90, 63, 0.04);
    }
    .order-btn--phone {
      border-color: var(--color-primary, #4A5A3F);
      background: var(--color-primary, #4A5A3F);
      color: var(--text-on-dark, #F7F4EE);
    }
    .order-btn--phone:hover {
      background: #3D4D34;
      border-color: #3D4D34;
      color: #fff;
    }
    .order-btn--pay {
      grid-column: 1 / -1;
      background: var(--color-primary, #4A5A3F);
      color: var(--text-on-dark, #F7F4EE);
      border-color: var(--color-primary, #4A5A3F);
      font-size: 1rem;
      padding: 14px;
      border: none;
      border-radius: 8px;
      width: 100%;
      margin-top: 12px;
    }
    .order-btn--pay:hover {
      background: #3D4D34;
    }
  `;
  document.head.appendChild(style);
})();
