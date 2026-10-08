document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Typing effect (roles only) */
  const typed = $("#typed");
  const words = ["clean websites", "responsive layouts", "modern interfaces"];
  let w = 0, c = 0, del = false;
  (function type() {
    if (reduce) return;
    const word = words[w];
    typed.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(type, 1600); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; return setTimeout(type, 350); }
    c += del ? -1 : 1;
    setTimeout(type, del ? 35 : 80);
  })();

  /* Scroll reveal */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      if (e.target.classList.contains("skill")) $(".progress", e.target).classList.add("on");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$(".section-title,.about-content,.numbers,.service-box,.resume-box,.skill,.portfolio-item,.testimonial-box,.contact-content")
    .forEach((el) => { el.classList.add("reveal"); io.observe(el); });

  /* Counters */
  const co = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      let start = null;
      const step = (t) => {
        start ??= t;
        const p = Math.min((t - start) / 1000, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      co.unobserve(el);
    });
  }, { threshold: 0.7 });
  $$("[data-count]").forEach((el) => co.observe(el));

  /* Active nav */
  const sections = $$("main section[id]");
  const links = $$("#nav a");
  const update = () => {
    let cur = sections[0].id;
    sections.forEach((s) => { if (scrollY + 200 >= s.offsetTop) cur = s.id; });
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + cur));
  };
  addEventListener("scroll", update, { passive: true });
  update();

  /* Mobile menu */
  const nav = $("#nav"), toggle = $(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.forEach((l) => l.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* Lightbox */
  const box = $("#lightbox"), big = $("img", box);
  $$(".portfolio-item").forEach((item) => item.addEventListener("click", () => {
    const img = $("img", item);
    big.src = img.src; big.alt = img.alt;
    box.showModal();
  }));
  box.addEventListener("click", (e) => { if (e.target !== big) box.close(); });

  /* Contact form: opens the visitor's email app with the message filled in */
  const form = $(".contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const body = `${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`;
    location.href = `mailto:shrouk.abdelaleem.study@gmail.com?subject=${encodeURIComponent("Portfolio message from " + d.get("name"))}&body=${encodeURIComponent(body)}`;
    form.reset();
  });
});