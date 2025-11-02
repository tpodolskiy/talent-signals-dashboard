import { escapeHtml, formatMarkdown } from "./chatbot-helpers.js";
import { generateChatbotResponse } from "./chatbot-responses.js";

const chatbotState = {
  open: false,
  sendMessage: null,
  input: null
};

export function initChatbot() {
  const toggle = document.querySelector(".chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const input = document.getElementById("chatbot-input");
  const send = document.getElementById("chatbot-send");
  const history = document.getElementById("chatbot-history");

  if (!toggle || !panel || !input || !send || !history) return;

  chatbotState.input = input;

  toggle.addEventListener("click", () => {
    chatbotState.open = !chatbotState.open;
    panel.classList.toggle("open", chatbotState.open);
    toggle.setAttribute("aria-expanded", chatbotState.open.toString());
    if (chatbotState.open) {
      setTimeout(() => input.focus(), 80);
    }
  });

  const handleSend = async (messageOverride) => {
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
        chatbotState.sendMessage(question);
      } else if (chatbotState.input) {
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
