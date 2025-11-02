export function setCurrentYear() {
  const yearSpans = document.querySelectorAll("#year");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => {
    span.textContent = currentYear;
  });
}
