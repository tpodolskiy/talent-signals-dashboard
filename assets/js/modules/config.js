export const palette = {
  primary: "#60a5fa",
  primaryAlt: "#38bdf8",
  violet: "#a855f7",
  magenta: "#f472b6",
  teal: "#5eead4",
  amber: "#fbbf24",
  slate: "#64748b",
  lime: "#bef264"
};

let cachedData = null;

export async function loadAnalyticsData() {
  if (cachedData) return cachedData;
  const dataUrl = new URL("../../data/analytics-data.json", import.meta.url);
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error("Failed to load analytics data");
  }
  cachedData = await response.json();
  return cachedData;
}
