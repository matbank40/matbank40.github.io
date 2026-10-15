/* Банк задач ЕГЭ: проверка ответа, решение, увеличение рисунка, случайный вариант. */
(function () {
  "use strict";

  /* ---------- объявление: показывается один раз, пока админ не выпустит новое ---------- */
  var nt = document.getElementById("notice");
  if (nt) {
    var key = "notice-seen", nid = nt.getAttribute("data-id"), seen = null;
    try { seen = localStorage.getItem(key); } catch (e) { /* приватный режим — просто покажем */ }
    if (seen !== nid) {
      var closeNotice = function () {
        nt.setAttribute("hidden", "");
        document.removeEventListener("keydown", onKey);
        try { localStorage.setItem(key, nid); } catch (e) { /* не запомнили — не страшно */ }
      };
      var onKey = function (e) { if (e.key === "Escape") closeNotice(); };
      nt.removeAttribute("hidden");
      document.addEventListener("keydown", onKey);
      nt.addEventListener("click", function (e) {
        var t = e.target;
        if (t === nt || t.closest(".notice-x, .notice-ok, .notice-go")) closeNotice();
      });
      var ok = nt.querySelector(".notice-ok");
      if (ok) ok.focus();
    }
  }

  /* ---------- ответы ---------- */
  function decode(b64) {
    if (!b64) return "";
    try { return decodeURIComponent(escape(atob(b64))); } catch (e) { return ""; }
  }
  function norm(s) {
    return String(s).toLowerCase().replace(/\s+/g, "").replace(/−|–|—/g, "-").replace(/,/g, ".");
  }
  function same(user, right) {
    var u = norm(user);
    return right.split("|").some(function (r) {
      var v = norm(r);
      if (u === v) return true;
      var a = parseFloat(u), b = parseFloat(v);
      return /^-?\d*\.?\d+$/.test(u) && /^-?\d*\.?\d+$/.test(v) && Math.abs(a - b) < 1e-9;
    });
  }

  function check(task) {
    var input = task.querySelector(".ans"), out = task.querySelector(".verdict");
    var right = decode(task.getAttribute("data-a"));
    out.className = "verdict";
    if (!right) { out.textContent = "Ответы появятся позже"; out.classList.add("wait"); return; }
    if (!input.value.trim()) { out.textContent = "Введите ответ"; out.classList.add("wait"); return; }
    if (same(input.value, right)) { out.textContent = "Верно"; out.classList.add("ok"); }
    else { out.textContent = "Неверно"; out.classList.add("bad"); }
  }

  function toggleSolution(task, btn) {
    var box = task.querySelector(".sol");
    if (!box.innerHTML.trim()) {
      box.innerHTML = '<p class="wait">Решение появится позже.</p>';
      box.setAttribute("data-empty", "1");
    }
    var open = box.hasAttribute("hidden");
    if (open) box.removeAttribute("hidden"); else box.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? "Скрыть решение" : "Решение";
    if (open && window.MathJax && MathJax.typesetPromise && !box.hasAttribute("data-empty")) MathJax.typesetPromise([box]);
  }

  document.addEventListener("click", function (e) {
    var t = e.target, task = t.closest && t.closest(".task");
    if (task && t.classList.contains("check")) { check(task); return; }
    if (task && t.classList.contains("sol-btn")) { toggleSolution(task, t); return; }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("ans")) check(e.target.closest(".task"));
  });

  /* ---------- увеличение рисунка ---------- */
  var z = document.getElementById("zoom");
  if (z) {
    var zi = z.querySelector("img");
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (t.tagName === "IMG" && t.classList.contains("fig")) {
        // увеличиваем до 3× одним коэффициентом по обеим осям, но не больше экрана
        var k = Math.min(3, (innerWidth - 48) / t.naturalWidth, (innerHeight - 48) / t.naturalHeight);
        zi.src = t.src;
        zi.style.width = t.naturalWidth * k + "px";
        zi.style.height = t.naturalHeight * k + "px";
        z.classList.add("on");
      } else if (z.contains(t)) { z.classList.remove("on"); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") z.classList.remove("on"); });
  }

  /* ---------- случайный вариант ---------- */
  var box = document.getElementById("variant");
  if (!box) return;
  var nums = JSON.parse(box.getAttribute("data-nums"));
  var cache = {};

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function taskHtml(n, t) {
    var tools = (n.part === 1
      ? '<input class="ans" type="text" inputmode="decimal" autocomplete="off" placeholder="Ваш ответ" aria-label="Ответ к заданию ' + n.no + '">' +
        '<button class="pill check" type="button">Проверить</button><span class="verdict" aria-live="polite"></span>'
      : "") + '<button class="pill sol-btn" type="button" aria-expanded="false">Решение</button>';
    return '<article class="task" id="t' + esc(t.id) + '" data-a="' + esc(t.a) + '">' +
      '<a class="idx" href="../zadanie-' + n.no + '/#t' + esc(t.id) + '" title="' + esc(n.title) + ' · банк ФИПИ: ' + esc(t.id) + '">' + n.no + '</a>' +
      '<div class="body">' + t.html + '<div class="tools">' + tools + '</div><div class="sol" hidden>' + (t.sol || "") + '</div></div></article>';
  }

  function load(no) {
    if (cache[no]) return Promise.resolve(cache[no]);
    return fetch("../data/" + no + ".json").then(function (r) { return r.json(); }).then(function (d) { cache[no] = d; return d; });
  }

  function build() {
    box.innerHTML = '<p class="wait" style="padding:24px 0">Собираю вариант…</p>';
    Promise.all(nums.map(function (n) { return load(n.no); })).then(function (lists) {
      var html = "";
      nums.forEach(function (n, i) {
        var list = lists[i];
        if (!list.length) return;
        html += taskHtml(n, list[Math.floor(Math.random() * list.length)]);
      });
      box.innerHTML = html;
      if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([box]);
    }).catch(function () {
      box.innerHTML = '<p class="wait" style="padding:24px 0">Не удалось загрузить задания. Обновите страницу.</p>';
    });
  }

  document.getElementById("vnew").addEventListener("click", build);
  document.getElementById("vprint").addEventListener("click", function () { window.print(); });
  build();
})();
