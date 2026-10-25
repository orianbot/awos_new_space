/**
 * AWOS 農場 — 全站共用互動邏輯 (main.js)
 * 1. 分類跳轉列 sticky 出現與高亮
 * 2. 捲動淡入 IntersectionObserver
 * 3. Header 首屏透明 / 捲動加背景
 * 4. 漢堡選單開合與 ESC 關閉
 * 5. FAQ 摺疊互動
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Header 捲動特效 ──
  const header = document.querySelector('.awos-header');
  const heroSection = document.querySelector('.awos-hero');

  function handleHeaderScroll() {
    if (!header) return;
    if (header.classList.contains('solid-bg')) return; // 內頁維持實色

    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ── 2. 漢堡選單開合 ──
  const hamburger = document.querySelector('.awos-hamburger');
  const mobileMenu = document.querySelector('.awos-mobile-menu');
  const mobileItems = document.querySelectorAll('.awos-mobile-nav__item');

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.classList.add('no-scroll');

    // 依序淡入 stagger 0.08s
    mobileItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.08}s`;
    });
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');

    mobileItems.forEach((item) => {
      item.style.transitionDelay = '0s';
    });
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (hamburger.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // 點擊選單內部連結後自動關閉
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // 按下 ESC 鍵關閉
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger && hamburger.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ── 3. 捲動淡入效果 (awos-reveal) ──
  const reveals = document.querySelectorAll('.awos-reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // 降級容錯
    reveals.forEach(el => el.classList.add('active'));
  }

  // ── 4. 分類快速跳轉列 (sticky + 錨點高亮) ──
  const stickyNav = document.querySelector('.awos-sticky-nav');
  const stickyLinks = document.querySelectorAll('.awos-sticky-nav__link');

  if (stickyNav && heroSection) {
    function toggleStickyNav() {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom <= 72) {
        stickyNav.classList.remove('hidden-on-hero');
      } else {
        stickyNav.classList.add('hidden-on-hero');
      }
    }
    window.addEventListener('scroll', toggleStickyNav, { passive: true });
    toggleStickyNav();
  }

  // 分類錨點 Observer 高亮當前所在區塊
  const trackedSections = document.querySelectorAll('section[id]');
  if (stickyLinks.length > 0 && trackedSections.length > 0 && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          stickyLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '-72px 0px -40% 0px'
    });

    trackedSections.forEach(sec => sectionObserver.observe(sec));
  }

  // ── 5. FAQ 摺疊面板互動 ──
  const faqItems = document.querySelectorAll('.awos-faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.awos-faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // 單選展開效果（可依喜好收闔其他）
        faqItems.forEach(other => other.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

});
