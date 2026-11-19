// ==UserScript==
// @name         Search Jump Lite
// @namespace    https://greasyfork.org/
// @version      2.1.0
// @description  搜索引擎快捷跳转（纯 DOM，无 GM 依赖）
// @match        *://*/*
// @run-at       document-idle
// @noframes
// ==/UserScript==

/* eslint-disable no-multi-spaces */
// 上方规则仅在此文件豁免：配置表按列对齐，便于增删引擎时对齐字段

(() => {
  'use strict';

  // 单份配置：识别规则 + 跳转模板 + 图标
  const E = [
    { name: 'Google',     host: /(^|\.)google\.[a-z.]+$/i, path: /^\/search\/?$/,  params: ['q'],          url: 'https://www.google.com/search?q={q}', icon: "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!-- Generator: Adobe Illustrator 15.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='48px' height='48px' viewBox='0 0 48 48' enable-background='new 0 0 48 48' xml:space='preserve'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E%0A" },
    { name: 'Bing',       host: /(^|\.)bing\.com$/i,       path: /^\/search\/?$/,  params: ['q'],          url: 'https://www.bing.com/search?q={q}',   icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB5ElEQVQ4jZ2Tv0sbYRyHX5Uzl8bLVNrSToUOHbr0T2gHqf1Baf8AvcUruNcpd5e75BK9H0Q9gptCogZKh6J2kWtDhkpxkmCwOIidijpYECoI5unQNo0QauwHnuUD78PL9/2+on9w0ItrWiSraiSNjER9w8NRTFUjuQvimhaJuKZ9ThaLJHyfGzMz3AxDRC6H7LooQYDi+50JApJhiJBVNVJ8nx7TZKhU4svhIYX1dW4XCsRsm4FstjOOg+K6fwXCMHiysMCfvKhUELp+OcHjcrkleL60hEil/l/wslKhxzAQuk6vaRLPZC5/g9dra5jVKvdnZ5FtG5FKIVkWSjeCB3NzvFpeBuD7yQnvd3YYW13lztQUsm1fLHhUKnE1n6e+v0973mxtIaXTJDKZLoY4Ps71yUneNhqt/uPuLrJlceUiwcP5ea5NTJCt1fh2fNzq321vI6XT/xacNZuUNzdpHBy0Dp41m1Tqde4Vi/RbVucZPG1bpPbU9vZ4triIlE7TZ5qdXyFmWdzyfYobG/w4PQXg69ERYysrKI6D0PXzu9Am+KAEAYrjELNthGEwVC5jVqvcDUOErv/6E45znlwOxfMQ8ujop2QYorguiueRcF16HQeRzSLl8wz87hXXPY/nkZye5icfi28JEi0cegAAAABJRU5ErkJggg==" },
    { name: '百度',       host: /(^|\.)baidu\.com$/i,      path: /^\/s\/?$/,       params: ['wd', 'word'], url: 'https://www.baidu.com/s?wd={q}',      icon: "data:image/svg+xml,%3Csvg t='1666880462710' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='36406' width='32' height='32'%3E%3Cpath d='M226.522 536.053c96.993-20.839 83.792-136.761 80.878-162.089-4.758-39.065-50.691-107.346-113.075-101.952-78.499 7.036-89.957 120.445-89.957 120.445C93.748 444.857 129.764 556.857 226.522 536.053zM329.512 737.61c-2.848 8.175-9.18 29.014-3.686 47.173 10.822 40.707 46.168 42.55 46.168 42.55l50.792 0L422.786 703.169 368.41 703.169C343.952 710.473 332.159 729.468 329.512 737.61zM406.537 341.666c53.572 0 96.859-61.646 96.859-137.9 0-76.12-43.287-137.767-96.859-137.767-53.472 0-96.892 61.646-96.892 137.767C309.645 280.019 353.065 341.666 406.537 341.666zM637.241 350.779c71.598 9.281 117.632-67.141 126.777-125.035 9.349-57.827-36.854-125.036-87.544-136.561-50.791-11.659-114.213 69.688-119.976 122.757C549.597 276.803 565.779 341.566 637.241 350.779zM812.666 691.174c0 0-110.761-85.701-175.425-178.305-87.645-136.593-212.177-81.011-253.822-11.558-41.478 69.452-106.106 113.375-115.286 125-9.314 11.458-133.813 78.666-106.173 201.423 27.64 122.69 124.7 120.345 124.7 120.345s71.53 7.036 154.519-11.524c83.021-18.428 154.484 4.59 154.484 4.59s193.919 64.929 246.988-60.072C895.655 756.037 812.666 691.174 812.666 691.174zM480.881 877.253 354.807 877.253c-54.443-10.855-76.12-48.044-78.867-54.343-2.68-6.433-18.125-36.317-9.951-87.109 23.52-76.12 90.627-81.614 90.627-81.614l67.107 0 0-82.485 57.157 0.871L480.88 877.253zM715.674 876.382l-145.07 0c-56.219-14.508-58.866-54.444-58.866-54.444L511.738 661.49l58.866-0.938 0 144.199c3.586 15.345 22.682 18.159 22.682 18.159l59.771 0L653.057 661.49l62.618 0L715.675 876.382zM921.051 448.006c0-27.708-23.018-111.13-108.385-111.13-85.501 0-96.925 78.732-96.925 134.382 0 53.136 4.489 127.313 110.695 124.935C932.677 593.846 921.051 475.881 921.051 448.006z' p-id='36407' fill='%23008bdd'%3E%3C/path%3E%3C/svg%3E" },
    { name: 'DuckDuckGo', host: /(^|\.)duckduckgo\.com$/i, path: /^\/(html\/)?$/,  params: ['q'],          url: 'https://duckduckgo.com/?q={q}',       icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADiElEQVQ4jXWTfVDTBRjHn+uyi8KAbWz7/TbeNzeUeNkLCljGS3hrspDUsC7vqivz5cI/OtQ7vSxNrpvdkQx0k10M5FYgztECgfOoM7kurs6IFx1ja7xsgMiLAySDffvDtLrs8/fz+T7PH8+X6BFIQymxOGb1WyWy8COH13LL9svCSgtEoTt4RMyj5h/CIRKfSImsMKu4NrOKZ6vZwDafz2Tbajaw9ur1wibzemHj+7Lwo0S06j9yYtgqRX0m216lFDS0FCR3Obcl3/FvFmJCFwt/0Rr0aOPGrVlsuymduVShEljDiCL+3hxCUbWZTLtBwfuqXyeZCThqsTTUj0BrPUZ2psGTE4mxQilmt8twLT/WVaUSXvgsjW8hoseJiOhYUuTpSqWw8YYmPjC6JQ5TtXqsLAYAAMu3fLj9eSk8eQw8OimmXpGjMzfWaU5nv94RvfodkoQ+se6cmm2+tDGqe1Ijxm+HXsd4IIi5+WUAQBDA6MRdePdq4c4Xw12wBlNFifginW0tTxN8Sa9Gh+02qlh7v0ayOJTNh8d4Ev7AMq4P+BAM3g/4rm8KvdVn4H6exWCOHMMaOTqzY1wGJXORDkg5H1ermZYRnQyubCEG9R/Av7CCsnOd+P3eCgCg68YCbnZ0YGyXCLf0AowfjML1PMm8UcHaqVTOO1WjFnWMFMjgyhWjZ48OC3/cPx9YRnD6POArAoZSsfT9k7jTEIHR/THoyZXerVYzLfReQvjRs0qRw7NFBmd+HH4pTMXk6Mhf/jTg4WDGRBjex4f33Th43ojHoEaG7nzJXKWSsdHLwmd2VSmE9h9flMwNaqT4NSca3mudeMCs4xDGj4fgdiUfc1YOJssF8OpkcGTF9FUomIvEIRIb0li7RSX+dqxAjt6NAgxYDA8Dpq116E+JhHdzPJxaKfpyZBjWymFQsPZPkvgWIiLancA9Up7C2K5sivd6XxCh98MS+JYmMDzvxqJ7AN2FctSVKtC9dS18LyWiXh3dZVKK257jPaV98IxPn0oWNpYlCera1cxN/55itLpt2H45A3uvbMObjiy89pMWP7ydioZk0dXyFNZWIuGW/asLoUR8fZLQenod325MlzsuXLVMHnMeRIXrLC67G4OHP8roPZ4hajI9y7YdSOB9+n+FfKw4KmLfSUlEbdPOvJ9dJv3sUnMTZmqM9yypsd+ckHLNm7ghW/8p/Alp3+8i87OHIgAAAABJRU5ErkJggg==" },
    { name: 'Brave',      host: /(^|\.)search\.brave\.com$/i, path: /^\/search\/?$/, params: ['q'], url: 'https://search.brave.com/search?q={q}', icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23FB542B' d='M256 16 48 112l32 272 176 112 176-112 32-272z'/%3E%3C/svg%3E"  }
  ];



  function parse() {
    const u = new URL(location.href);
    const e = E.find(e => e.host.test(location.hostname) && e.path.test(u.pathname));
    if (!e) return null;
    for (const p of e.params) {
      const q = u.searchParams.get(p);
      if (q && q.trim()) return { e, q: q.trim() };
    }
    return null;
  }

  // 非搜索页：立即退出，零开销
  if (!parse()) return;

  // ========== UI ==========
  const host = document.createElement('div');
  host.hidden = true;
  const shadow = host.attachShadow({ mode: 'closed' });
  shadow.innerHTML = `<style>
:host{all:initial;position:fixed;left:0;top:18%;z-index:2147483647;font-family:system-ui,sans-serif}
:host([hidden]){display:none!important}
.panel{display:flex;flex-direction:column;gap:6px;padding:7px;border:1px solid rgba(255,255,255,.15);border-left:0;border-radius:0 12px 12px 0;background:rgba(30,30,30,.9);box-shadow:0 3px 16px rgba(0,0,0,.22);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transform:translateX(calc(-100% + 14px));transition:transform .16s cubic-bezier(.16,.84,.28,1)}
.panel:hover,.panel:focus-within,.panel.open{transform:translateX(0)}
a{display:flex;align-items:center;gap:9px;min-width:180px;padding:8px 10px;border-radius:7px;background:rgba(255,255,255,.1);color:#fff;text-decoration:none;font-size:12px;line-height:1.2;box-sizing:border-box}
a:hover{background:rgba(255,255,255,.25)}
a.cur{opacity:.4}
img{width:19px;height:19px;flex:0 0 19px;object-fit:contain}
span{white-space:nowrap}
</style><div class="panel"></div>`;

  const panel = shadow.querySelector('.panel');
  const links = E.map(en => {
    const a = document.createElement('a');
    a.title = `切换到 ${en.name}`;
    const img = document.createElement('img');
    img.src = en.icon;
    img.alt = '';
    img.onerror = () => img.remove();          // 图标失败就移除，不留空位
    const s = document.createElement('span');
    s.textContent = en.name;
    a.append(img, s);
    panel.append(a);
    return a;
  });

  document.documentElement.append(host);

  // ========== 触发：左侧热区（无 DOM 覆盖层，不拦截页面点击）==========
  const HOT_W = 26;      // 横向容差(px)
  const HOLD_MS = 3000;  // 移开后保持时长
  let closeTimer = 0, hovering = false, px = -1, py = -1;

  const inBand = y => {
    const top = host.getBoundingClientRect().top;
    return y >= top - 6 && y <= top + panel.offsetHeight + 6;
  };
  const openNow = () => {
    clearTimeout(closeTimer); closeTimer = 0;
    if (!panel.classList.contains('open')) panel.classList.add('open');
  };
  const scheduleClose = () => {
    if (closeTimer) return;
    closeTimer = setTimeout(() => {
      closeTimer = 0;
      if (hovering || (px >= 0 && px <= HOT_W && inBand(py))) return; // 指针仍在热区/面板上
      panel.classList.remove('open');
    }, HOLD_MS);
  };

  addEventListener('pointermove', e => {
    if (host.hidden) return;
    if (e.pointerType && e.pointerType !== 'mouse') return;
    px = e.clientX; py = e.clientY;
    if (hovering || (px <= HOT_W && inBand(py))) openNow();
    else scheduleClose();
  }, { passive: true });

  panel.addEventListener('pointerenter', () => { hovering = true; openNow(); });
  panel.addEventListener('pointerleave', () => { hovering = false; scheduleClose(); });

  // ========== 刷新 ==========
  function refresh() {
    const h = parse();
    host.hidden = !h;
    if (!h) { panel.classList.remove('open'); clearTimeout(closeTimer); closeTimer = 0; return; }
    links.forEach((a, i) => {
      a.href = E[i].url.replace('{q}', encodeURIComponent(h.q));
      a.classList.toggle('cur', E[i] === h.e);
    });
  }

  refresh();

  // ========== SPA 导航 ==========
  addEventListener('popstate', refresh);
  addEventListener('hashchange', refresh);
  for (const m of ['pushState', 'replaceState']) {
    const orig = history[m];
    history[m] = function (...args) {
      const r = orig.apply(this, args);
      refresh();
      return r;
    };
  }
})();
