/* بازار لاجورد | لایهٔ حرکتی */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* ---------- نقش گره‌چین گوشهٔ هیرو ---------- */
  function poly(n, R, rot) {
    var d = '';
    for (var k = 0; k < n; k++) {
      var a = rot + (k * 2 * Math.PI) / n;
      d += (k ? 'L' : 'M') + (100 + R * Math.cos(a)).toFixed(2) + ' ' + (100 + R * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  }
  function star(R, r, pts, rot) {
    var d = '';
    for (var k = 0; k < pts * 2; k++) {
      var rad = k % 2 ? r : R, a = rot + (k * Math.PI) / pts;
      d += (k ? 'L' : 'M') + (100 + rad * Math.cos(a)).toFixed(2) + ' ' + (100 + rad * Math.sin(a)).toFixed(2);
    }
    return d + 'Z';
  }
  function girihSVG() {
    var paths = [poly(8, 98, Math.PI / 8), star(98, 52, 8, -Math.PI / 2), star(70, 36, 8, 0), poly(8, 42, Math.PI / 8)];
    var g = paths.map(function (d, i) {
      return '<path class="g-line" pathLength="1" style="--i:' + i + '" d="' + d + '"/>';
    }).join('');
    return '<svg class="ornament" viewBox="0 0 200 200" aria-hidden="true"><g class="spin-a">' + g + '</g></svg>';
  }
  var hero = document.querySelector('.hero');
  var ornament = null;
  if (hero) {
    hero.insertAdjacentHTML('afterbegin', girihSVG());
    ornament = hero.querySelector('.ornament');
    var glow = document.createElement('i');
    glow.className = 'hero-glow';
    hero.insertBefore(glow, hero.firstChild);
    if (fine && !reduce) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        hero.style.setProperty('--gx', x + 'px');
        hero.style.setProperty('--gy', y + 'px');
        if (ornament) {
          var px = x / r.width - 0.5, py = y / r.height - 0.5;
          ornament.style.transform = 'rotate(' + (px * 12).toFixed(2) + 'deg) translate(' + (px * -24).toFixed(1) + 'px,' + (py * -24).toFixed(1) + 'px)';
        }
      });
    }
  }

  /* ---------- پرده‌ی لاجوردی: باز شدن دو نیمه و حروف نام ---------- */
  var seen = false;
  try { seen = sessionStorage.getItem('lapis-curtain') === '1'; sessionStorage.setItem('lapis-curtain', '1'); } catch (e) {}
  if (!reduce && !seen) {
    var word = function (text, base) {
      /* whole words are animated (not single letters) so Persian letters keep joining */
      return '<span class="ch" style="--i:' + base + '">' + text + '</span>';
    };
    var splash = document.createElement('div');
    splash.className = 'splash';
    splash.setAttribute('aria-hidden', 'true');
    splash.innerHTML =
      '<div class="curtain left"></div><div class="curtain right"></div>' +
      '<div class="splash-word">' + word('بازار', 0) + '<span class="sp-gap"></span>' + word('لاجورد', 1) + '</div>' +
      '<div class="splash-bar"></div>';
    document.body.appendChild(splash);
    setTimeout(function () { splash.remove(); }, 3200);
  }

  /* ---------- نوار متحرک محصولات زیر هیرو ---------- */
  var home = document.getElementById('page-home');
  var h2 = home && home.querySelector('h2');
  if (h2) {
    var words = ['کشمش هرات', 'زعفران خالص', 'لاجورد بدخشان', 'قالین ترکمنی', 'انار کندهار', 'بادام مغزدار', 'چای سبز و هیل', 'پکول و چپن'];
    var row = words.map(function (w) { return '<span>' + w + '</span><b>✦</b>'; }).join('');
    h2.insertAdjacentHTML('beforebegin', '<div class="ticker" aria-hidden="true"><div class="track">' + row + row + '</div></div>');
  }

  /* ---------- اسلایدر: نوار پیشرفت، کشیدن با انگشت ---------- */
  var slider = document.getElementById('heroSlider');
  if (slider) {
    var bar = document.createElement('i');
    bar.className = 'sp-bar';
    slider.appendChild(bar);
    var slides = slider.querySelectorAll('.slide');
    var restart = function () {
      bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    };
    var mo = new MutationObserver(function (list) {
      list.forEach(function (m) { if (m.target.classList.contains('is-active')) restart(); });
    });
    Array.prototype.forEach.call(slides, function (s) { mo.observe(s, { attributes: true, attributeFilter: ['class'] }); });
    restart();
    var sx = null;
    slider.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    slider.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) {
        var btn = slider.querySelector(dx < 0 ? '.next' : '.prev');
        if (btn) btn.click();
      }
    });
  }

  /* ---------- پرواز عکس محصول به سبد خرید ---------- */
  if (!reduce) {
    window.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-add]');
      if (!b) return;
      var p = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(function (x) { return x.id == b.dataset.add; }) : null;
      var badge = document.getElementById('count');
      if (!p || !badge) return;
      var from = b.getBoundingClientRect(), to = badge.getBoundingClientRect();
      var sx0 = from.left + from.width / 2, sy0 = from.top + from.height / 2;
      var ex = to.left + to.width / 2, ey = to.top + to.height / 2;
      var fly = document.createElement('img');
      fly.className = 'fly';
      fly.src = p.img;
      fly.alt = '';
      fly.style.left = sx0 + 'px';
      fly.style.top = sy0 + 'px';
      document.body.appendChild(fly);
      fly.animate([
        { transform: 'translate(-50%,-50%) scale(.6) rotate(0)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + ((ex - sx0) / 2) + 'px),calc(-50% + ' + ((ey - sy0) / 2 - 130) + 'px)) scale(1) rotate(160deg)', opacity: 1, offset: 0.5 },
        { transform: 'translate(calc(-50% + ' + (ex - sx0) + 'px),calc(-50% + ' + (ey - sy0) + 'px)) scale(.2) rotate(320deg)', opacity: 0.2 }
      ], { duration: 820, easing: 'cubic-bezier(.45,0,.2,1)' }).onfinish = function () {
        fly.remove();
        badge.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'ease-out' });
      };
      b.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
    });
  }

  /* ---------- نور تعقیب‌کنندهٔ ماوس روی کارت‌ها ---------- */
  if (fine && !reduce) {
    document.addEventListener('pointermove', function (e) {
      var it = e.target.closest && e.target.closest('.item');
      if (!it) return;
      var r = it.getBoundingClientRect();
      it.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      it.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- دکمه‌های مغناطیسی ---------- */
  if (fine && !reduce) {
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.btn:not(.small)');
      if (!b) return;
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.translate = (dx * 10).toFixed(1) + 'px ' + (dy * 8).toFixed(1) + 'px';
    });
    document.addEventListener('pointerout', function (e) {
      var b = e.target.closest && e.target.closest('.btn');
      if (b && !b.contains(e.relatedTarget)) b.style.translate = '';
    });
  }

  /* ---------- شمارش عددی بخش «درباره ما» ---------- */
  var about = document.getElementById('page-about');
  if (about && !reduce) {
    var digitsFa = '۰۱۲۳۴۵۶۷۸۹';
    var toEn = function (s) { return s.replace(/[۰-۹]/g, function (d) { return digitsFa.indexOf(d); }); };
    var toFa = function (s) { return String(s).replace(/[0-9]/g, function (d) { return digitsFa[d]; }); };
    var counted = false;
    var countUp = function () {
      if (counted) return; counted = true;
      about.querySelectorAll('.strip h3').forEach(function (h, idx) {
        var raw = toEn(h.textContent), m = raw.match(/^(\d+)(.*)$/);
        if (!m) return;
        var target = parseInt(m[1], 10), suffix = m[2];
        var start = performance.now(), dur = 1400 + idx * 200;
        var tick = function (now) {
          var t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
          h.textContent = toFa(Math.round(target * eased)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    new MutationObserver(function () { if (about.classList.contains('on')) countUp(); })
      .observe(about, { attributes: true, attributeFilter: ['class'] });
    if (about.classList.contains('on')) countUp();
  }
})();
