/* Банк задач ЕГЭ: проверка ответа, решение, увеличение рисунка, случайный вариант. */
(function () {
  "use strict";

  /* ---------- объявление: показывается один раз, пока админ не выпустит новое ---------- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function showNotice() {
    var nt = document.getElementById("notice");
    if (!nt) return;
    var key = "notice-seen", nid = nt.getAttribute("data-id");
    if (store(key) === nid) return;
    var closeNotice = function () {
      nt.setAttribute("hidden", "");
      document.removeEventListener("keydown", onKey);
      store(key, nid);
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

  /* ---------- обучение для тех, кто зашёл впервые ---------- */
  var TOUR = [
    { t: "Задания по номерам", p: "Все задачи открытого банка ФИПИ разложены по номерам ЕГЭ. Выберите номер на главной — откроются все его задачи.",
      art: '<div class="tv-tiles"><div class="tv-tile"><b>Задание 7</b><span>Простейшие уравнения</span><i>Открыть задания →</i></div><div class="tv-tile"><b>Задание 9</b><span>Производная</span><i>Открыть задания →</i></div></div>' },
    { t: "Проверьте свой ответ", p: "В задачах первой части впишите ответ и нажмите «Проверить». Дробь можно писать через запятую или точку.",
      art: '<div class="tv-row"><span class="tv-input">−6</span><span class="tv-pill">Проверить</span><span class="tv-ok">Верно</span></div>' },
    { t: "Черновик прямо на задаче", p: "Нажмите «Черновик» — и пишите маркером поверх условия, как на листке. Есть ластик, отмена и «Очистить».",
      art: '<div class="tv-draft"><svg viewBox="0 0 240 70" aria-hidden="true"><path d="M10 45 C 40 10, 60 10, 80 40 S 120 70, 140 35 S 190 5, 230 30" fill="none" stroke="#e3000f" stroke-width="3" stroke-linecap="round"/></svg><div class="tv-row"><span class="tv-pill dark">Черновик</span><span class="tv-pill"><i class="tv-dot"></i>Маркер</span><span class="tv-pill">Ластик</span></div></div>' },
    { t: "Случайный вариант", p: "Соберите вариант из случайных задач — по одной на каждый номер. Его можно распечатать, а ответы положить в конец.",
      art: '<div class="tv-row"><span class="tv-btn">Собрать случайный вариант</span></div><div class="tv-row"><span class="tv-pill">Распечатать / PDF</span><span class="tv-check"><i></i>Ответы в конце</span></div>' },
    { t: "PDF и рисунки", p: "Каждый номер можно скачать в PDF для печати. Нажмите на рисунок в задаче — он увеличится.",
      art: '<div class="tv-row"><span class="tv-pill">PDF</span><span class="tv-pill">Скачать PDF</span><span class="tv-zoom">⤢</span></div>' }
  ];

  function showTour(done) {
    var i = 0;
    var el = document.createElement("div");
    el.className = "notice tour";
    el.innerHTML = '<div class="notice-box" role="dialog" aria-modal="true" aria-labelledby="tour-title">' +
      '<button class="notice-x" type="button" aria-label="Закрыть">×</button><div class="tour-body"></div>' +
      '<div class="tour-foot"><div class="tour-dots"></div><div class="tour-btns"></div></div></div>';
    document.body.appendChild(el);
    var body = el.querySelector(".tour-body"), dots = el.querySelector(".tour-dots"), btns = el.querySelector(".tour-btns");

    function welcome() {
      body.innerHTML = '<img class="tour-logo" src="' + (document.querySelector(".logo img") || {}).src + '" alt="">' +
        '<h2 id="tour-title">Добро пожаловать!</h2><p>Здесь все задачи открытого банка ФИПИ по профильной математике. Показать за полминуты, как всё устроено?</p>';
      dots.innerHTML = "";
      btns.innerHTML = '<button class="btn ghost" data-a="skip" type="button">Пропустить</button><button class="btn red" data-a="next" type="button">Показать</button>';
      i = -1;
    }
    function step() {
      var s = TOUR[i];
      body.innerHTML = '<div class="tour-art">' + s.art + '</div><h2 id="tour-title">' + s.t + '</h2><p>' + s.p + '</p>';
      dots.innerHTML = TOUR.map(function (_, k) { return '<i class="' + (k === i ? "on" : "") + '"></i>'; }).join("");
      btns.innerHTML = (i > 0 ? '<button class="btn ghost" data-a="prev" type="button">Назад</button>' : '<button class="btn ghost" data-a="skip" type="button">Пропустить</button>') +
        '<button class="btn red" data-a="next" type="button">' + (i === TOUR.length - 1 ? "Начать" : "Далее") + '</button>';
    }
    function close() {
      el.remove(); document.removeEventListener("keydown", onKey);
      store("tour-done", "1");
      if (done) done();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft" && i > 0) go(-1);
    }
    function go(d) { i += d; if (i >= TOUR.length) return close(); step(); var n = btns.querySelector('[data-a="next"]'); if (n) n.focus(); }
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (e.target === el || (b && (b.classList.contains("notice-x") || b.dataset.a === "skip"))) return close();
      if (b && b.dataset.a === "next") go(1);
      if (b && b.dataset.a === "prev") go(-1);
    });
    document.addEventListener("keydown", onKey);
    welcome();
    btns.querySelector('[data-a="next"]').focus();
  }

  // ссылка «Как пользоваться» в подвале — показать обучение ещё раз
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-tour]");
    if (a) { e.preventDefault(); showTour(); }
  });

  if (store("tour-done") === "1" || navigator.webdriver) showNotice();
  else showTour(showNotice);

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
    if (task && t.classList.contains("draw-btn")) { toggleDraw(task, t); return; }
    var dt = t.closest && t.closest(".draw-tools button");
    if (task && dt) { drawCommand(task, dt); return; }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("ans")) check(e.target.closest(".task"));
  });


  /* ---------- черновик: рисование поверх задания ---------- */
  var DRAW_COLOR = "#e3000f";
  function drawState(task) { return task._draw; }

  function toggleDraw(task, btn) {
    var st = drawState(task);
    if (st && st.on) {
      st.on = false; st.canvas.classList.remove("on"); st.bar.hidden = true; st.pad.hidden = true;
      btn.setAttribute("aria-pressed", "false"); btn.classList.remove("active"); return;
    }
    if (!st) st = initDraw(task);
    st.on = true; st.canvas.classList.add("on"); st.bar.hidden = false; st.pad.hidden = false;
    btn.setAttribute("aria-pressed", "true"); btn.classList.add("active");
    fit(st);
  }

  function initDraw(task) {
    var body = task.querySelector(".body");
    var canvas = document.createElement("canvas");
    canvas.className = "draw-layer";
    body.insertBefore(canvas, body.firstChild);
    var bar = document.createElement("div");
    bar.className = "draw-tools"; bar.hidden = true;
    bar.innerHTML = '<button type="button" data-tool="pen" class="sel" title="Маркер"><i class="dot"></i>Маркер</button>' +
      '<button type="button" data-tool="eraser" title="Ластик">Ластик</button>' +
      '<button type="button" data-cmd="undo" title="Отменить последний штрих">Отменить</button>' +
      '<button type="button" data-cmd="clear" title="Стереть всё">Очистить</button>';
    task.querySelector(".tools").appendChild(bar);
    // чистое место под условием — для записей
    var pad = document.createElement("div");
    pad.className = "draw-pad"; pad.hidden = true;
    body.insertBefore(pad, body.querySelector(".tools"));
    var st = { canvas: canvas, bar: bar, body: body, pad: pad, ctx: canvas.getContext("2d"), ops: [], cur: null, tool: "pen", on: false };
    task._draw = st;

    function pos(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    canvas.addEventListener("pointerdown", function (e) {
      if (!st.on) return;
      e.preventDefault(); canvas.setPointerCapture(e.pointerId);
      st.cur = { tool: st.tool, pts: [pos(e)] }; st.ops.push(st.cur); redraw(st);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!st.cur) return;
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (var i = 0; i < evs.length; i++) st.cur.pts.push(pos(evs[i]));
      redraw(st);
    });
    function end() { st.cur = null; }
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
    window.addEventListener("resize", function () { if (st.on) fit(st); });
    return st;
  }

  // холст — от верха задания до строки с кнопками, чтобы поле ответа оставалось доступным
  function fit(st) {
    var tools = st.body.querySelector(".tools");
    var w = st.body.clientWidth, h = Math.max(60, tools.offsetTop - 4);
    var k = window.devicePixelRatio || 1;
    st.canvas.style.width = w + "px"; st.canvas.style.height = h + "px";
    st.canvas.width = Math.round(w * k); st.canvas.height = Math.round(h * k);
    st.ctx.setTransform(k, 0, 0, k, 0, 0);
    redraw(st);
  }

  // плавная линия: кривые через середины соседних точек
  function stroke(ctx, pts) {
    if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0][0], pts[0][1], ctx.lineWidth / 2, 0, 7); ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    var l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]); ctx.stroke();
  }

  function redraw(st) {
    var c = st.ctx; c.clearRect(0, 0, st.canvas.width, st.canvas.height);
    c.lineCap = "round"; c.lineJoin = "round";
    st.ops.forEach(function (op) {
      c.globalCompositeOperation = op.tool === "eraser" ? "destination-out" : "source-over";
      c.strokeStyle = c.fillStyle = op.tool === "eraser" ? "#000" : DRAW_COLOR;
      c.lineWidth = op.tool === "eraser" ? 26 : 3;
      stroke(c, op.pts);
    });
    c.globalCompositeOperation = "source-over";
  }

  function drawCommand(task, b) {
    var st = drawState(task); if (!st) return;
    if (b.dataset.tool) {
      st.tool = b.dataset.tool;
      st.bar.querySelectorAll("[data-tool]").forEach(function (x) { x.classList.toggle("sel", x === b); });
      st.canvas.classList.toggle("erase", st.tool === "eraser");
    } else if (b.dataset.cmd === "undo") { st.ops.pop(); redraw(st); }
    else if (b.dataset.cmd === "clear") { st.ops = []; redraw(st); }
  }

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
      : "") + '<button class="pill sol-btn" type="button" aria-expanded="false">Решение</button>' +
      '<button class="pill draw-btn" type="button" aria-pressed="false">Черновик</button>';
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
  document.getElementById("vprint").addEventListener("click", function () {
    var keys = document.getElementById("vkeys"), withAns = document.getElementById("vanswers").checked;
    if (withAns) {
      var rows = "";
      box.querySelectorAll(".task").forEach(function (t) {
        var no = t.querySelector(".idx").textContent, a = decode(t.getAttribute("data-a"));
        if (a) rows += "<tr><td>" + esc(no) + "</td><td>" + esc(a.split("|")[0]) + "</td></tr>";
      });
      keys.innerHTML = rows ? "<h2>Ответы</h2><table>" + rows + "</table>" : "";
      keys.hidden = !rows;
    } else { keys.hidden = true; }
    window.print();
  });
  build();
})();
