const focusableSelectors =
  'a[href], button:not([disabled]), [tabindex="0"], input, textarea, select';

export function initContactModal() {
  const modal = document.getElementById("contact-modal");
  if (!modal) return;

  const triggers = document.querySelectorAll("[data-contact-trigger]");
  const closers = modal.querySelectorAll("[data-contact-close]");
  const dialog = modal.querySelector(".contact-modal__dialog");
  let lastFocusedElement = null;

  const openModal = () => {
    if (modal.getAttribute("aria-hidden") === "false") return;
    const navLinks = document.querySelector("[data-nav-links]");
    const navToggle = document.querySelector(".nav-toggle");
    navLinks?.classList.remove("open");
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    lastFocusedElement = document.activeElement;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-open");
    lockScroll();
    focusFirstElement();
  };

  const closeModal = () => {
    if (modal.getAttribute("aria-hidden") === "true") return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-open");
    unlockScroll();
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
    if (event.key === "Tab") {
      trapFocus(event);
    }
  };

  const trapFocus = (event) => {
    const focusable = dialog.querySelectorAll(focusableSelectors);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const focusFirstElement = () => {
    const focusable = dialog.querySelectorAll(focusableSelectors);
    if (focusable.length) focusable[0].focus();
  };

  const lockScroll = () => {
    document.body.dataset.scrollPosition = window.scrollY.toString();
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    const scrollPosition = parseInt(document.body.dataset.scrollPosition || "0", 10);
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("width");
    window.scrollTo({ top: scrollPosition, behavior: "auto" });
    delete document.body.dataset.scrollPosition;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", openModal);
  });

  closers.forEach((closer) => {
    closer.addEventListener("click", closeModal);
  });

  modal.addEventListener("keydown", handleKeydown);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener("transitionend", () => {
    if (modal.getAttribute("aria-hidden") === "true") {
      dialog.scrollTop = 0;
    }
  });
}
