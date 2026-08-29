/**
 * ぽこふわ日和REcast！
 * 1. スマートフォン用メニュー
 * 2. スクロール時のヘッダー表示
 */

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-button');
  const navigation = document.querySelector('.global-nav');
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');

  // スキップリンク選択後に本文へキーボードフォーカスを移します
  document.querySelector('.skip-link')?.addEventListener('click', () => {
    requestAnimationFrame(() => main?.focus());
  });

  const setPageInert = (isInert) => {
    [main, footer].forEach((element) => {
      if (element) element.inert = isInert;
    });
  };

  // スマートフォン用メニューを閉じる共通処理
  const closeMenu = (restoreFocus = false) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setPageInert(false);
    if (restoreFocus) menuButton.focus();
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu(true);
        return;
      }

      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'メニューを閉じる');
      navigation.classList.add('is-open');
      document.body.classList.add('menu-open');
      setPageInert(true);
      navigation.querySelector('a, button')?.focus();
    });

    // ナビゲーション内のリンク選択後はメニューを閉じます
    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
        const href = link.getAttribute('href');

        // ページ内リンクの場合だけ、移動先へフォーカスを移します
        if (href?.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.setAttribute('tabindex', '-1');
            requestAnimationFrame(() => target.focus({ preventScroll: true }));
          }
        }
      });
    });

    // メニュー内にキーボードフォーカスを保ちます
    header?.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || menuButton.getAttribute('aria-expanded') !== 'true') return;
      const items = [menuButton, ...navigation.querySelectorAll('a, button')];
      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    });

    // Escキーでもメニューを閉じられます
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    // PC幅に戻した際にメニューの状態をリセットします
    const desktopMedia = window.matchMedia('(min-width: 961px)');
    const resetDesktopMenu = (event) => {
      if (event.matches) closeMenu();
    };

    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener('change', resetDesktopMenu);
    } else {
      desktopMedia.addListener(resetDesktopMenu);
    }
  }

  // 少しスクロールしたらヘッダー背景を表示し、文字を読みやすくします
  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

});
