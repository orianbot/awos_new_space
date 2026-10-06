/**
 * S11b｜金流串接前端佔位（修正版 checkout.js）
 * --------------------------------------------
 * 1. 提供 AWOS_CHECKOUT 命名空間與佔位函式：
 *    - AWOS_CHECKOUT.payWithECPay(productData)
 *    - AWOS_CHECKOUT.payWithLinePay(productData)
 *
 * 2. startOrder(productId) 控制彈窗顯示：
 *    - 有實際價格之商品：彈窗只放 [綠界 ECPay 付款] 與 [LINE Pay 付款] 兩顆按鈕。
 *    - 「洽詢報價／僅供餐廳採購」等無固定售價商品：保留聯絡方式（電話、信箱、IG、FB）。
 *
 * ⚠️ 不含任何真實或虛構的 MerchantID、HashKey、Channel Secret 等金鑰。
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════
  //  AWOS_CHECKOUT 核心命名空間與佔位函式
  // ══════════════════════════════════════════════
  window.AWOS_CHECKOUT = {
    /**
     * 綠界 ECPay 結帳佔位函式
     * @param {Object} productData 商品物件資料
     */
    payWithECPay: function (productData) {
      console.log('[ECPay]', productData);
      // TODO: 之後在這裡呼叫自己後端的綠界結帳API
      alert('綠界付款功能串接中');
    },

    /**
     * LINE Pay 結帳佔位函式
     * @param {Object} productData 商品物件資料
     */
    payWithLinePay: function (productData) {
      console.log('[LinePay]', productData);
      // TODO: 之後在這裡呼叫自己後端的LINE Pay結帳API
      alert('LINE Pay 付款功能串接中');
    }
  };

  // ── 彈窗內部狀態 ──
  const checkoutModal = {
    el: null,
    currentProduct: null
  };

  // ── 建立或取得彈窗 DOM ──
  function getOrCreateModal() {
    if (checkoutModal.el) return checkoutModal.el;

    const modal = document.createElement('div');
    modal.id = 'awos-checkout-modal';
    modal.className = 'awos-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="awos-modal__backdrop"></div>
      <div class="awos-modal__container">
        <button class="awos-modal__close" aria-label="關閉視窗">&times;</button>
        <div class="awos-modal__header">
          <img class="awos-modal__thumb" src="" alt="">
          <div class="awos-modal__title-box">
            <h3 class="awos-modal__name"></h3>
            <p class="awos-modal__spec"></p>
            <p class="awos-modal__price"></p>
          </div>
        </div>
        <div class="awos-modal__body" id="awos-modal-body">
          <!-- 依商品類型動態注入按鈕 -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    checkoutModal.el = modal;

    // 事件監聽：點擊背景或關閉按鈕
    modal.querySelector('.awos-modal__close').addEventListener('click', closeModal);
    modal.querySelector('.awos-modal__backdrop').addEventListener('click', closeModal);

    // ESC 關閉
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    return modal;
  }

  // ── 開啟彈窗 ──
  function openModal(product) {
    const modal = getOrCreateModal();
    checkoutModal.currentProduct = product;

    // 填入商品資訊
    modal.querySelector('.awos-modal__thumb').src = product.image || '';
    modal.querySelector('.awos-modal__thumb').alt = product.name || '';
    modal.querySelector('.awos-modal__name').textContent =
      product.name + (product.grade ? ' (' + product.grade + ')' : '');
    modal.querySelector('.awos-modal__spec').textContent = product.spec || '';
    modal.querySelector('.awos-modal__price').textContent = product.priceDisplay || '';

    const bodyEl = modal.querySelector('#awos-modal-body');
    bodyEl.innerHTML = '';

    // 判斷是否為「洽詢報價/僅供餐廳採購」類型
    const isInquiryOnly = product.orderType === 'inquiry' || product.price === null;

    if (isInquiryOnly) {
      // ── 例外：洽詢報價商品（八桑安特級螺肉等）──
      const notice = document.createElement('p');
      notice.className = 'awos-modal__notice';
      notice.textContent = '此品項為餐廳等級採購／價格洽詢，請透過以下方式與我們聯繫：';
      bodyEl.appendChild(notice);

      const contactBox = document.createElement('div');
      contactBox.className = 'awos-contact-buttons';
      contactBox.innerHTML = `
        <a href="tel:0932198152" class="awos-btn awos-btn--phone">📞 電話洽詢 (0932-198-152)</a>
        <a href="mailto:hello@awosfarm.com?subject=${encodeURIComponent('AWOS採購洽詢 — ' + product.name)}" class="awos-btn awos-btn--secondary">✉ 信箱洽詢</a>
        <a href="https://www.instagram.com/awos_farm" target="_blank" rel="noopener" class="awos-btn awos-btn--secondary">📷 Instagram 私訊</a>
        <a href="https://www.facebook.com/awossnailfarm" target="_blank" rel="noopener" class="awos-btn awos-btn--secondary">💬 Facebook 私訊</a>
      `;
      bodyEl.appendChild(contactBox);

    } else {
      // ── 一般商品：只放「綠界 ECPay 付款」與「LINE Pay 付款」──
      const payBox = document.createElement('div');
      payBox.className = 'awos-payment-buttons';
      payBox.innerHTML = `
        <button type="button" class="awos-btn awos-btn--ecpay" id="btn-pay-ecpay">
          綠界 ECPay 付款
        </button>
        <button type="button" class="awos-btn awos-btn--linepay" id="btn-pay-linepay">
          LINE Pay 付款
        </button>
      `;
      bodyEl.appendChild(payBox);

      // 綁定點擊事件至佔位函式
      payBox.querySelector('#btn-pay-ecpay').addEventListener('click', function () {
        AWOS_CHECKOUT.payWithECPay(checkoutModal.currentProduct);
      });

      payBox.querySelector('#btn-pay-linepay').addEventListener('click', function () {
        AWOS_CHECKOUT.payWithLinePay(checkoutModal.currentProduct);
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ── 關閉彈窗 ──
  function closeModal() {
    if (checkoutModal.el) {
      checkoutModal.el.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ══════════════════════════════════════════════
  //  全域 startOrder 函式
  // ══════════════════════════════════════════════
  window.startOrder = function (productId) {
    if (typeof getProduct === 'function') {
      const product = getProduct(productId);
      if (product) {
        openModal(product);
        return;
      }
    }

    console.warn('[AWOS] 找不到指定商品資料:', productId);
  };

  // ══════════════════════════════════════════════
  //  注入彈窗樣式
  // ══════════════════════════════════════════════
  const style = document.createElement('style');
  style.textContent = `
    .awos-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-out;
    }
    .awos-modal.active {
      opacity: 1;
      pointer-events: auto;
    }
    .awos-modal__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(46, 42, 36, 0.55);
      backdrop-filter: blur(2px);
    }
    .awos-modal__container {
      position: relative;
      background: var(--bg-main, #F7F4EE);
      border-radius: 14px;
      width: 100%;
      max-width: 440px;
      padding: 28px 24px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
      transform: translateY(12px) scale(0.98);
      transition: transform 0.25s ease-out;
    }
    .awos-modal.active .awos-modal__container {
      transform: translateY(0) scale(1);
    }
    .awos-modal__close {
      position: absolute;
      top: 14px;
      right: 16px;
      background: none;
      border: none;
      font-size: 1.6rem;
      line-height: 1;
      color: var(--text-light, #7A7570);
      cursor: pointer;
      padding: 4px;
      transition: color 0.15s;
    }
    .awos-modal__close:hover {
      color: var(--text-main, #2E2A24);
    }
    .awos-modal__header {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 22px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border-light, #DDD8CF);
    }
    .awos-modal__thumb {
      width: 76px;
      height: 76px;
      object-fit: cover;
      border-radius: 8px;
      background: #E6E0D6;
      flex-shrink: 0;
    }
    .awos-modal__title-box {
      flex: 1;
      min-width: 0;
    }
    .awos-modal__name {
      font-family: var(--font-heading, 'Noto Serif TC', serif);
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--text-main, #2E2A24);
      margin: 0 0 4px;
    }
    .awos-modal__spec {
      font-size: 0.85rem;
      color: var(--text-light, #7A7570);
      margin: 0 0 6px;
      line-height: 1.4;
    }
    .awos-modal__price {
      font-family: var(--font-heading, 'Noto Serif TC', serif);
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--color-primary, #4A5A3F);
      margin: 0;
    }
    .awos-modal__notice {
      font-size: 0.9rem;
      color: var(--text-main, #2E2A24);
      margin: 0 0 16px;
      line-height: 1.5;
    }
    .awos-payment-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .awos-contact-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .awos-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 13px 18px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      text-decoration: none;
      transition: all 0.2s ease-out;
      box-sizing: border-box;
    }
    /* 綠界 ECPay 按鈕 */
    .awos-btn--ecpay {
      background-color: #007A3D;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(0, 122, 61, 0.25);
    }
    .awos-btn--ecpay:hover {
      background-color: #006030;
    }
    /* LINE Pay 按鈕 */
    .awos-btn--linepay {
      background-color: #00B900;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(0, 185, 0, 0.25);
    }
    .awos-btn--linepay:hover {
      background-color: #009900;
    }
    /* 洽詢電話按鈕 */
    .awos-btn--phone {
      background-color: var(--color-primary, #4A5A3F);
      color: #FFFFFF;
    }
    .awos-btn--phone:hover {
      background-color: #3B4932;
    }
    /* 次要按鈕 */
    .awos-btn--secondary {
      background-color: #FFFFFF;
      color: var(--text-main, #2E2A24);
      border-color: var(--border-light, #DDD8CF);
    }
    .awos-btn--secondary:hover {
      border-color: var(--color-primary, #4A5A3F);
      background-color: #FAF8F5;
    }
  `;
  document.head.appendChild(style);
})();
