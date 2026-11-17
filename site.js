/* Банк задач ЕГЭ: проверка ответа, решение, увеличение рисунка, случайный вариант. */
(function () {
  "use strict";

  /* ---------- объявление: показывается один раз, пока админ не выпустит новое ---------- */
  var EXKEY = document.body.getAttribute("data-exam") === "oge" ? "oge-" : "";  // настройки ЕГЭ и ОГЭ не смешиваем
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
    { t: "Задания по номерам", p: "Все задачи открытого банка ФИПИ разложены по номерам " + (EXKEY ? "ОГЭ" : "ЕГЭ") + ". Выберите номер на главной — откроются все его задачи.",
      art: '<div class="tv-tiles"><div class="tv-tile"><b>Задание 7</b><span>Простейшие уравнения</span><i>Открыть задания →</i></div><div class="tv-tile"><b>Задание 9</b><span>Производная</span><i>Открыть задания →</i></div></div>' },
    { t: "Проверьте свой ответ", p: "В задачах первой части впишите ответ и нажмите «Проверить». Дробь можно писать через запятую или точку.",
      art: '<div class="tv-row"><span class="tv-input">−6</span><span class="tv-pill">Проверить</span><span class="tv-ok">Верно</span></div>' },
    { t: "Черновик прямо на задаче", p: "Нажмите «Черновик» — и пишите маркером поверх условия, как на листке. Есть ластик, отмена и «Очистить».",
      art: '<div class="tv-draft"><svg viewBox="0 0 240 70" aria-hidden="true"><path d="M10 45 C 40 10, 60 10, 80 40 S 120 70, 140 35 S 190 5, 230 30" fill="none" stroke="#e3000f" stroke-width="3" stroke-linecap="round"/></svg><div class="tv-row"><span class="tv-pill dark">Черновик</span><span class="tv-pill"><i class="tv-dot"></i>Маркер</span><span class="tv-pill">Ластик</span></div></div>' },
    { t: "Случайный вариант", p: "Соберите вариант из случайных задач — по одной на каждый номер. Его можно распечатать, а ответы положить в конец.",
      art: '<div class="tv-row"><span class="tv-btn">Собрать случайный вариант</span></div><div class="tv-row"><span class="tv-pill">Распечатать / PDF</span><span class="tv-check"><i></i>Ответы в конце</span></div>' },
    { t: "Тренировка", p: "Во вкладке «Тренировка» соберите подборку: номер, источники — банк ФИПИ или сборники — и сколько задач решать.",
      art: '<div class="tv-row"><span class="tv-pill dark">№ 9</span><span class="tv-pill">✓ Банк ФИПИ</span><span class="tv-pill">✓ Ященко 2027</span></div><div class="tv-row"><span class="tv-pill">−&nbsp;&nbsp;5&nbsp;&nbsp;+</span><span class="tv-btn">Собрать подборку</span></div>' },
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
        '<h2 id="tour-title">Добро пожаловать!</h2><p>Здесь задачи открытого банка ФИПИ ' + (EXKEY ? "для ОГЭ по математике" : "по профильной математике") + '. Показать за полминуты, как всё устроено?</p>';
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

  /* ---------- своя клавиатура для ответа: на телефонах у системной часто нет минуса ---------- */
  var TOUCH = !!(window.matchMedia && matchMedia("(pointer: coarse)").matches);
  var KB = null, kbInput = null;
  function prepAnswers(root) {
    if (!TOUCH) return;
    (root || document).querySelectorAll(".ans").forEach(function (i) { i.setAttribute("inputmode", "none"); });
  }
  prepAnswers();

  function kbBuild() {
    var keys = [["1"], ["2"], ["3"], ["back", "⌫", "fn", "Стереть"], ["4"], ["5"], ["6"], ["-", "−", "fn", "Минус"],
      ["7"], ["8"], ["9"], [",", ",", "fn", "Запятая"], ["hide", "Скрыть", "fn"], ["0"], ["go", "Проверить", "go"]];
    KB = document.createElement("div");
    KB.className = "kb"; KB.setAttribute("role", "group"); KB.setAttribute("aria-label", "Клавиатура для ответа");
    KB.innerHTML = '<div class="kb-grid">' + keys.map(function (k) {
      return '<button type="button" tabindex="-1" data-k="' + k[0] + '"' + (k[2] ? ' class="' + k[2] + '"' : "") +
        (k[3] ? ' aria-label="' + k[3] + '"' : "") + ">" + (k[1] || k[0]) + "</button>";
    }).join("") + "</div>";
    document.body.appendChild(KB);
    // pointerdown + preventDefault: поле ответа не теряет фокус, системная клавиатура не выскакивает
    KB.addEventListener("pointerdown", function (e) {
      var b = e.target.closest("button"); e.preventDefault();
      if (b) kbPress(b.getAttribute("data-k"));
    });
    KB.addEventListener("click", function (e) { e.preventDefault(); });
  }
  function kbShow(input) {
    if (!KB) kbBuild();
    if (kbInput && kbInput !== input) kbInput.classList.remove("kb-focus");
    kbInput = input; input.classList.add("kb-focus");
    KB.classList.add("on"); document.body.classList.add("kb-open");
    setTimeout(function () {
      var r = input.getBoundingClientRect(), free = innerHeight - KB.offsetHeight - 24;
      if (r.bottom > free) scrollBy({ top: r.bottom - free, behavior: "smooth" });
      else if (r.top < 70) scrollBy({ top: r.top - 90, behavior: "smooth" });
    }, 30);
  }
  function kbHide() {
    if (!KB) return;
    KB.classList.remove("on"); document.body.classList.remove("kb-open");
    if (kbInput) { kbInput.classList.remove("kb-focus"); kbInput.blur(); }
    kbInput = null;
  }
  function kbPress(k) {
    var i = kbInput; if (!i) return;
    if (k === "hide") { kbHide(); return; }
    if (k === "go") { check(i.closest(".task")); return; }
    var v = i.value, a = i.selectionStart == null ? v.length : i.selectionStart, b = i.selectionEnd == null ? v.length : i.selectionEnd;
    if (k === "back") {
      if (a === b && a > 0) a -= 1;
      v = v.slice(0, a) + v.slice(b);
    } else {
      v = v.slice(0, a) + k + v.slice(b); a += k.length;
    }
    i.value = v;
    try { i.setSelectionRange(a, a); } catch (e) { /* старые браузеры */ }
    var out = i.closest(".task").querySelector(".verdict");
    if (out) { out.textContent = ""; out.className = "verdict"; }
  }
  if (TOUCH) {
    document.addEventListener("focusin", function (e) {
      if (e.target.classList && e.target.classList.contains("ans")) kbShow(e.target);
    });
    document.addEventListener("click", function (e) {
      if (e.target.classList && e.target.classList.contains("ans") && (!KB || !KB.classList.contains("on"))) kbShow(e.target);
    });
    document.addEventListener("focusout", function () {
      setTimeout(function () {
        var a = document.activeElement;
        if (!(a && a.classList && a.classList.contains("ans"))) kbHide();
      }, 0);
    });
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
    var good = same(input.value, right);
    if (good) { out.textContent = "Верно"; out.classList.add("ok"); }
    else { out.textContent = "Неверно"; out.classList.add("bad"); }
    // для статистики в личном кабинете (account.js), если пользователь вошёл
    try { task.dispatchEvent(new CustomEvent("mb:check", { bubbles: true, detail: { ok: good, answer: input.value.trim() } })); } catch (e) {}
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


  /* ---------- ошибки и отзывы ---------- */
  var FB = {};
  try { FB = JSON.parse((document.getElementById("feedback-cfg") || {}).textContent || "{}"); } catch (e) { FB = {}; }

  function openFeedback(task) {
    var tid = task ? task.id.replace(/^t/, "") : "";
    var where = location.href.split("#")[0] + (tid ? "#t" + tid : "");
    var el = document.createElement("div");
    el.className = "notice fb";
    var info = tid ? '<div class="fb-id">Задача <b>' + tid + '</b> <button type="button" class="fb-copy">Скопировать номер</button></div>' : "";
    var main;
    if (FB.form) {
      var google = /docs\.google\.com\/forms/.test(FB.form);
      var u = FB.form + (FB.form.indexOf("?") < 0 ? "?" : "&") +
        (google ? "embedded=true" : "iframe=1&task=" + encodeURIComponent(tid) + "&page=" + encodeURIComponent(where));
      main = '<iframe class="fb-frame" src="' + u + '" title="Форма обратной связи"></iframe>';
    } else {
      var links = (FB.tg ? '<a class="btn red" target="_blank" rel="noopener" href="' + FB.tg + '">Написать в Телеграм</a>' : "") +
                  (FB.vk ? '<a class="btn ghost" target="_blank" rel="noopener" href="' + FB.vk + '">Написать ВКонтакте</a>' : "");
      main = '<p>' + (tid ? "Опишите, что не так с задачей: опечатка в условии, неверный ответ, не виден рисунок. Номер задачи укажите в сообщении." :
             "Напишите, что не работает, чего не хватает или что понравилось — мы читаем всё.") + '</p>' +
             '<div class="notice-actions">' + (links || '<p class="wait">Контакты скоро появятся.</p>') + '</div>';
    }
    el.innerHTML = '<div class="notice-box fb-box" role="dialog" aria-modal="true" aria-labelledby="fb-title">' +
      '<button class="notice-x" type="button" aria-label="Закрыть">×</button>' +
      '<h2 id="fb-title">' + (tid ? "Нашли ошибку?" : "Отзыв и поддержка") + '</h2>' + info + main + '</div>';
    document.body.appendChild(el);
    function close() { el.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    el.addEventListener("click", function (e) {
      if (e.target === el || e.target.closest(".notice-x")) return close();
      var c = e.target.closest(".fb-copy");
      if (c) {
        var done = function () { c.textContent = "Скопировано"; };
        if (navigator.clipboard) navigator.clipboard.writeText(tid).then(done, done); else done();
      }
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest && t.closest("[data-feedback]")) { e.preventDefault(); openFeedback(null); return; }
    if (t.classList && t.classList.contains("report")) { openFeedback(t.closest(".task")); }
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

  /* ---------- общее для «Варианта» и «Тренировки» ---------- */
  var cache = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function load(no) {
    if (cache[no]) return Promise.resolve(cache[no]);
    return fetch("../data/" + no + ".json").then(function (r) { return r.json(); }).then(function (d) { cache[no] = d; return d; });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  // label — что написать слева (номер ЕГЭ или порядковый), withSrc — подпись источника над условием
  function taskHtml(n, t, label, withSrc) {
    var tools = (n.part === 1
      ? '<input class="ans" type="text" inputmode="' + (TOUCH ? "none" : "decimal") + '" autocomplete="off" placeholder="Ваш ответ" aria-label="Ответ к заданию ' + n.no + '">' +
        '<button class="pill check" type="button">Проверить</button><span class="verdict" aria-live="polite"></span>'
      : "") + '<button class="pill sol-btn" type="button" aria-expanded="false">Решение</button>' +
      '<button class="pill draw-btn" type="button" aria-pressed="false">Черновик</button>' +
      '<button class="report" type="button">Нашли ошибку?</button>';
    var own = t.src && t.src !== "fipi";
    var lab = n.lab || n.no;
    var href = own ? "#t" + esc(t.id) : "../" + (n.slug || "zadanie-" + n.no) + "/#t" + esc(t.id);
    return '<article class="task" id="t' + esc(t.id) + '" data-a="' + esc(t.a) + '" data-no="' + n.no + '" data-src="' + esc(t.src || "fipi") + '">' +
      '<a class="idx" href="' + href + '" title="' + esc(n.title) + " · " + esc(t.lab || "банк ФИПИ: " + t.id) + '">' + esc(label == null ? lab : label) + '</a>' +
      '<div class="body">' + (withSrc ? '<span class="srcl' + (own ? " own" : "") + '">№ ' + lab + " · " + esc(t.lab || "Банк ФИПИ") + "</span>" : "") +
      t.html + '<div class="tools">' + tools + '</div><div class="sol" hidden>' + (t.sol || "") + '</div></div></article>';
  }
  function typeset(el) { if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([el]).catch(function () {}); }
  // таблица ответов в конец распечатки
  function printWithKeys(list, keys, withAns) {
    if (withAns) {
      var rows = "";
      list.querySelectorAll(".task").forEach(function (t) {
        var no = t.querySelector(".idx").textContent, a = decode(t.getAttribute("data-a"));
        if (a) rows += "<tr><td>" + esc(no) + "</td><td>" + esc(a.split("|")[0]) + "</td></tr>";
      });
      keys.innerHTML = rows ? "<h2>Ответы</h2><table>" + rows + "</table>" : "";
      keys.hidden = !rows;
    } else { keys.hidden = true; }
    window.print();
  }

  /* ---------- случайный вариант (только банк ФИПИ) ---------- */
  var box = document.getElementById("variant");
  if (box) {
    var nums = JSON.parse(box.getAttribute("data-nums"));
    var build = function () {
      box.innerHTML = '<p class="wait" style="padding:24px 0">Собираю вариант…</p>';
      Promise.all(nums.map(function (n) { return load(n.no); })).then(function (lists) {
        var html = "";
        nums.forEach(function (n, i) {
          var list = lists[i].filter(function (t) { return !t.src || t.src === "fipi"; });
          if (!list.length) list = lists[i];  // банка ФИПИ к номеру нет — берём аналоги
          if (!list.length) return;
          html += taskHtml(n, list[Math.floor(Math.random() * list.length)]);
        });
        box.innerHTML = html;
        typeset(box);
      }).catch(function () {
        box.innerHTML = '<p class="wait" style="padding:24px 0">Не удалось загрузить задания. Обновите страницу.</p>';
      });
    };
    document.getElementById("vnew").addEventListener("click", build);
    document.getElementById("vprint").addEventListener("click", function () {
      printWithKeys(box, document.getElementById("vkeys"), document.getElementById("vanswers").checked);
    });
    build();
  }

  /* ---------- тренировка: свои подборки ---------- */
  var tr = document.getElementById("train");
  if (tr) {
    var NUMS = JSON.parse(tr.getAttribute("data-nums")), SRC = JSON.parse(tr.getAttribute("data-src"));
    var MAXN = 30;
    var st = { no: NUMS.length ? NUMS[0].no : 0, src: SRC.map(function (s) { return s.key; }), count: 5 };
    try {
      var saved = JSON.parse(store(EXKEY + "train") || "null");
      if (saved) {
        if (saved.no === "all" || NUMS.some(function (n) { return n.no === saved.no; })) st.no = saved.no;
        var ok = (saved.src || []).filter(function (k) { return SRC.some(function (s) { return s.key === k; }); });
        if (ok.length) st.src = ok;
        if (saved.count >= 1 && saved.count <= MAXN) st.count = saved.count;
      }
    } catch (e) { /* без сохранённых настроек */ }
    var $n = document.getElementById("trNums"), $s = document.getElementById("trSrc"), $c = document.getElementById("trCount"),
      $avail = document.getElementById("trAvail"), $row = document.getElementById("trCountRow"),
      $list = document.getElementById("trList"), $sum = document.getElementById("trSum"),
      $all = document.getElementById("trAll"), $print = document.getElementById("trPrint");
    var numOf = function (no) { return NUMS.find(function (n) { return n.no === no; }); };
    var countFor = function (key) {
      if (st.no === "all") return NUMS.filter(function (n) { return n.counts[key]; }).length;
      var n = numOf(st.no); return n ? n.counts[key] || 0 : 0;
    };
    var available = function () {
      if (st.no === "all") return NUMS.filter(function (n) { return st.src.some(function (k) { return n.counts[k]; }); }).length;
      return st.src.reduce(function (a, k) { return a + countFor(k); }, 0);
    };
    var save = function () { store(EXKEY + "train", JSON.stringify(st)); };
    var draw = function () {
      $n.innerHTML = '<button type="button" class="chip wide' + (st.no === "all" ? " on" : "") + '" data-no="all">Весь вариант</button>' +
        NUMS.map(function (n) {
          return '<button type="button" class="chip' + (st.no === n.no ? " on" : "") + '" data-no="' + n.no + '" title="' + esc(n.title) + '">' + (n.lab || n.no) + "</button>";
        }).join("");
      $s.innerHTML = SRC.map(function (s) {
        var c = countFor(s.key), on = st.src.indexOf(s.key) >= 0;
        return '<button type="button" class="chip src' + (on ? " on" : "") + '" data-src="' + s.key + '" aria-pressed="' + on + '"' + (c ? "" : " disabled") + ">" +
          esc(s.name) + "<i>" + c + "</i></button>";
      }).join("");
      var av = available();
      $row.hidden = st.no === "all";
      $all.disabled = st.no === "all";
      $c.textContent = Math.min(st.count, Math.max(av, 1));
      $avail.textContent = st.no === "all"
        ? "по одной задаче на каждый номер"
        : (av ? "всего подходит " + av : "нет задач — выберите другой источник") + (numOf(st.no) ? " · " + numOf(st.no).title : "");
    };
    var nOf = function (no) { var n = numOf(no); return { no: no, lab: n.lab, slug: n.slug, part: n.part, title: n.title }; };
    var pick = function (list) { return list.filter(function (t) { return st.src.indexOf(t.src || "fipi") >= 0; }); };
    var srcNames = function () { return SRC.filter(function (s) { return st.src.indexOf(s.key) >= 0; }).map(function (s) { return s.name; }).join(", "); };
    var show = function (html, sum) {
      $sum.innerHTML = sum; $sum.hidden = false;
      $list.innerHTML = html || '<p class="wait" style="padding:24px 0">Под эти условия задач нет.</p>';
      $list.hidden = false; $print.disabled = !html;
      prepAnswers($list); typeset($list);
      $sum.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    var run = function (all) {
      if (!st.src.length) { $avail.textContent = "Выберите хотя бы один источник"; return; }
      $list.hidden = false; $list.innerHTML = '<p class="wait" style="padding:24px 0">Собираю…</p>';
      if (st.no === "all") {
        Promise.all(NUMS.map(function (n) { return load(n.no); })).then(function (lists) {
          var html = "", k = 0;
          NUMS.forEach(function (n, i) {
            var l = pick(lists[i]); if (!l.length) return;
            html += taskHtml(nOf(n.no), l[Math.floor(Math.random() * l.length)], n.no, true); k++;
          });
          show(html, "<b>Вариант</b> · " + k + " " + word(k) + " · " + esc(srcNames()));
        }).catch(fail);
        return;
      }
      load(st.no).then(function (list) {
        var l = pick(list);
        if (!all) l = shuffle(l).slice(0, st.count);
        var n = nOf(st.no);
        show(l.map(function (t, i) { return taskHtml(n, t, i + 1, true); }).join(""),
          "<b>№ " + (n.lab || n.no) + " · " + esc(n.title) + "</b> · " + l.length + " " + word(l.length) + " · " + esc(srcNames()) + (all ? "" : " · в случайном порядке"));
      }).catch(fail);
    };
    var fail = function () { $list.innerHTML = '<p class="wait" style="padding:24px 0">Не удалось загрузить задания. Обновите страницу.</p>'; };
    var word = function (n) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? "задача" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "задачи" : "задач"; };

    tr.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b || b.disabled) return;
      if (b.hasAttribute("data-no")) { var v = b.getAttribute("data-no"); st.no = v === "all" ? "all" : +v; }
      else if (b.hasAttribute("data-src")) {
        var k = b.getAttribute("data-src"), i = st.src.indexOf(k);
        if (i >= 0) { if (st.src.length > 1) st.src.splice(i, 1); } else st.src.push(k);
      } else if (b.hasAttribute("data-step")) {
        st.count = Math.max(1, Math.min(MAXN, Math.min(+$c.textContent, available() || 1) + +b.getAttribute("data-step")));
      } else if (b.id === "trGo") { run(false); return; }
      else if (b.id === "trAll") { run(true); return; }
      else if (b.id === "trPrint") { printWithKeys($list, document.getElementById("trKeys"), document.getElementById("trAnswers").checked); return; }
      else return;
      save(); draw();
    });
    draw();
  }
})();

/* Меню-шторка, появление блоков при прокрутке, счётчики на главной */
(function () {
  "use strict";
  var dr = document.getElementById("drawer"), bg = document.getElementById("drawerBg"), btn = document.getElementById("menuBtn");
  if (dr && bg && btn) {
    var last = null;
    var open = function () {
      last = document.activeElement;
      document.documentElement.classList.add("dr-open");
      dr.setAttribute("aria-hidden", "false"); btn.setAttribute("aria-expanded", "true");
      setTimeout(function () { var f = dr.querySelector(".dr-x"); if (f) f.focus(); }, 60);
    };
    var close = function () {
      document.documentElement.classList.remove("dr-open");
      dr.setAttribute("aria-hidden", "true"); btn.setAttribute("aria-expanded", "false");
      if (last && last.focus) last.focus();
    };
    btn.addEventListener("click", open);
    bg.addEventListener("click", close);
    dr.querySelector(".dr-x").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.documentElement.classList.contains("dr-open")) close(); });
    dr.addEventListener("click", function (e) { var a = e.target.closest("a"); if (a && (a.hasAttribute("data-tour") || a.hasAttribute("data-feedback") || a.getAttribute("href").indexOf("#") >= 0)) close(); });
    window.MBDrawer = { open: open, close: close };
  }

  // главная: строка таблицы экзаменов целиком кликабельна
  document.querySelectorAll(".ex-row[data-href]").forEach(function (tr) {
    tr.addEventListener("click", function (e) { if (!e.target.closest("a")) location.href = tr.getAttribute("data-href"); });
  });

  // общая главная: слева предметы, справа номера выбранного экзамена и поиск
  var hd = document.getElementById("hbData");
  if (hd) {
    var EX = JSON.parse(hd.textContent), cur = null;
    var grid = document.getElementById("hbGrid"), msg = document.getElementById("hbMsg"), q = document.getElementById("hbQ");
    var esc2 = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var word = function (n) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? "задача" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "задачи" : "задач"; };
    var byKey = function (k) { return EX.filter(function (e) { return e.key === k; })[0] || EX[0]; };
    var pick = function () {
      var h = location.hash.replace("#", "");
      return EX.filter(function (e) { return e.key === h; })[0] || null;   // без выбора — главное меню
    };
    var render = function () {
      var e = cur, f = (q.value || "").trim().toLowerCase();
      document.getElementById("hbName").textContent = e.name;
      document.getElementById("hbMeta").textContent = e.exam + " " + e.year + " · " + e.count + " заданий · " +
        (e.fipi ? e.fipi + " " + word(e.fipi) + " ФИПИ" : e.an_only + " аналогов, банк ФИПИ скоро");
      document.getElementById("hbAct").innerHTML =
        '<a class="pill" href="' + e.index + '">Все номера и PDF</a><a class="pill" href="' + e.home + 'trenirovka/">Тренировка</a>' +
        '<a class="pill" href="' + e.home + 'variant/">Случайный вариант</a>';
      var shown = 0, html = "";
      [[1, "Часть 1", "краткий ответ"], [2, "Часть 2", "развёрнутый ответ"]].forEach(function (pt) {
        var list = e.nums.filter(function (n) {
          return n.part === pt[0] && (!f || n.title.toLowerCase().indexOf(f) >= 0 || String(n.lab) === f || String(n.no) === f);
        });
        if (!list.length) return;
        shown += list.length;
        var base = shown - list.length;
        html += '<h2 class="hb-part" style="--i:' + base + '">' + pt[1] + "<span>" + pt[2] + "</span></h2><div class=\"hb-grid\">" + list.map(function (n, ii) {
          var soon = !n.n;
          return (soon ? '<div class="card hb-n soon"' : '<a class="card hb-n" href="' + e.home + n.slug + '"') + ' style="--i:' + (base + ii) + '" data-no="' + n.no + '" data-n="' + n.n + '">' +
            '<span class="hb-no">' + esc2(n.lab) + '</span><span class="hb-t">' + esc2(n.title) + "</span>" +
            '<span class="hb-c">' + (soon ? "скоро" : n.n) + "</span>" + (soon ? "</div>" : "</a>");
        }).join("") + "</div>";
      });
      grid.innerHTML = html;
      // поиск по номеру задачи ФИПИ (шесть знаков, например 4A0B1C)
      var idq = f.toUpperCase();
      msg.hidden = true;
      if (/^[0-9A-F]{6}$/.test(idq)) {
        var hit = null;
        EX.forEach(function (x) { Object.keys(x.ids).forEach(function (no) {
          if (!hit && x.ids[no].some(function (id) { return id.toUpperCase() === idq; })) {
            var n = x.nums.filter(function (m) { return String(m.no) === no; })[0];
            hit = { x: x, n: n, id: x.ids[no].filter(function (id) { return id.toUpperCase() === idq; })[0] };
          }
        }); });
        msg.hidden = false;
        msg.innerHTML = hit ? 'Задача ' + esc2(hit.id) + ' — задание ' + esc2(hit.n.lab) + " " + hit.x.exam + ", " + esc2(hit.n.title.toLowerCase()) +
          '. <a href="' + hit.x.home + hit.n.slug + "#t" + esc2(hit.id) + '">Открыть задачу</a>' : "Задачи " + esc2(idq) + " нет в банке.";
        if (hit) msg.setAttribute("data-href", hit.x.home + hit.n.slug + "#t" + hit.id); else msg.removeAttribute("data-href");
      } else if (!shown) {
        msg.hidden = false; msg.removeAttribute("data-href");
        msg.textContent = "По запросу «" + q.value.trim() + "» ничего не нашлось. Введите тему (например, «вероятн») или номер задачи ФИПИ из шести знаков.";
      }
      try { document.dispatchEvent(new CustomEvent("mb:hub", { detail: { exam: e.key } })); } catch (er) {}
    };
    var wel = document.getElementById("hbWelcome"), exv = document.getElementById("hbExam");
    var set = function (e) {
      cur = e;
      wel.hidden = !!e; exv.hidden = !e;
      document.querySelectorAll(".hb-it[data-exam]").forEach(function (a) {
        var on = a.getAttribute("data-exam") === (e ? e.key : "");
        a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      if (e) { q.value = ""; render(); openGroupOf(e.key); }
      var view = e ? exv : wel;
      view.classList.remove("hb-anim"); void view.offsetWidth; view.classList.add("hb-anim");
      clearTimeout(view._t); view._t = setTimeout(function () { view.classList.remove("hb-anim"); }, 1400);
      moveInd();
    };
    // свёртывание групп ЕГЭ / ОГЭ / Ещё (запоминается)
    var side = document.querySelector(".hb-side"), ind = side.querySelector(".hb-ind");
    var closedG = {};
    try { closedG = JSON.parse(localStorage.getItem("hub-closed") || "{}"); } catch (er) {}
    var moveInd = function () {
      var a = side.querySelector("a.hb-it.on");
      if (!a || !a.offsetParent || a.closest(".hb-grp.closed") || getComputedStyle(ind).display === "none") { ind.style.opacity = "0"; return; }
      var sr = side.getBoundingClientRect(), ar = a.getBoundingClientRect();
      ind.style.transform = "translateY(" + (ar.top - sr.top) + "px)"; ind.style.height = ar.height + "px"; ind.style.opacity = "1";
    };
    side.querySelectorAll(".hb-grp").forEach(function (g) {
      var key = g.getAttribute("data-g"), btn = g.querySelector(".hb-gh");
      var apply = function (closed) {
        g.classList.toggle("closed", closed); btn.setAttribute("aria-expanded", closed ? "false" : "true");
      };
      apply(!!closedG[key]);
      btn.addEventListener("click", function () {
        var closed = !g.classList.contains("closed");
        apply(closed); closedG[key] = closed;
        try { localStorage.setItem("hub-closed", JSON.stringify(closedG)); } catch (er) {}
        var t0 = performance.now();
        (function follow() { moveInd(); if (performance.now() - t0 < 420) requestAnimationFrame(follow); })();
      });
    });
    var openGroupOf = function (key) {
      var a = side.querySelector('a.hb-it[data-exam="' + key + '"]'), g = a && a.closest(".hb-grp");
      if (g && g.classList.contains("closed")) g.querySelector(".hb-gh").click();
    };
    window.addEventListener("resize", moveInd);
    document.querySelectorAll("[data-exam]").forEach(function (a) {
      if (a.tagName !== "A") return;
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        var k = a.getAttribute("data-exam");
        history.pushState(null, "", k ? "#" + k : location.pathname);
        set(k ? byKey(k) : null);
        window.scrollTo(0, 0);
      });
    });
    window.addEventListener("popstate", function () { set(pick()); });
    // сменяющаяся строка на главной: цифры → новость → факт…; текст «печатается»
    var tk = document.getElementById("tick"), tdata = document.getElementById("tickData");
    if (tk && tdata) {
      var slides = JSON.parse(tdata.textContent), dots = document.getElementById("tickDots");
      var calm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      var at = 0, timer = null, typing = null, paused = false;
      dots.innerHTML = slides.map(function (_, k) { return '<button type="button" role="tab" aria-label="' + (k + 1) + '"></button>'; }).join("");
      var dotEls = dots.querySelectorAll("button");
      var build = function (sl) {
        var el = document.createElement("div");
        el.className = "tick-slide" + (sl.kind === "stats" ? "" : " msg");
        el.setAttribute("data-kind", sl.kind);
        if (sl.kind === "stats") {
          el.innerHTML = sl.items.map(function (x) { return '<div class="tick-st"><b>' + x[0] + "</b><span>" + esc2(x[1]) + "</span></div>"; }).join("");
        } else {
          el.innerHTML = '<span class="tick-lab">' + esc2(sl.label) + '</span><span class="tick-txt"></span>';
        }
        return el;
      };
      var show = function (k) {
        clearTimeout(timer); clearInterval(typing);
        at = (k + slides.length) % slides.length;
        var old = tk.querySelector(".tick-slide.on");
        var el = build(slides[at]);
        tk.appendChild(el);
        if (old) { old.classList.remove("on"); old.classList.add("out"); setTimeout(function () { old.remove(); }, 600); }
        requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("on"); }); });
        dotEls.forEach(function (d, n) { d.classList.toggle("on", n === at); d.setAttribute("aria-selected", n === at ? "true" : "false"); });
        var hold = 5200;
        if (slides[at].kind !== "stats") {
          var tx = el.querySelector(".tick-txt"), full = slides[at].text, c = 0;
          if (calm) { tx.textContent = full; tx.classList.add("done"); }
          else {
            typing = setInterval(function () {
              c += 1; tx.textContent = full.slice(0, c);
              if (c >= full.length) { clearInterval(typing); tx.classList.add("done"); }
            }, 26);
            hold = 26 * full.length + 3600;
          }
        }
        var next = function () { if (paused) { timer = setTimeout(next, 800); return; } show(at + 1); };
        timer = setTimeout(next, hold);
      };
      tk.innerHTML = "";
      dotEls.forEach(function (d, n) { d.addEventListener("click", function () { show(n); }); });
      var hello2 = document.getElementById("hbWelcome");
      hello2.addEventListener("pointerenter", function () { paused = true; });
      hello2.addEventListener("pointerleave", function () { paused = false; });
      show(0);
    }
    q.addEventListener("input", render);
    document.getElementById("hbSearch").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var h = msg.getAttribute("data-href");
      if (h) { location.href = h; return; }
      var first = grid.querySelector("a.hb-n");
      if (first && q.value.trim()) location.href = first.getAttribute("href");
    });
    set(pick());
  }
})();
