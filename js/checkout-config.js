/**
 * S11｜金流設定檔 (checkout-config.js)
 * -------------------------------------
 * 金流串接的前端佔位設定。
 * ⚠️ 不含真實 API 金鑰，後端由 user 自己接。
 *
 * 這個檔案定義：
 * 1. 金流供應商設定（佔位）
 * 2. 訂單流程設定
 * 3. 聯絡管道設定（目前實際使用的下單方式）
 */

const CHECKOUT_CONFIG = {

  // ── 目前實際下單管道（Phase 1：先用聯絡方式，尚未接金流）──
  activeChannel: 'contact',  // 'contact' | 'ecpay' | 'linepay' | 'newebpay'

  contact: {
    phone: '0932-198-152',
    email: 'hello@awosfarm.com',
    line: null,               // 之後填 LINE 官方帳號 ID
    facebook: 'https://www.facebook.com/awosfarm/',
    instagram: 'https://www.instagram.com/awos_farm',
  },

  // ── 綠界 ECPay（佔位，之後填真實值）──
  ecpay: {
    enabled: false,
    merchantId: '',           // TODO: 填入特店編號
    hashKey: '',              // TODO: 填入 HashKey（⚠️ 正式環境應放後端）
    hashIV: '',               // TODO: 填入 HashIV（⚠️ 正式環境應放後端）
    apiUrl: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
    returnUrl: '',            // TODO: 付款完成回傳網址
    clientBackUrl: '',        // TODO: 付款完成導回頁面
    paymentMethods: ['Credit', 'ATM', 'CVS'],  // 信用卡/ATM/超商
  },

  // ── LINE Pay（佔位）──
  linepay: {
    enabled: false,
    channelId: '',            // TODO: LINE Pay Channel ID
    channelSecret: '',        // TODO: Channel Secret（⚠️ 應放後端）
    apiUrl: 'https://sandbox-api-pay.line.me',
    confirmUrl: '',
  },

  // ── 藍新 NewebPay（佔位）──
  newebpay: {
    enabled: false,
    merchantId: '',
    hashKey: '',
    hashIV: '',
    apiUrl: 'https://ccore.newebpay.com/MPG/mpg_gateway',
    returnUrl: '',
    notifyUrl: '',
  },

  // ── 運送設定 ──
  shipping: {
    frozen: {
      label: '冷凍宅配（-18°C）',
      note: '白玉螺肉、即食調理包適用',
      fee: null,  // TODO: 填入運費或改為「依訂單計算」
    },
    room: {
      label: '常溫宅配',
      note: '有機米、美妝品適用',
      fee: null,
    },
    booking: {
      label: '現場體驗（無需配送）',
      note: '農場導覽為預約制，到場即可',
      fee: 0,
    },
  },

  // ── 商家資訊（開立發票等用途）──
  merchant: {
    name: '宏成農品有限公司',
    taxId: '',                // TODO: 填入統一編號
    address: '台東縣長濱鄉八桑安65之1號',
    phone: '0932-198-152',
    email: 'hello@awosfarm.com',
  },

  // ── 訂單設定 ──
  order: {
    currency: 'TWD',
    minAmount: 0,
    orderIdPrefix: 'AWOS',
    expiryMinutes: 30,        // 未付款訂單過期時間
  },
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHECKOUT_CONFIG };
}
