import { configureChartTheme, initCharts } from "./modules/charts.js";
import { initChatbot, initChips } from "./modules/chatbot.js";
import { initCursor } from "./modules/cursor.js";
import { initNavigation } from "./modules/navigation.js";
import { setCurrentYear } from "./modules/layout.js";

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  configureChartTheme();
  initCharts();
  initChatbot();
  initChips();
  initCursor();
  initNavigation();
});
