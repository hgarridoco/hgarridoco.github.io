(() => {
  const doc = document.documentElement;
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const THEME_KEY = "hg-theme";
  const stored = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();

  const applyTheme = (theme) => {
    doc.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const next = theme === "light" ? "dark" : "light";
      toggle.setAttribute("aria-label", `Activar modo ${next === "light" ? "claro" : "oscuro"}`);
      toggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
      toggle.querySelector("[data-theme-label]").textContent =
        theme === "light" ? "Oscuro" : "Claro";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#eef3f4" : "#0b1c24");
  };

  applyTheme(stored === "light" || stored === "dark" ? stored : "dark");

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    applyTheme(doc.getAttribute("data-theme") === "light" ? "dark" : "light");
  });

  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-copy-email");
      const label = btn.querySelector("[data-copy-label]") || btn;
      const original = label.textContent;
      try {
        await navigator.clipboard.writeText(email);
        label.textContent = "Copiado";
        btn.classList.add("is-copied");
      } catch {
        label.textContent = "Error";
      }
      window.setTimeout(() => {
        label.textContent = original;
        btn.classList.remove("is-copied");
      }, 1600);
    });
  });

  const metersRoot = document.querySelector("[data-skill-meters]");
  const revealMeters = () => metersRoot?.classList.add("is-animated");

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (entry.target === metersRoot || entry.target.contains(metersRoot)) {
            revealMeters();
          }
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    if (metersRoot) {
      const meterIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealMeters();
              meterIo.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      meterIo.observe(metersRoot);
    }
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    revealMeters();
  }
})();
