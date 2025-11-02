export function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return match;
    }
  });
}

export function formatMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;
  const paragraphBuffer = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    const text = paragraphBuffer.join(" ").trim();
    if (text) html.push(`<p>${escapeHtml(text)}</p>`);
    paragraphBuffer.length = 0;
  };

  const closeListIfNeeded = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  lines.forEach((line) => {
    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      const item = line.replace(/^\s*[-*]\s+/, "");
      html.push(`<li>${escapeHtml(item)}</li>`);
      return;
    }

    if (line.trim() === "") {
      flushParagraph();
      closeListIfNeeded();
      return;
    }

    paragraphBuffer.push(line.trim());
  });

  flushParagraph();
  closeListIfNeeded();

  return html.join("");
}

export function matchesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function formatChatbotResponse({ title, summary, bullets = [], followUp = "" }) {
  let html = `<strong>${title}</strong><br>${summary}`;
  if (bullets.length) {
    html += "<ul>";
    bullets.forEach((item) => {
      html += `<li>${item}</li>`;
    });
    html += "</ul>";
  }
  if (followUp) {
    html += `<p class="chatbot-followup">${followUp}</p>`;
  }
  return html;
}
