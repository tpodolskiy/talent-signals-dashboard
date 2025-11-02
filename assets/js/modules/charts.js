import { palette, trendData } from "./config.js";

const chartRegistry = new Map();

export function configureChartTheme() {
  if (!window.Chart) return;

  Chart.defaults.color = "rgba(241, 245, 249, 0.88)";
  Chart.defaults.font.family =
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  Chart.defaults.font.size = 12;
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.point.backgroundColor = "#f8fafc";
  Chart.defaults.elements.point.borderWidth = 0;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(15, 23, 42, 0.92)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(148, 163, 184, 0.35)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.cornerRadius = 10;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.titleColor = "#f8fafc";
  Chart.defaults.plugins.tooltip.bodyColor = "rgba(226, 232, 240, 0.9)";
  Chart.defaults.transitions.active.animation.duration = 280;
}

export function initCharts() {
  if (!window.Chart) return;

  destroyCharts();

  const chartDefinitions = [
    { id: "marketPulseChart", key: "market", create: createMarketPulseChart },
    { id: "talentAllocationChart", key: "allocation", create: createTalentAllocationChart },
    { id: "roleGrowthChart", key: "roleGrowth", create: createRoleGrowthChart },
    { id: "compensationChart", key: "compensation", create: createCompensationChart },
    { id: "skillMatrixChart", key: "skillMatrix", create: createSkillMatrixChart },
    { id: "investmentChart", key: "investment", create: createInvestmentChart },
    { id: "regionalChart", key: "regional", create: createRegionalChart },
    { id: "scenarioChart", key: "scenario", create: createScenarioChart }
  ];

  chartDefinitions.forEach(({ id, key, create }) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const chart = create(canvas);
    if (chart) registerChart(key, chart);
  });
}

function registerChart(key, chart) {
  chartRegistry.set(key, chart);
}

function destroyCharts() {
  chartRegistry.forEach((chart) => chart.destroy());
  chartRegistry.clear();
}

function createMarketPulseChart(canvas) {
  const ctx = canvas.getContext("2d");
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

  const chart = new Chart(ctx, {
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
      layout: { padding: { top: 12, right: 12, bottom: 8, left: 8 } },
      scales: {
        x: {
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => `$${value}` }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createTalentAllocationChart(canvas) {
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: trendData.talentAllocation2030.labels,
      datasets: [
        {
          label: "Allocation",
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
      maintainAspectRatio: false,
      cutout: "55%",
      layout: { padding: { top: 12, bottom: 8 } }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createRoleGrowthChart(canvas) {
  const ctx = canvas.getContext("2d");
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

  const chart = new Chart(ctx, {
    type: "line",
    data: { labels: trendData.roleGrowth.years, datasets },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 8, bottom: 8 } },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
        y: { beginAtZero: false, grid: { color: "rgba(148, 163, 184, 0.08)" } }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createCompensationChart(canvas) {
  const ctx = canvas.getContext("2d");
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

  const chart = new Chart(ctx, {
    type: "line",
    data: { labels: trendData.compensation.years, datasets },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 8, bottom: 8 } },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => `$${value}k` }
        },
        x: { grid: { display: false } }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createSkillMatrixChart(canvas) {
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, {
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
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 12, bottom: 12 } },
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

  attachDatasetControls(canvas, chart);
  return chart;
}

function createInvestmentChart(canvas) {
  const ctx = canvas.getContext("2d");
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

  const chart = new Chart(ctx, {
    type: "line",
    data: { labels: trendData.investment.years, datasets },
    options: {
      maintainAspectRatio: false,
      stacked: true,
      layout: { padding: { top: 12, right: 12, bottom: 10, left: 8 } },
      scales: {
        x: { grid: { color: "rgba(148, 163, 184, 0.06)" }, ticks: { maxTicksLimit: 8 } },
        y: {
          beginAtZero: true,
          stacked: true,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => `$${value}` }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createRegionalChart(canvas) {
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, {
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
      layout: { padding: { top: 12, right: 12, bottom: 8, left: 8 } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.08)" } }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createScenarioChart(canvas) {
  const ctx = canvas.getContext("2d");
  const chart = new Chart(ctx, {
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
      layout: { padding: { top: 12, right: 12, bottom: 8, left: 8 } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false, grid: { color: "rgba(148, 163, 184, 0.08)" } }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function attachDatasetControls(canvas, chart) {
  const wrapper = canvas.closest(".chart-wrapper");
  if (!wrapper) return;

  let toolbar = wrapper.querySelector(".chart-toolbar");
  if (!toolbar) {
    toolbar = document.createElement("div");
    toolbar.className = "chart-toolbar";
    wrapper.insertBefore(toolbar, canvas);
  } else {
    toolbar.innerHTML = "";
  }

  const label = document.createElement("span");
  label.className = "chart-toolbar__label";
  label.textContent = "Series visibility";
  toolbar.appendChild(label);

  const masterToggle = buildToggle(`${canvas.id}-toggle-all`, "All series");
  toolbar.appendChild(masterToggle.label);

  const datasetContainer = document.createElement("div");
  datasetContainer.className = "chart-toolbar__group";
  toolbar.appendChild(datasetContainer);

  const datasetCheckboxes = chart.data.datasets.map((dataset, index) => {
    const control = buildToggle(
      `${canvas.id}-dataset-${index}`,
      dataset.label || `Series ${index + 1}`,
      getDatasetColor(dataset)
    );
    control.checkbox.checked = isDatasetVisible(chart, index);
    control.checkbox.addEventListener("change", () => {
      setDatasetVisibility(chart, index, control.checkbox.checked);
      chart.update();
      syncMasterState();
    });
    datasetContainer.appendChild(control.label);
    return control.checkbox;
  });

  const syncMasterState = () => {
    if (!datasetCheckboxes.length) {
      masterToggle.checkbox.checked = true;
      masterToggle.checkbox.indeterminate = false;
      return;
    }
    const allVisible = datasetCheckboxes.every((input) => input.checked);
    const noneVisible = datasetCheckboxes.every((input) => !input.checked);
    masterToggle.checkbox.checked = allVisible;
    masterToggle.checkbox.indeterminate = !allVisible && !noneVisible;
  };

  masterToggle.checkbox.addEventListener("change", () => {
    const shouldShow = masterToggle.checkbox.checked;
    datasetCheckboxes.forEach((checkbox, index) => {
      checkbox.checked = shouldShow;
      setDatasetVisibility(chart, index, shouldShow);
    });
    masterToggle.checkbox.indeterminate = false;
    chart.update();
  });

  syncMasterState();
}

function buildToggle(id, text, color) {
  const label = document.createElement("label");
  label.className = "chart-toggle";
  if (color) label.style.setProperty("--toggle-color", color);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  label.appendChild(checkbox);

  const span = document.createElement("span");
  span.textContent = text;
  label.appendChild(span);

  return { label, checkbox };
}

function getDatasetColor(dataset) {
  if (Array.isArray(dataset.borderColor)) return dataset.borderColor[0];
  if (typeof dataset.borderColor === "string") return dataset.borderColor;
  if (Array.isArray(dataset.backgroundColor)) return dataset.backgroundColor[0];
  if (typeof dataset.backgroundColor === "string") return dataset.backgroundColor;
  return palette.primary;
}

function isDatasetVisible(chart, index) {
  if (typeof chart.isDatasetVisible === "function") {
    return chart.isDatasetVisible(index);
  }
  const meta = chart.getDatasetMeta(index);
  return meta?.hidden !== true;
}

function setDatasetVisibility(chart, index, visible) {
  if (typeof chart.setDatasetVisibility === "function") {
    chart.setDatasetVisibility(index, visible);
  } else {
    const meta = chart.getDatasetMeta(index);
    if (meta) meta.hidden = !visible;
  }
}

function createGradient(ctx, stops) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  stops.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
  return gradient;
}
