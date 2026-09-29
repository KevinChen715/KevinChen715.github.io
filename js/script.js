/* ============ 陈楷文 · 数字述职页 交互 ============ */
document.addEventListener('DOMContentLoaded', function () {
  /* ---- 导航：滚动阴影 ---- */
  var navbar = document.getElementById('navbar');
  var navLogo = document.getElementById('navLogo');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    highlightNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- 汉堡菜单 ---- */
  var burger = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- 导航当前区高亮 ---- */
  var sections = document.querySelectorAll('section[id], header[id], footer[id]');
  var linkMap = {};
  document.querySelectorAll('.nav-link').forEach(function (a) {
    linkMap[a.getAttribute('href').slice(1)] = a;
  });
  function highlightNav() {
    var pos = window.scrollY + window.innerHeight / 3;
    var current = '';
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    Object.keys(linkMap).forEach(function (id) {
      linkMap[id].classList.toggle('active', id === current);
    });
  }

  /* ---- Reveal 滚动渐入 ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---- KPI 数字增长 ---- */
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.dataset.target, 10);
      var dur = 1600, start = null;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(function (el) { countIO.observe(el); });

  /* ---- 舞台轮播 ---- */
  var track = document.getElementById('carTrack');
  var slides = track ? track.children.length : 0;
  var dotsBox = document.getElementById('carDots');
  var idx = 0, timer = null;
  if (track && slides) {
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', '第' + (i + 1) + '张');
      (function (n) { d.addEventListener('click', function () { go(n); restart(); }); })(i);
      dotsBox.appendChild(d);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dotsBox.querySelectorAll('.dot').forEach(function (dt, j) {
        dt.classList.toggle('active', j === idx);
      });
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(idx + 1); }, 5200);
    }
    document.getElementById('carPrev').addEventListener('click', function () { go(idx - 1); restart(); });
    document.getElementById('carNext').addEventListener('click', function () { go(idx + 1); restart(); });
    restart();

    /* 触屏滑动 */
    var sx = null;
    track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 46) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
      sx = null;
    });
  }

  onScroll();
});
