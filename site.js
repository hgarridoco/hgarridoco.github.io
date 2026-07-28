(() => {
  const doc = document.documentElement;

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const THEME_KEY = "hg-theme";

  const readStoredTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  };

  const applyTheme = (theme) => {
    const nextTheme = theme === "light" ? "light" : "dark";
    doc.setAttribute("data-theme", nextTheme);

    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      /* ignore */
    }

    document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
      const nextLabel = nextTheme === "light" ? "oscuro" : "claro";
      toggle.setAttribute("aria-label", `Activar modo ${nextLabel}`);
      toggle.setAttribute("aria-pressed", nextTheme === "light" ? "true" : "false");
      toggle.title = `Modo ${nextLabel}`;

      const legacyLabel = toggle.querySelector("[data-theme-label]");
      if (legacyLabel) {
        legacyLabel.textContent = nextTheme === "light" ? "Oscuro" : "Claro";
      }
    });

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", nextTheme === "light" ? "#eef3f4" : "#0b1c24");
    }
  };

  const stored = readStoredTheme();
  applyTheme(stored === "light" || stored === "dark" ? stored : "dark");

  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const current = doc.getAttribute("data-theme") === "light" ? "light" : "dark";
      applyTheme(current === "light" ? "dark" : "light");
    });
  });

  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-copy-email");
      if (!email) return;

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
  const revealMeters = () => {
    if (metersRoot) metersRoot.classList.add("is-animated");
  };

  const revealEls = document.querySelectorAll(".reveal");

  const inView = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    revealEls.forEach((el) => {
      if (inView(el)) el.classList.add("is-visible");
      else io.observe(el);
    });

    if (metersRoot) {
      if (inView(metersRoot)) {
        revealMeters();
      } else {
        const meterIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              revealMeters();
              meterIo.disconnect();
            });
          },
          { threshold: 0.15 }
        );
        meterIo.observe(metersRoot);
      }
    }
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    revealMeters();
  }
})();
