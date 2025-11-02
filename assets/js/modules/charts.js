import { palette, trendData } from "./config.js";

const chartRegistry = new Map();

export function configureChartTheme() {
  if (!window.Chart) return;

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

export function initCharts() {
  if (!window.Chart) return;

  destroyCharts();

  const marketCanvas = document.getElementById("marketPulseChart");
  if (marketCanvas) registerChart("market", createMarketPulseChart(marketCanvas.getContext("2d")));

  const allocationCanvas = document.getElementById("talentAllocationChart");
  if (allocationCanvas)
    registerChart("allocation", createTalentAllocationChart(allocationCanvas.getContext("2d")));

  const roleGrowthCanvas = document.getElementById("roleGrowthChart");
  if (roleGrowthCanvas)
    registerChart("roleGrowth", createRoleGrowthChart(roleGrowthCanvas.getContext("2d")));

  const compensationCanvas = document.getElementById("compensationChart");
  if (compensationCanvas)
    registerChart("compensation", createCompensationChart(compensationCanvas.getContext("2d")));

  const skillCanvas = document.getElementById("skillMatrixChart");
  if (skillCanvas)
    registerChart("skillMatrix", createSkillMatrixChart(skillCanvas.getContext("2d")));

  const investmentCanvas = document.getElementById("investmentChart");
  if (investmentCanvas)
    registerChart("investment", createInvestmentChart(investmentCanvas.getContext("2d")));

  const regionalCanvas = document.getElementById("regionalChart");
  if (regionalCanvas)
    registerChart("regional", createRegionalChart(regionalCanvas.getContext("2d")));

  const scenarioCanvas = document.getElementById("scenarioChart");
  if (scenarioCanvas)
    registerChart("scenario", createScenarioChart(scenarioCanvas.getContext("2d")));
}

function registerChart(key, instance) {
  if (!instance) return;
  chartRegistry.set(key, instance);
}

function destroyCharts() {
  chartRegistry.forEach((chart) => chart.destroy());
  chartRegistry.clear();
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

  return new Chart(ctx, {
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
  return new Chart(ctx, {
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

  return new Chart(ctx, {
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

  return new Chart(ctx, {
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
  return new Chart(ctx, {
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

  return new Chart(ctx, {
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
  return new Chart(ctx, {
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
  return new Chart(ctx, {
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
          grid: { color: "rgba(148, 163, 184, 0.08)" }
        }
      }
    }
  });
}

function createGradient(ctx, stops) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  stops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });
  return gradient;
}
