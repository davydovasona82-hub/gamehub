(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* хранилище недоступно */ } }

  var tb = document.querySelector('.theme-btn');
  var saved = get('theme');
  var dark = saved ? saved === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches;
  function theme() {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    tb.setAttribute('aria-pressed', String(!dark));
    tb.textContent = dark ? 'Светлая тема' : 'Тёмная тема';
  }
  tb.addEventListener('click', function () { dark = !dark; put('theme', dark ? 'dark' : 'light'); theme(); });
  theme();

  var mb = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  function menu(open) { nav.classList.toggle('open', open); mb.setAttribute('aria-expanded', String(open)); }
  mb.addEventListener('click', function () { menu(!nav.classList.contains('open')); });

  var favs = [];
  try { favs = JSON.parse(get('favs') || '[]'); } catch (e) { favs = []; }
  var form = document.getElementById('filters');
  var cards = [].slice.call(document.querySelectorAll('.game'));
  function paint() {
    [].forEach.call(document.querySelectorAll('.fav'), function (b) {
      var on = favs.indexOf(b.dataset.id) > -1;
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? '★ В избранном' : '☆ В избранное';
    });
  }
  function word(n) {
    var a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? 'игра' : (a > 1 && a < 5 && (b < 12 || b > 14) ? 'игры' : 'игр');
  }
  function filter() {
    if (!form) { return; }
    var q = form.q.value.trim().toLowerCase(), n = 0;
    cards.forEach(function (c) {
      var ok = (!q || c.dataset.name.toLowerCase().indexOf(q) > -1) &&
        (!form.genre.value || c.dataset.genre === form.genre.value) &&
        (!form.platform.value || c.dataset.platform.split(' ').indexOf(form.platform.value) > -1) &&
        (!form.fav.checked || favs.indexOf(c.dataset.id) > -1);
      c.hidden = !ok;
      if (ok) { n++; }
    });
    document.getElementById('count').textContent = 'Найдено: ' + n + ' ' + word(n);
    document.getElementById('empty').hidden = n > 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.fav') : null;
    if (!b) { return; }
    var i = favs.indexOf(b.dataset.id);
    if (i > -1) { favs.splice(i, 1); } else { favs.push(b.dataset.id); }
    put('favs', JSON.stringify(favs));
    paint();
    filter();
  });
  if (form) {
    form.addEventListener('input', filter);
    form.addEventListener('change', filter);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    form.addEventListener('reset', function () { setTimeout(filter, 0); });
  }
  paint();
  filter();

  var sub = document.getElementById('sub');
  if (sub) {
    sub.addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('status').textContent = 'Спасибо, ' + sub.elements.name.value.trim() + '! Это учебная форма: данные никуда не отправляются.';
      sub.reset();
    });
  }
})();
