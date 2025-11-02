import { configureChartTheme, initCharts } from "./modules/charts.js";
import { loadAnalyticsData } from "./modules/config.js";
import { initChatbot, initChips } from "./modules/chatbot.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { initContactModal } from "./modules/contact-modal.js";
import { setCurrentYear } from "./modules/layout.js";

document.addEventListener("DOMContentLoaded", async () => {
  setCurrentYear();
  configureChartTheme();
  try {
    const analytics = await loadAnalyticsData();
    initCharts(analytics);
  } catch (error) {
    console.error("Failed to initialise charts", error);
  }
  initChatbot();
  initChips();
  initCursor();
  initNavigation();
  initContactModal();
});
