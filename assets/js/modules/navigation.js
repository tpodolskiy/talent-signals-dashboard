const MOBILE_BREAKPOINT = 768;

export function initNavigation() {
  const nav = document.querySelector(".nav");
  const toggle = nav?.querySelector(".nav-toggle");
  const links = nav?.querySelector(".nav-links");
  const backdrop = document.querySelector("[data-nav-backdrop]");

  if (!nav || !toggle || !links || !backdrop) return;

  const closeNav = () => {
    links.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    backdrop.setAttribute("aria-hidden", "true");
  };

  const openNav = () => {
    links.classList.add("open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    backdrop.setAttribute("aria-hidden", "false");
  };

  const toggleNav = () => {
    if (links.classList.contains("open")) {
      closeNav();
    } else {
      openNav();
    }
  };

  toggle.addEventListener("click", toggleNav);
  backdrop.addEventListener("click", closeNav);

  links.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) closeNav();
    });
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeNav();
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("open")) {
      closeNav();
    }
  });

  closeNav();
}
