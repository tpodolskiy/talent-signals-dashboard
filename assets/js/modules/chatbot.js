import { escapeHtml, formatMarkdown } from "./chatbot-helpers.js";
import { generateChatbotResponse } from "./chatbot-responses.js";

const chatbotState = {
  open: false,
  sendMessage: null,
  input: null,
  ensureOpen: null
};

export function initChatbot() {
  const toggle = document.querySelector(".chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const input = document.getElementById("chatbot-input");
  const send = document.getElementById("chatbot-send");
  const history = document.getElementById("chatbot-history");
  const closeButton = panel?.querySelector("[data-chatbot-close]");
  const resizeButton = panel?.querySelector("[data-chatbot-resize]");

  if (!toggle || !panel || !input || !send || !history) return;

  chatbotState.input = input;

  const setOpen = (isOpen) => {
    if (chatbotState.open === isOpen) return;
    chatbotState.open = isOpen;
    panel.classList.toggle("open", isOpen);
    panel.setAttribute("aria-hidden", (!isOpen).toString());
    toggle.setAttribute("aria-expanded", isOpen.toString());
    document.body.classList.toggle("chatbot-open", isOpen);
    if (isOpen) {
      setTimeout(() => input.focus(), 100);
    }
  };

  const toggleOpen = () => {
    setOpen(!chatbotState.open);
  };

  chatbotState.ensureOpen = () => setOpen(true);

  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-expanded", "false");

  const updateResizeButton = () => {
    if (!resizeButton) return;
    const expanded = panel.classList.contains("expanded");
    resizeButton.textContent = expanded ? "⇲" : "⇱";
    resizeButton.setAttribute(
      "aria-label",
      expanded ? "Reduce panel size" : "Expand panel size"
    );
    resizeButton.setAttribute("aria-pressed", expanded.toString());
  };

  toggle.addEventListener("click", toggleOpen);

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      setOpen(false);
    });
  }

  if (resizeButton) {
    resizeButton.addEventListener("click", () => {
      panel.classList.toggle("expanded");
      updateResizeButton();
    });
    updateResizeButton();
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbotState.open) {
      event.preventDefault();
      setOpen(false);
    }
  });

  const handleSend = async (messageOverride) => {
    chatbotState.ensureOpen?.();
    const rawInput = typeof messageOverride === "string" ? messageOverride : input.value;
    const message = (rawInput || "").trim();
    if (!message) return;

    appendMessage(history, message, "user");
    input.value = "";

    const placeholder = appendMessage(history, "Synthesizing insights…", "bot", {
      allowHtml: false
    });

    try {
      const reply = await fetchChatbotResponse(message);
      const formatted = formatMarkdown(reply);
      placeholder.innerHTML = formatted || escapeHtml(reply).replace(/\n/g, "<br>");
    } catch (error) {
      console.error("Chatbot request failed", error);
      const fallback = generateChatbotResponse(message);
      placeholder.innerHTML = fallback;
    }
  };

  send.addEventListener("click", () => {
    handleSend();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  });

  chatbotState.sendMessage = (value) => handleSend(value);
}

export function initChips() {
  const chips = document.querySelectorAll(".chip");
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const question = chip.dataset.question || chip.textContent || "";
      if (typeof chatbotState.sendMessage === "function") {
        chatbotState.ensureOpen?.();
        chatbotState.sendMessage(question);
      } else if (chatbotState.input) {
        chatbotState.ensureOpen?.();
        chatbotState.input.value = question;
        chatbotState.input.focus();
      }
    });
  });
}

async function fetchChatbotResponse(message) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: message })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  if (!data?.reply) {
    throw new Error("Chat API returned no reply");
  }

  return data.reply;
}

function appendMessage(container, text, role, options = {}) {
  const { allowHtml = false } = options;
  const bubble = document.createElement("div");
  bubble.className = `chatbot-message ${role}`;
  bubble.innerHTML = allowHtml ? text : escapeHtml(text).replace(/\n/g, "<br>");
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}
