(function () {
  var progress = document.getElementById('progress');
  var TABS = [
    ['s1', 'مقدمة'], ['s2', 'التعريف'], ['s3', 'التاريخ'], ['s4', 'الرخصة'],
    ['s5', 'البنية'], ['s6', 'التوزيعات'], ['s7', 'الملفات'], ['s8', 'الأوامر'],
    ['s9', 'الصلاحيات'], ['s10', 'الحزم'], ['s11', 'العمليات'], ['s12', 'الشبكات'],
    ['s13', 'الأمان'], ['s14', 'الاستخدامات'], ['s15', 'المزايا والعيوب'],
    ['s16', 'Linux وWindows'], ['s17', 'المستقبل'], ['s18', 'ملخص العرض'], ['s19', 'أسئلة النظام'], ['s20', 'الخاتمة'], ['s21', 'المراجع']
  ];

  // Title block
  var inner = document.querySelector('.cover-inner');
  if (inner) {
    inner.innerHTML =
      '<p class="inst">المعهد الوطني المتخصص هاشمي مباركي - بوقطب -</p>' +
      '<h1 class="cover-title">نظام التشغيل لينكس Linux</h1>' +
      '<p class="cover-sub">درس شامل: من التعريف إلى الاستخدام والإدارة</p>' +
      '<p class="meta"><span>إعداد الطلبة:</span></p>' +
      '<p class="meta names"><b>برهيوي عبدالقادر</b><b>مويسي طارق</b></p>' +
      '<p class="meta"><span>القسم:</span> <b>السنة الأولى، مطوّر الويب والمحمول</b></p>' +
      '<p class="meta"><span>تحت إشراف الأستاذة:</span> <b>قداري</b></p>';
  }

  // Index as small boxes
  var nav = document.createElement('nav');
  nav.id = 'tabs';
  nav.className = 'tabs';
  nav.setAttribute('aria-label', 'أقسام البحث');
  var tabs = {};
  TABS.forEach(function (t) {
    var a = document.createElement('a');
    a.href = '#' + t[0];
    a.textContent = t[1];
    nav.appendChild(a);
    tabs[t[0]] = a;
  });
  var top = document.getElementById('topbar');
  top.parentNode.insertBefore(nav, top.nextSibling);

  // Floating button back to the index
  var fab = document.createElement('a');
  fab.className = 'to-index';
  fab.href = '#tabs';
  fab.textContent = 'الفهرس ↑';
  document.body.appendChild(fab);

  // In-page links scroll smoothly without adding history entries
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Progress bar and floating button
  function onScroll() {
    var y = window.scrollY || 0;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    fab.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the current section's box
  if ('IntersectionObserver' in window) {
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = tabs[en.target.id];
        if (en.isIntersecting && a && a !== current) {
          if (current) current.classList.remove('active');
          current = a;
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    document.querySelectorAll('.chapter').forEach(function (s) { io.observe(s); });
  }

  // Phone back button: first press returns to the top, second press leaves
  history.replaceState({ p: 1 }, '');
  history.pushState({ p: 2 }, '');
  window.addEventListener('popstate', function () {
    if ((window.scrollY || 0) > 40) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState({ p: 2 }, '');
    } else {
      history.back();
    }
  });
})();

// فهرس جانبي: زر صغير يفتح القائمة
(function () {
  var nav = document.getElementById('tabs');
  if (!nav) return;
  var old = document.querySelector('.to-index');
  if (old) old.remove();
  var s16 = nav.querySelector('a[href="#s16"]');
  if (s16) s16.textContent = 'Linux و Windows';
  document.body.appendChild(nav);
  var scrim = document.createElement('div');
  scrim.className = 'menu-scrim';
  scrim.hidden = true;
  var fab = document.createElement('button');
  fab.className = 'menu-fab';
  fab.setAttribute('aria-label', 'فتح الفهرس');
  fab.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(scrim);
  document.body.appendChild(fab);
  function setOpen(o) {
    nav.classList.toggle('open', o);
    scrim.hidden = !o;
    if (o) { var a = nav.querySelector('a.active'); if (a) a.scrollIntoView({ block: 'center' }); }
  }
  fab.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
  scrim.addEventListener('click', function () { setOpen(false); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('popstate', function () { setOpen(false); });
})();
