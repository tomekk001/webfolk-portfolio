// WebFolk: wycinanka w nagłówku strony i drobne udogodnienia.
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var COLORS = ["--malwa", "--kobalt", "--zielen", "--slonce"];
  var svg = document.getElementById("rosette");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(name, attrs, parent) {
    var node = document.createElementNS(NS, name);
    for (var key in attrs) node.setAttribute(key, attrs[key]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // Liść wycinanki skierowany w górę, od środka (0,0) do -len.
  function leaf(len, width) {
    var w = width, a = len * 0.3, b = len * 0.72;
    return "M0 0C" + w + " -" + a + " " + w + " -" + b + " 0 -" + len +
           "C-" + w + " -" + b + " -" + w + " -" + a + " 0 0Z";
  }

  // Kursor myszy, czubkiem do środka.
  var CURSOR = "M0 0L0 -26L7 -19L12 -30L17 -28L12 -17L22 -17Z";
  // Nawias kątowy otwarty na zewnątrz.
  var BRACKET = "M-9 -6L0 -16L9 -6";

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function fill(c) { return "fill:var(" + c + ")"; }

  function draw(opts) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var n = opts.n, c = opts.colors, step = 360 / n;

    // Warstwa 1: pierścień pikseli
    var px = el("g", { "class": "layer" }, svg);
    for (var i = 0; i < n * 3; i++) {
      el("rect", {
        x: -5, y: -181, width: 10, height: 10,
        transform: "rotate(" + (i * 360 / (n * 3)) + ") rotate(45 0 -176)",
        style: fill(c[3])
      }, px);
    }

    // Warstwa 2: małe liście na obwodzie
    var outer = el("g", { "class": "layer" }, svg);
    for (i = 0; i < n * 2; i++) {
      var g = el("g", { transform: "rotate(" + (i * step / 2 + step / 4) + ") translate(0 -118)" }, outer);
      el("path", { d: leaf(40, 11), style: fill(i % 2 ? c[1] : c[2]) }, g);
    }

    // Warstwa 3: główne płatki z wyciętym środkiem
    var main = el("g", { "class": "layer" }, svg);
    for (i = 0; i < n; i++) {
      var p = el("g", { transform: "rotate(" + (i * step) + ")" }, main);
      el("path", { d: leaf(150, opts.wide), style: fill(c[0]) }, p);
      el("path", { d: leaf(78, opts.wide * 0.38), transform: "translate(0 -44)", style: "fill:var(--r-bg)" }, p);
      el("rect", { x: -6, y: -126, width: 12, height: 12, transform: "rotate(45 0 -120)", style: fill(c[3]) }, p);
    }

    // Warstwa 4: kursory i nawiasy między płatkami
    var web = el("g", { "class": "layer" }, svg);
    for (i = 0; i < n; i++) {
      var angle = i * step + step / 2;
      if (i % 2 === 0) {
        el("path", {
          d: CURSOR,
          transform: "rotate(" + angle + ") translate(0 -72) rotate(180) translate(-11 0)",
          style: fill(c[1]) + ";stroke:var(--r-bg);stroke-width:2;stroke-linejoin:round"
        }, web);
      } else {
        el("path", {
          d: BRACKET,
          transform: "rotate(" + angle + ") translate(0 -66)",
          style: "fill:none;stroke:var(" + c[2] + ");stroke-width:6;stroke-linecap:round;stroke-linejoin:round"
        }, web);
      }
    }

    // Warstwa 5: środek
    var core = el("g", { "class": "layer" }, svg);
    el("circle", { r: 36, style: fill(c[2]) }, core);
    el("circle", { r: 24, style: "fill:var(--r-bg)" }, core);
    el("rect", { x: -11, y: -11, width: 22, height: 22, transform: "rotate(45)", style: fill(c[0]) }, core);

    if (!reduceMotion) {
      svg.classList.remove("unfold");
      void svg.getBoundingClientRect();
      svg.classList.add("unfold");
    }
  }

  if (svg) {
    draw({ n: 8, wide: 30, colors: ["--r1", "--r2", "--r3", "--r4"] });

    var btn = document.getElementById("recut");
    var last = 8;
    if (btn) {
      btn.addEventListener("click", function () {
        var counts = [6, 8, 10, 12].filter(function (x) { return x !== last; });
        last = counts[Math.floor(Math.random() * counts.length)];
        draw({ n: last, wide: last <= 6 ? 38 : last >= 12 ? 20 : 28, colors: shuffle(COLORS) });
      });
    }
  }

  // Kopiowanie adresu e-mail i numeru telefonu
  document.querySelectorAll(".copy").forEach(function (button) {
    var original = button.textContent;
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy");
      function done(msg) {
        button.textContent = msg;
        setTimeout(function () { button.textContent = original; }, 1800);
      }
      function fallback() {
        var value = button.parentNode.querySelector(".way__value");
        var range = document.createRange();
        range.selectNodeContents(value);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        done("Zaznaczono, skopiuj ręcznie");
      }
      try {
        navigator.clipboard.writeText(text).then(function () { done("Skopiowano"); }, fallback);
      } catch (e) { fallback(); }
    });
  });


  // Formularz: składa wiadomość i otwiera program pocztowy
  var form = document.getElementById("cform");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = document.getElementById("f-err");
      var name = form.elements.name.value.trim(), contact = form.elements.contact.value.trim();
      if (!name || !contact) { err.hidden = false; err.textContent = "Wpisz imię i telefon albo e-mail, żebym mógł odpowiedzieć."; return; }
      if (!document.getElementById("f-rodo").checked) { err.hidden = false; err.textContent = "Zaznacz zgodę na użycie danych do odpowiedzi."; return; }
      err.hidden = true;
      var type = form.elements.type.value, msg = form.elements.message.value.trim();
      var body = "Imię: " + name + "\nKontakt: " + contact + "\nTemat: " + type + "\n\n" + msg;
      window.location.href = "mailto:kontakt@webfolk.pl?subject=" + encodeURIComponent("Zapytanie ze strony: " + type) + "&body=" + encodeURIComponent(body);
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
