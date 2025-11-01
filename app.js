const palette = {
  primary: "#60a5fa",
  primaryAlt: "#38bdf8",
  violet: "#a855f7",
  magenta: "#f472b6",
  teal: "#5eead4",
  amber: "#fbbf24",
  slate: "#64748b"
};

const trendData = {
  marketSpend: {
    years: [
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
      2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035
    ],
    total: [
      180, 194, 210, 228, 250, 276, 305, 338, 374, 412,
      456, 502, 551, 603, 658, 716, 777, 842, 910, 982
    ],
    aiAutomation: [
      18, 22, 27, 33, 41, 50, 62, 78, 96, 118,
      143, 172, 205, 242, 284, 331, 384, 442, 506, 577
    ],
    productOps: [
      42, 45, 48, 52, 57, 63, 70, 78, 87, 97,
      108, 120, 133, 147, 162, 178, 195, 213, 232, 252
    ]
  },
  talentAllocation2030: {
    labels: [
      "Backend Engineering",
      "Frontend & Mobile",
      "Platform & DevOps",
      "QA & Reliability",
      "Data & AI",
      "Product & Design"
    ],
    values: [22, 17, 16, 12, 18, 15]
  },
  roleGrowth: {
    years: [
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
      2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035
    ],
    tracks: {
      "Backend Engineering": [
        180, 190, 202, 215, 228, 240, 260, 282, 308, 336,
        360, 384, 410, 438, 470, 504, 540, 576, 612, 648
      ],
      "Frontend & Mobile": [
        140, 150, 164, 178, 188, 204, 220, 240, 262, 284,
        305, 322, 340, 358, 380, 405, 432, 458, 486, 512
      ],
      "Platform & DevOps": [
        75, 82, 90, 102, 116, 134, 156, 182, 210, 244,
        270, 296, 328, 360, 396, 432, 468, 504, 536, 568
      ],
      "QA & Reliability": [
        160, 166, 170, 176, 184, 194, 208, 224, 240, 252,
        266, 284, 304, 328, 356, 384, 408, 428, 446, 462
      ],
      "Data & AI": [
        45, 50, 58, 68, 82, 102, 128, 160, 198, 240,
        285, 330, 378, 430, 486, 548, 612, 676, 742, 812
      ],
      "Product Management": [
        96, 102, 108, 118, 130, 146, 162, 182, 204, 228,
        248, 266, 284, 302, 320, 340, 360, 382, 404, 428
      ],
      "Design & Research": [
        82, 88, 96, 104, 114, 126, 142, 160, 180, 204,
        226, 244, 262, 280, 300, 320, 342, 366, 390, 414
      ]
    }
  },
  compensation: {
    years: [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
    bands: {
      "Backend Engineering": [132, 138, 144, 152, 160, 168, 176, 184, 192, 200, 208],
      "Platform & DevOps": [140, 146, 154, 162, 170, 180, 190, 200, 210, 220, 232],
      "Data & AI": [146, 156, 168, 182, 198, 212, 226, 240, 256, 272, 288],
      "Product Management": [134, 140, 148, 156, 168, 178, 188, 200, 210, 220, 232],
      "Design & Research": [118, 124, 130, 138, 146, 154, 162, 170, 178, 186, 194]
    }
  },
  skillMatrix2025: {
    labels: [
      "AI Fluency",
      "Systems Thinking",
      "Product Analytics",
      "Automation",
      "Design Ops",
      "Reliability Engineering"
    ],
    values: [88, 92, 84, 90, 78, 86]
  },
  investment: {
    years: [
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
      2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035
    ],
    streams: {
      "Cloud & Platform": [
        58, 62, 66, 70, 76, 84, 94, 106, 120, 134,
        152, 168, 184, 202, 220, 240, 262, 286, 312, 338
      ],
      "AI / Automation": [
        12, 16, 20, 26, 34, 44, 58, 76, 98, 124,
        152, 182, 216, 254, 296, 342, 392, 446, 502, 562
      ],
      "Customer & Product": [
        42, 44, 48, 52, 56, 60, 66, 72, 80, 88,
        96, 104, 112, 122, 132, 142, 152, 164, 176, 188
      ],
      "Experience & Design": [
        18, 20, 22, 24, 26, 30, 34, 38, 42, 46,
        50, 54, 58, 62, 68, 74, 80, 86, 92, 98
      ]
    }
  },
  regionalMomentum: {
    regions: ["North America", "Europe", "APAC", "LATAM", "Middle East & Africa"],
    index2024: [100, 88, 92, 78, 66],
    index2030: [128, 116, 132, 112, 98],
    index2035: [148, 136, 156, 132, 118]
  },
  hiringScenarios: {
    years: [2024, 2025, 2026, 2027, 2028, 2029, 2030],
    base: [100, 108, 117, 127, 138, 150, 163],
    accelerated: [100, 112, 126, 142, 160, 182, 205],
    conservative: [100, 105, 111, 118, 126, 134, 142]
  }
};

const state = {
  charts: {},
  chatbot: {
    open: false
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  configureChartTheme();
  initCharts();
  initChatbot();
  initChips();
  initCursor();
});

function setCurrentYear() {
  const yearSpans = document.querySelectorAll("#year");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => (span.textContent = currentYear));
}

function configureChartTheme() {
  Chart.defaults.color = "rgba(241, 245, 249, 0.88)";
  Chart.defaults.font.family =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.labels.color = "rgba(226, 232, 240, 0.72)";
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.92)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(148, 163, 184, 0.35)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.titleColor = "#f8fafc";
  Chart.defaults.plugins.tooltip.bodyColor = "rgba(226, 232, 240, 0.9)";
  Chart.defaults.plugins.tooltip.cornerRadius = 10;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.point.backgroundColor = "#f8fafc";
  Chart.defaults.elements.point.borderWidth = 0;
  Chart.defaults.transitions.active.animation.duration = 280;
}

function initCharts() {
  destroyExistingCharts();
  const ctxMarket = document.getElementById("marketPulseChart");
  if (ctxMarket) createMarketPulseChart(ctxMarket.getContext("2d"));

  const ctxAllocation = document.getElementById("talentAllocationChart");
  if (ctxAllocation) createTalentAllocationChart(ctxAllocation.getContext("2d"));

  const ctxRoleGrowth = document.getElementById("roleGrowthChart");
  if (ctxRoleGrowth) createRoleGrowthChart(ctxRoleGrowth.getContext("2d"));

  const ctxComp = document.getElementById("compensationChart");
  if (ctxComp) createCompensationChart(ctxComp.getContext("2d"));

  const ctxSkill = document.getElementById("skillMatrixChart");
  if (ctxSkill) createSkillMatrixChart(ctxSkill.getContext("2d"));

  const ctxInvestment = document.getElementById("investmentChart");
  if (ctxInvestment) createInvestmentChart(ctxInvestment.getContext("2d"));

  const ctxRegional = document.getElementById("regionalChart");
  if (ctxRegional) createRegionalChart(ctxRegional.getContext("2d"));

  const ctxScenario = document.getElementById("scenarioChart");
  if (ctxScenario) createScenarioChart(ctxScenario.getContext("2d"));
}

function destroyExistingCharts() {
  Object.values(state.charts).forEach((chart) => chart.destroy());
  state.charts = {};
}

function createMarketPulseChart(ctx) {
  const gradientTotal = createGradient(ctx, [
    { stop: 0, color: "rgba(96, 165, 250, 0.6)" },
    { stop: 1, color: "rgba(96, 165, 250, 0.08)" }
  ]);
  const gradientAI = createGradient(ctx, [
    { stop: 0, color: "rgba(244, 114, 182, 0.65)" },
    { stop: 1, color: "rgba(244, 114, 182, 0.08)" }
  ]);
  const gradientProduct = createGradient(ctx, [
    { stop: 0, color: "rgba(94, 234, 212, 0.55)" },
    { stop: 1, color: "rgba(94, 234, 212, 0.05)" }
  ]);

  state.charts.market = new Chart(ctx, {
    type: "line",
    data: {
      labels: trendData.marketSpend.years,
      datasets: [
        {
          label: "Total engineering & product spend ($B)",
          data: trendData.marketSpend.total,
          tension: 0.4,
          borderColor: palette.primary,
          backgroundColor: gradientTotal,
          borderWidth: 3,
          fill: true
        },
        {
          label: "AI & automation investment ($B)",
          data: trendData.marketSpend.aiAutomation,
          tension: 0.4,
          borderColor: palette.magenta,
          backgroundColor: gradientAI,
          borderDash: [8, 6],
          borderWidth: 3,
          fill: true
        },
        {
          label: "Product operations & analytics ($B)",
          data: trendData.marketSpend.productOps,
          tension: 0.4,
          borderColor: palette.teal,
          backgroundColor: gradientProduct,
          borderWidth: 3,
          fill: true
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: {
            callback: (value) => `$${value}`
          }
        }
      }
    }
  });
}

function createTalentAllocationChart(ctx) {
  state.charts.allocation = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: trendData.talentAllocation2030.labels,
      datasets: [
        {
          data: trendData.talentAllocation2030.values,
          backgroundColor: [
            palette.primary,
            palette.primaryAlt,
            palette.teal,
            palette.violet,
            palette.magenta,
            palette.amber
          ],
          borderColor: "rgba(15, 23, 42, 0.85)",
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    },
    options: {
      cutout: "55%",
      plugins: {
        legend: {
          position: "right",
          labels: { usePointStyle: true }
        }
      }
    }
  });
}

function createRoleGrowthChart(ctx) {
  const datasets = Object.entries(trendData.roleGrowth.tracks).map(
    ([label, values], index) => ({
      label,
      data: values,
      borderColor: Object.values(palette)[index % 7],
      tension: 0.35,
      borderWidth: 2.5,
      fill: false
    })
  );

  state.charts.roleGrowth = new Chart(ctx, {
    type: "line",
    data: { labels: trendData.roleGrowth.years, datasets },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: false,
          grid: { color: "rgba(148, 163, 184, 0.08)" }
        }
      }
    }
  });
}

function createCompensationChart(ctx) {
  const datasets = Object.entries(trendData.compensation.bands).map(
    ([label, values], index) => ({
      label,
      data: values,
      borderColor: [palette.primary, palette.violet, palette.magenta, palette.teal, palette.amber][
        index % 5
      ],
      tension: 0.35,
      borderWidth: 2.5,
      fill: false
    })
  );

  state.charts.compensation = new Chart(ctx, {
    type: "line",
    data: { labels: trendData.compensation.years, datasets },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: {
            callback: (value) => `$${value}k`
          }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function createSkillMatrixChart(ctx) {
  state.charts.skillMatrix = new Chart(ctx, {
    type: "radar",
    data: {
      labels: trendData.skillMatrix2025.labels,
      datasets: [
        {
          label: "Readiness score",
          data: trendData.skillMatrix2025.values,
          backgroundColor: "rgba(96, 165, 250, 0.25)",
          borderColor: palette.primary,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: palette.magenta
        }
      ]
    },
    options: {
      scales: {
        r: {
          angleLines: { color: "rgba(148, 163, 184, 0.12)" },
          grid: { color: "rgba(148, 163, 184, 0.12)" },
          suggestedMin: 60,
          ticks: { stepSize: 10, display: false },
          pointLabels: { color: "rgba(226, 232, 240, 0.84)", font: { size: 12 } }
        }
      }
    }
  });
}

function createInvestmentChart(ctx) {
  const datasets = Object.entries(trendData.investment.streams).map(
    ([label, values], index) => ({
      label,
      data: values,
      tension: 0.35,
      borderWidth: 2.5,
      borderColor: [palette.primary, palette.magenta, palette.teal, palette.violet][index % 4],
      backgroundColor: [
        "rgba(96, 165, 250, 0.18)",
        "rgba(244, 114, 182, 0.18)",
        "rgba(94, 234, 212, 0.16)",
        "rgba(168, 85, 247, 0.18)"
      ][index % 4],
      fill: true
    })
  );

  state.charts.investment = new Chart(ctx, {
    type: "line",
    data: { labels: trendData.investment.years, datasets },
    options: {
      maintainAspectRatio: false,
      stacked: true,
      scales: {
        x: {
          grid: { color: "rgba(148, 163, 184, 0.06)" },
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: true,
          stacked: true,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => `$${value}` }
        }
      }
    }
  });
}

function createRegionalChart(ctx) {
  state.charts.regional = new Chart(ctx, {
    type: "bar",
    data: {
      labels: trendData.regionalMomentum.regions,
      datasets: [
        {
          label: "2024",
          data: trendData.regionalMomentum.index2024,
          backgroundColor: "rgba(96, 165, 250, 0.32)"
        },
        {
          label: "2030",
          data: trendData.regionalMomentum.index2030,
          backgroundColor: "rgba(94, 234, 212, 0.32)"
        },
        {
          label: "2035",
          data: trendData.regionalMomentum.index2035,
          backgroundColor: "rgba(244, 114, 182, 0.32)"
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(148, 163, 184, 0.08)" }
        }
      }
    }
  });
}

function createScenarioChart(ctx) {
  state.charts.scenario = new Chart(ctx, {
    type: "line",
    data: {
      labels: trendData.hiringScenarios.years,
      datasets: [
        {
          label: "Accelerated innovation",
          data: trendData.hiringScenarios.accelerated,
          borderColor: palette.magenta,
          borderWidth: 2.8,
          tension: 0.35,
          fill: false
        },
        {
          label: "Baseline planning",
          data: trendData.hiringScenarios.base,
          borderColor: palette.primary,
          borderWidth: 2.8,
          tension: 0.35,
          borderDash: [6, 6],
          fill: false
        },
        {
          label: "Conservative spend",
          data: trendData.hiringScenarios.conservative,
          borderColor: palette.slate,
          borderWidth: 2.2,
          tension: 0.35,
          borderDash: [2, 6],
          fill: false
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: false,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => `${value}` }
        }
      }
    }
  });
}

function createGradient(ctx, stops) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  stops.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
  return gradient;
}

// --- Chatbot ---
function initChatbot() {
  const toggle = document.querySelector(".chatbot-toggle");
  const panel = document.getElementById("chatbot-panel");
  const input = document.getElementById("chatbot-input");
  const send = document.getElementById("chatbot-send");
  const history = document.getElementById("chatbot-history");

  if (!toggle || !panel || !input || !send || !history) return;

  toggle.addEventListener("click", () => {
    state.chatbot.open = !state.chatbot.open;
    panel.classList.toggle("open", state.chatbot.open);
    toggle.setAttribute("aria-expanded", state.chatbot.open.toString());
    if (state.chatbot.open) {
      setTimeout(() => input.focus(), 80);
    }
  });

  send.addEventListener("click", handleSend);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  });

  function handleSend() {
    const message = input.value.trim();
    if (!message) return;
    appendMessage(message, "user");
    input.value = "";

    setTimeout(() => {
      const reply = generateChatbotResponse(message);
      appendMessage(reply, "bot");
    }, 320);
  }

  function appendMessage(text, role) {
    const bubble = document.createElement("div");
    bubble.className = `chatbot-message ${role}`;
    bubble.innerHTML = text.replace(/\n/g, "<br>");
    history.appendChild(bubble);
    history.scrollTop = history.scrollHeight;
  }
}

function initChips() {
  const chips = document.querySelectorAll(".chip");
  const input = document.getElementById("chatbot-input");
  if (!chips.length || !input) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.question || chip.textContent;
      input.focus();
    });
  });
}

function generateChatbotResponse(question) {
  const q = question.toLowerCase();
  if (q.includes("fastest") || q.includes("grow") || q.includes("top roles")) {
    const growth = getTopGrowthRole();
    return `Data & AI squads are scaling the fastest, expanding ${growth.multiplier.toFixed(
      1
    )}× from 2024 to 2035. Platform & DevOps follows, fueled by automation and resilience mandates.`;
  }

  if (q.includes("salary") || q.includes("compensation") || q.includes("pay")) {
    const aiSalary = trendData.compensation.bands["Data & AI"].slice(-1)[0];
    const pmSalary = trendData.compensation.bands["Product Management"].slice(-1)[0];
    return `Median global comp in 2030 lands near $${aiSalary}k for Data & AI, with product leaders at ~$${pmSalary}k. Expect higher premiums in hybrid AI+product pods.`;
  }

  if (q.includes("ai") || q.includes("automation")) {
    const aiSpend2030 = trendData.marketSpend.aiAutomation.slice(-1)[0];
    return `AI hiring accelerates as automation investment reaches $${aiSpend2030}B by 2035. Pair ML platform hires with product analytics to unlock compounding insight loops.`;
  }

  if (q.includes("qa") || q.includes("quality")) {
    return `QA & Reliability grows steadily, shifting toward observability, chaos, and resilience. Blend automation engineers with platform SRE to cut incident recovery by ~22%.`;
  }

  if (q.includes("region") || q.includes("where")) {
    return `APAC and LATAM show the sharpest momentum, with index scores climbing above 130 by 2035. Invest early in leadership rotations to sustain distributed squad cohesion.`;
  }

  if (q.includes("budget") || q.includes("invest")) {
    return `Cloud & platform spend remains the foundation, but AI/automation grows fastest—overtaking customer tooling by 2029. Safest mix balances platform reliability with AI-led efficiency.`;
  }

  if (q.includes("scenario") || q.includes("conservative")) {
    return `Under the conservative plan, hiring still compounds 7% CAGR through 2030. Use it for contingency, but keep runway to pivot into the accelerated track when demand spikes.`;
  }

  return `Great question. The data suggests blending Data & AI, platform, and product analytics investments ensures durable velocity. Let me know if you want a specific function, region, or timeframe.`;
}

function getTopGrowthRole() {
  let topRole = "";
  let topMultiplier = 0;
  const trackEntries = Object.entries(trendData.roleGrowth.tracks);
  trackEntries.forEach(([role, values]) => {
    const start = values[8]; // 2024 index
    const end = values[values.length - 1];
    const multiplier = end / start;
    if (multiplier > topMultiplier) {
      topMultiplier = multiplier;
      topRole = role;
    }
  });
  return { role: topRole, multiplier: topMultiplier };
}

function initCursor() {
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
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
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
