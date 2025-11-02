import { palette } from "./config.js";

const chartRegistry = new Map();
let analytics = null;
const regionalGradientStops = [
  ["rgba(125, 211, 252, 0.75)", "rgba(56, 189, 248, 0.45)"],
  ["rgba(244, 114, 182, 0.72)", "rgba(236, 72, 153, 0.4)"],
  ["rgba(168, 85, 247, 0.72)", "rgba(129, 140, 248, 0.4)"],
  ["rgba(190, 242, 100, 0.72)", "rgba(74, 222, 128, 0.45)"],
  ["rgba(251, 191, 36, 0.72)", "rgba(250, 204, 21, 0.45)"]
];
const allocationGradientStops = [
  ["rgba(125, 211, 252, 0.85)", "rgba(56, 189, 248, 0.45)"],
  ["rgba(236, 72, 153, 0.85)", "rgba(244, 114, 182, 0.45)"],
  ["rgba(168, 85, 247, 0.85)", "rgba(129, 140, 248, 0.45)"],
  ["rgba(190, 242, 100, 0.85)", "rgba(74, 222, 128, 0.45)"]
];

export function configureChartTheme() {
  if (!window.Chart) return;

  Chart.defaults.color = "rgba(241, 245, 249, 0.9)";
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

export function initCharts(data) {
  if (!window.Chart) return;
  analytics = data;

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
  if (!analytics?.market) return null;
  const { years, totalDatacenterSpend, aiSpendEstimate, aiSharePercent } = analytics.market;
  const ctx = canvas.getContext("2d");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: "Global datacenter spend (B USD)",
          data: totalDatacenterSpend,
          borderColor: palette.primary,
          backgroundColor: createGradient(ctx, [
            { stop: 0, color: "rgba(96, 165, 250, 0.55)" },
            { stop: 1, color: "rgba(96, 165, 250, 0.08)" }
          ]),
          borderWidth: 3,
          tension: 0.35,
          fill: true
        },
        {
          label: "AI-attributed spend (B USD)",
          data: aiSpendEstimate,
          borderColor: palette.magenta,
          backgroundColor: createGradient(ctx, [
            { stop: 0, color: "rgba(244, 114, 182, 0.55)" },
            { stop: 1, color: "rgba(244, 114, 182, 0.08)" }
          ]),
          borderWidth: 3,
          tension: 0.35,
          fill: true
        },
        {
          label: "AI share of spend (%)",
          data: aiSharePercent,
          borderColor: palette.lime,
          borderDash: [6, 6],
          yAxisID: "y1",
          tension: 0.3,
          fill: false
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, bottom: 8, left: 8 } },
      scales: {
        x: { grid: { color: "rgba(148, 163, 184, 0.08)" } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Spend (B USD)" },
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: {
            callback: (value) => `$${value.toLocaleString()}B`
          }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: { display: true, text: "AI share (%)" },
          grid: { drawOnChartArea: false },
          ticks: {
            callback: (value) => `${value}%`
          }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createTalentAllocationChart(canvas) {
  if (!analytics?.allocation) return null;
  const ctx = canvas.getContext("2d");
  const labels = analytics.allocation.map((entry) => entry.label);
  const values = analytics.allocation.map((entry) => entry.value);

  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          label: "AI budget allocation",
          data: values,
          backgroundColor: [
            palette.primary,
            palette.magenta,
            palette.teal,
            palette.violet
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
  if (!analytics?.headcount) return null;
  const ctx = canvas.getContext("2d");
  const labels = analytics.headcount.years;
  const series = analytics.headcount.values.map((value) =>
    value ? Number((value / 1_000_000).toFixed(2)) : null
  );
  const qaMarket = analytics.headcount.qaMarket || [];
  const qaSeries = qaMarket.map((value) => (value != null ? Number(value.toFixed(1)) : null));

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Global software developers (millions)",
          data: series,
          borderColor: palette.primary,
          borderWidth: 3,
          tension: 0.3,
          fill: false,
          spanGaps: true,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: "QA automation market (B USD)",
          data: qaSeries,
          borderColor: palette.magenta,
          borderDash: [8, 5],
          yAxisID: "y1",
          tension: 0.25,
          fill: false,
          spanGaps: true,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 8, bottom: 8 } },
      scales: {
        x: { grid: { color: "rgba(148, 163, 184, 0.08)" } },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Developers (millions)" },
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: {
            callback: (value) => `${value}M`
          }
        },
        y1: {
          position: "right",
          beginAtZero: true,
          title: { display: true, text: "QA automation market (B USD)" },
          grid: { drawOnChartArea: false },
          ticks: {
            callback: (value) => (value == null ? "" : `$${value}B`)
          }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createCompensationChart(canvas) {
  if (!analytics?.salary) return null;
  const ctx = canvas.getContext("2d");
  const { years, roles } = analytics.salary;
  const roleNames = Object.keys(roles);

  const datasets = roleNames.map((role, index) => ({
    label: role,
    data: roles[role],
    borderColor: Object.values(palette)[index % Object.keys(palette).length],
    borderWidth: 2.4,
    tension: 0.35,
    fill: false,
    spanGaps: true
  }));

  const chart = new Chart(ctx, {
    type: "line",
    data: { labels: years, datasets },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 8, bottom: 8 } },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: false,
          title: { display: true, text: "Average salary (USD)" },
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: {
            callback: (value) => `$${Math.round(value).toLocaleString()}`
          }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createSkillMatrixChart(canvas) {
  if (!analytics?.specialties) return null;
  const ctx = canvas.getContext("2d");
  const labels = analytics.specialties.map((item) => item.metric);
  const values = analytics.specialties.map((item) => item.value);

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Top specialty growth YoY",
          data: values,
          backgroundColor: labels.map(
            (_, index) => allocationGradientStops[index % allocationGradientStops.length][0]
          ),
          borderRadius: 12
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 8, bottom: 12 } },
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: "rgba(148, 163, 184, 0.12)" },
          ticks: {
            callback: (value) => `${value}%`
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createInvestmentChart(canvas) {
  if (!analytics?.market) return null;
  if (!analytics?.allocation) return null;

  const ctx = canvas.getContext("2d");
  const allocationLabels = analytics.allocation.map((a) => a.label);
  const allocationValues = analytics.allocation.map((a) => a.value);
  const colors = allocationLabels.map((_, index) =>
    allocationGradientStops[index % allocationGradientStops.length][0]
  );

  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: allocationLabels,
      datasets: [
        {
          label: "Budget mix (%)",
          data: allocationValues,
          backgroundColor: colors,
          borderColor: "rgba(15, 23, 42, 0.85)",
          borderWidth: 2,
          hoverOffset: 10
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      cutout: "58%",
      layout: { padding: { top: 12, right: 12, left: 12, bottom: 12 } },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.formattedValue}%`
          }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createRegionalChart(canvas) {
  if (!analytics?.regional) return null;
  const ctx = canvas.getContext("2d");
  const labels = analytics.regional.map((item) => `${item.region}`);
  const values = analytics.regional.map((item) => item.value);

  const regionMeta = analytics.regional;

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Talent momentum",
          data: values,
          backgroundColor: (context) =>
            createBarGradient(
              context,
              regionalGradientStops[context.dataIndex % regionalGradientStops.length],
              "horizontal"
            ),
          borderRadius: 12,
          borderColor: "rgba(148, 197, 253, 0.25)",
          borderWidth: 1
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 12, left: 8, bottom: 8 } },
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          max: 40,
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: {
            callback: (value) => `${value}%`
          }
        },
        y: { grid: { display: false } }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const meta = regionMeta[context.dataIndex];
              return `${meta.region}: ${context.formattedValue}% — ${meta.metric}`;
            }
          }
        }
      }
    }
  });

  attachDatasetControls(canvas, chart);
  return chart;
}

function createScenarioChart(canvas) {
  if (!analytics?.projections) return null;
  const ctx = canvas.getContext("2d");

  const datasets = analytics.projections.map((series, index) => {
    const unit = (series.points[0]?.unit || "").toLowerCase();
    let axis = "yValue";
    let transform = (value) => value;

    if (unit.includes("percent")) {
      axis = "yPercent";
    } else if (unit.includes("count")) {
      axis = "yCount";
      transform = (value) => Number((value / 1000).toFixed(1));
    } else if (unit.includes("billion")) {
      transform = (value) => Number(value.toFixed(2));
    }

    return {
      type: "scatter",
      label: series.metric,
      data: series.points.map((point) => ({
        x: point.year,
        y: transform(point.value),
        raw: point.value,
        unit: point.unit
      })),
      yAxisID: axis,
      borderColor: Object.values(palette)[index % Object.keys(palette).length],
      backgroundColor: Object.values(palette)[index % Object.keys(palette).length],
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false
    };
  });

  const chart = new Chart(ctx, {
    type: "scatter",
    data: { datasets },
    options: {
      maintainAspectRatio: false,
      layout: { padding: { top: 12, right: 16, left: 8, bottom: 8 } },
      scales: {
        x: {
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => value }
        },
        yValue: {
          beginAtZero: true,
          position: "left",
          title: { display: true, text: "Market size (B USD)" },
          grid: { color: "rgba(148, 163, 184, 0.08)" },
          ticks: { callback: (value) => `$${value}B` }
        },
        yPercent: {
          beginAtZero: true,
          position: "right",
          title: { display: true, text: "Percent / Adoption" },
          grid: { drawOnChartArea: false },
          ticks: { callback: (value) => `${value}%` }
        },
        yCount: {
          beginAtZero: true,
          position: "right",
          offset: true,
          title: { display: true, text: "Roles added (thousands)" },
          grid: { drawOnChartArea: false },
          ticks: { callback: (value) => `${value}K` }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const { raw, unit } = context.raw || {};
              if (!raw) return context.dataset.label;
              const normalized = (unit || "").toLowerCase();
              if (normalized.includes("percent")) {
                return `${context.dataset.label}: ${raw}%`;
              }
              if (normalized.includes("billion")) {
                return `${context.dataset.label}: $${raw}B`;
              }
              if (normalized.includes("count")) {
                return `${context.dataset.label}: ${Math.round(raw).toLocaleString()} roles`;
              }
              return `${context.dataset.label}: ${raw}`;
            }
          }
        }
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
  masterToggle.label.classList.add("chart-toggle--master");
  toolbar.appendChild(masterToggle.label);

  const datasetContainer = document.createElement("div");
  datasetContainer.className = "chart-toolbar__group";
  toolbar.appendChild(datasetContainer);

  const datasetCheckboxes = chart.data.datasets.map((dataset, index) => {
    const control = buildToggle(
      `${canvas.id}-dataset-${index}`,
      dataset.label || `Series ${index + 1}`,
      dataset.borderColor || dataset.backgroundColor
    );
    control.label.classList.add("chart-toggle--dataset");
    control.checkbox.checked = !chart.isDatasetVisible || chart.isDatasetVisible(index);
    control.label.classList.toggle("is-active", control.checkbox.checked);
    control.checkbox.addEventListener("change", () => {
      setDatasetVisibility(chart, index, control.checkbox.checked);
      chart.update();
      syncMasterState();
      control.label.classList.toggle("is-active", control.checkbox.checked);
    });
    datasetContainer.appendChild(control.label);
    return control.checkbox;
  });

  const syncMasterState = () => {
    if (!datasetCheckboxes.length) {
      masterToggle.checkbox.checked = true;
      masterToggle.checkbox.indeterminate = false;
      masterToggle.label.classList.add("is-active");
      return;
    }
    const allVisible = datasetCheckboxes.every((input) => input.checked);
    const noneVisible = datasetCheckboxes.every((input) => !input.checked);
    masterToggle.checkbox.checked = allVisible;
    masterToggle.checkbox.indeterminate = !allVisible && !noneVisible;
    masterToggle.label.classList.toggle("is-active", allVisible && !masterToggle.checkbox.indeterminate);
  };

  masterToggle.checkbox.addEventListener("change", () => {
    const shouldShow = masterToggle.checkbox.checked;
    datasetCheckboxes.forEach((checkbox, index) => {
      checkbox.checked = shouldShow;
      const labelElement = datasetContainer.children[index];
      if (labelElement) labelElement.classList.toggle("is-active", shouldShow);
      setDatasetVisibility(chart, index, shouldShow);
    });
    masterToggle.checkbox.indeterminate = false;
    masterToggle.label.classList.toggle("is-active", shouldShow);
    chart.update();
  });

  syncMasterState();
}

function buildToggle(id, text, color) {
  const label = document.createElement("label");
  label.className = "chart-toggle";
  let resolvedColor = palette.primary;
  if (typeof color === "string") {
    resolvedColor = color;
  } else if (Array.isArray(color) && color.length) {
    resolvedColor = color[0];
  }
  label.style.setProperty("--toggle-color", resolvedColor);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.setAttribute("role", "checkbox");
  label.appendChild(checkbox);

  const swatch = document.createElement("span");
  swatch.className = "chart-toggle__swatch";
  swatch.style.setProperty("--toggle-color", resolvedColor);
  label.appendChild(swatch);

  const span = document.createElement("span");
  span.className = "chart-toggle__text";
  span.textContent = text;
  label.appendChild(span);

  return { label, checkbox };
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

function createBarGradient(context, colorStops, orientation = "vertical") {
  const { ctx, chartArea } = context.chart;
  if (!chartArea) return colorStops[0];
  let gradient;
  if (orientation === "horizontal") {
    gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  } else {
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  }
  gradient.addColorStop(0, colorStops[0]);
  gradient.addColorStop(1, colorStops[1]);
  return gradient;
}
