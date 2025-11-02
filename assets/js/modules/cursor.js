export function initCursor() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointerFine = window.matchMedia("(pointer: fine)").matches;

  if (!pointerFine || prefersReducedMotion) {
    document.body.classList.remove("cursor-enabled");
    document.body.style.cursor = "auto";
    return;
  }

  document.body.classList.add("cursor-enabled");

  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.dataset.variant = "default";

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";

  cursor.append(ring, dot);
  document.body.appendChild(cursor);

  let targetX = -100;
  let targetY = -100;
  let currentX = targetX;
  let currentY = targetY;

  const render = () => {
    currentX += (targetX - currentX) * 0.6;
    currentY += (targetY - currentY) * 0.6;
    cursor.style.setProperty("--cursor-x", currentX.toFixed(2));
    cursor.style.setProperty("--cursor-y", currentY.toFixed(2));
    requestAnimationFrame(render);
  };
  render();

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!cursor.classList.contains("is-visible")) cursor.classList.add("is-visible");
    },
    { passive: true }
  );

  window.addEventListener("pointerdown", () => {
    cursor.dataset.active = "down";
  });

  const clearActive = () => {
    delete cursor.dataset.active;
  };

  window.addEventListener("pointerup", clearActive);
  window.addEventListener("pointercancel", clearActive);
  window.addEventListener("blur", clearActive);

  const setVariant = (variant) => {
    cursor.dataset.variant = variant;
  };

  const interactiveSelectors = [
    "a",
    "button",
    ".cta-button",
    ".chip",
    ".chatbot-toggle",
    ".chatbot-send",
    ".chatbot-history .chatbot-message"
  ];

  const mediaSelectors = [".chart-wrapper canvas", ".cards-grid article", ".stat-card"];

  const bindVariant = (elements, variant) => {
    elements.forEach((element) => {
      element.style.cursor = "none";
      element.addEventListener("pointerenter", () => setVariant(variant));
      element.addEventListener("pointerleave", () => setVariant("default"));
    });
  };

  bindVariant(document.querySelectorAll(interactiveSelectors.join(", ")), "interactive");
  bindVariant(document.querySelectorAll(mediaSelectors.join(", ")), "media");

  setVariant("default");
}
