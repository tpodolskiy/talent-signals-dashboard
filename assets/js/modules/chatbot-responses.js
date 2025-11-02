import { loadAnalyticsData } from "./config.js";
import { formatChatbotResponse, matchesAny } from "./chatbot-helpers.js";

let analyticsData = null;
loadAnalyticsData()
  .then((data) => {
    analyticsData = data;
  })
  .catch(() => {
    analyticsData = null;
  });

export function generateChatbotResponse(question) {
  const q = question.toLowerCase();

  if (matchesAny(q, ["fastest", "grow", "growth", "top roles", "expanding", "velocity"])) {
    const { summary, bullets } = getRoleGrowthHighlights();
    return formatChatbotResponse({
      title: "Global growth momentum",
      summary,
      bullets,
      followUp: "Ask about compensation or regional momentum for deeper calibration."
    });
  }

  if (matchesAny(q, ["salary", "pay", "compensation", "total comp", "wage"])) {
    const { summary, bullets } = getCompensationHighlights();
    return formatChatbotResponse({
      title: "Compensation arcs",
      summary,
      bullets,
      followUp: "Want to balance cash vs. equity? Ask about scenario planning."
    });
  }

  if (matchesAny(q, ["skill", "capability", "matrix", "readiness"])) {
    const { summary, bullets } = getSkillHighlights();
    return formatChatbotResponse({
      title: "Capability focus",
      summary,
      bullets,
      followUp: "Ask about role growth to see which teams lean on these skills."
    });
  }

  if (matchesAny(q, ["budget", "spend", "investment", "cfo", "mix"])) {
    const { summary, bullets } = getInvestmentHighlights();
    return formatChatbotResponse({
      title: "Investment mix snapshot",
      summary,
      bullets,
      followUp: "Curious where to launch first? Ask about regional momentum."
    });
  }

  if (matchesAny(q, ["ai", "automation", "ml", "machine learning"])) {
    const { summary, bullets } = getAutomationHighlights();
    return formatChatbotResponse({
      title: "AI & automation trajectory",
      summary,
      bullets,
      followUp: "Need squad structure ideas? Ask how product & data teams align."
    });
  }

  if (matchesAny(q, ["qa", "quality", "reliability", "testing"])) {
    const { summary, bullets } = getQualityHighlights();
    return formatChatbotResponse({
      title: "Quality & resilience outlook",
      summary,
      bullets,
      followUp: "Check projections to size QA throughput under different adoption curves."
    });
  }

  if (matchesAny(q, ["region", "geography", "where", "market", "apac", "latam", "emea"])) {
    const { summary, bullets } = getRegionalHighlights();
    return formatChatbotResponse({
      title: "Regional momentum",
      summary,
      bullets,
      followUp: "Ask about budget mix to align investment with region readiness."
    });
  }

  if (matchesAny(q, ["scenario", "forecast", "conservative", "accelerated", "baseline"])) {
    const { summary, bullets } = getScenarioHighlights();
    return formatChatbotResponse({
      title: "Forecast signals",
      summary,
      bullets,
      followUp: "Need help sequencing squads? Ask which roles scale fastest."
    });
  }

  if (matchesAny(q, ["product", "design", "ux", "pm"])) {
    const { summary, bullets } = getProductDesignHighlights();
    return formatChatbotResponse({
      title: "Product & design dynamics",
      summary,
      bullets,
      followUp: "Ask about compensation to benchmark PM vs. design premiums."
    });
  }

  return formatChatbotResponse({
    title: "Trend Copilot",
    summary:
      "I synthesize role growth, pay, skills, budgets, scenarios, and regional momentum across engineering, product, and design.",
    bullets: [
      "Ask “Which roles grow fastest?” for hiring velocity insights.",
      "Try “How should I split AI vs. platform investment?” for budget help.",
      "Need geography cues? Ask “Where is momentum strongest?”"
    ],
    followUp: "You can also tap the quick chips below for ready-made prompts."
  });
}

function ensureData() {
  return analyticsData;
}

function getRoleGrowthHighlights() {
  const data = ensureData();
  if (!data?.headcount) {
    return {
      summary: "Global developer headcount keeps climbing, with QA automation spend accelerating in parallel.",
      bullets: ["Download the latest dataset for precise values."]
    };
  }

  const headcountYears = data.headcount.years;
  const values = data.headcount.values;
  const start = values[0];
  const startYear = headcountYears[0];
  const end = values[values.length - 1];
  const endYear = headcountYears[headcountYears.length - 1];
  const growthPct = ((end - start) / start) * 100;

  const qaLastValue = data.headcount.qaMarket?.filter((value) => value)?.slice(-1)[0];
  const qaYearIndex = qaLastValue != null ? data.headcount.qaMarket.lastIndexOf(qaLastValue) : -1;
  const qaYear = qaYearIndex >= 0 ? headcountYears[qaYearIndex] : endYear;
  const qaBullet = qaLastValue
    ? `QA automation market tracks to ~$${qaLastValue}B by ${qaYear}.`
    : "QA automation market expansion tracks developer growth.";

  const specialty = data.specialties?.[0];

  return {
    summary: `Global developer headcount expands from ${formatMillions(start)} in ${startYear} to ${formatMillions(
      end
    )} by ${endYear}, a +${growthPct.toFixed(1)}% climb.`,
    bullets: [
      qaBullet,
      specialty ? `${specialty.metric}: +${specialty.value}% YoY growth.` : "AI-aligned specialties lead hiring velocity.",
      "Pair hiring with platform automation to absorb demand."
    ]
  };
}

function getCompensationHighlights() {
  const data = ensureData();
  if (!data?.salary) {
    return {
      summary: "Latest compensation data indicates strong premiums for AI-adjacent roles.",
      bullets: ["Reload once analytics data is available."]
    };
  }

  const { years, roles } = data.salary;
  const latestYear = years[years.length - 1];
  const penalties = Object.entries(roles).map(([role, series]) => ({
    role,
    latest: getLatestValue(series),
    previous: getPreviousValue(series)
  }));
  penalties.sort((a, b) => (b.latest || 0) - (a.latest || 0));

  const top = penalties.slice(0, 4);
  const summary = `${top[0].role} leads ${latestYear} compensation at ~$${Math.round(top[0].latest || 0).toLocaleString()}, with AI-heavy squads keeping premiums high.`;
  const bullets = top.map((item) => {
    const delta = item.previous && item.latest ? item.latest - item.previous : null;
    const deltaText = delta ? ` (+$${Math.round(delta).toLocaleString()} vs prior snapshot)` : "";
    return `${item.role}: ~$${Math.round(item.latest || 0).toLocaleString()}${deltaText}`;
  });

  return { summary, bullets };
}

function getSkillHighlights() {
  const data = ensureData();
  if (!data?.specialties) {
    return {
      summary: "AI-native specialties are pacing the fastest growth in 2025.",
      bullets: ["AI engineer, AI solutions architect, AI content creator remain standout roles."]
    };
  }
  const summary = `${data.specialties[0].metric} is the fastest-growing specialty at ${data.specialties[0].value}% YoY.`;
  const bullets = data.specialties.slice(1, 4).map((item) => `${item.metric}: +${item.value}% YoY`);
  bullets.push("Use these spikes to guide upskilling and sourcing agendas.");
  return { summary, bullets };
}

function getInvestmentHighlights() {
  const data = ensureData();
  if (!data?.allocation || !data?.market) {
    return {
      summary: "AI budgets are tilting toward cloud, GenAI tooling, and security hardening.",
      bullets: ["Cloud platform, generative tools, and security remain the primary allocation buckets."]
    };
  }
  const total = data.allocation.reduce((sum, entry) => sum + entry.value, 0);
  const primary = [...data.allocation].sort((a, b) => b.value - a.value)[0];
  const summary = `${primary.label} commands the largest share of AI budgets (${primary.value}% of spend).`;
  const bullets = data.allocation.map((entry) => `${entry.label}: ${entry.value.toFixed(1)}% of allocation`);
  const shareLatest = data.market.aiSharePercent[data.market.aiSharePercent.length - 1];
  bullets.push(`AI now represents ~${shareLatest}% of total datacenter/software spend.`);
  return { summary, bullets };
}

function getAutomationHighlights() {
  const data = ensureData();
  if (!data?.market) {
    return {
      summary: "AI adoption is accelerating across infrastructure and software budgets.",
      bullets: ["Average monthly AI spend grew ~36% YoY."]
    };
  }
  const [firstShare] = data.market.aiSharePercent;
  const latestShare = data.market.aiSharePercent[data.market.aiSharePercent.length - 1];
  const [firstSpend] = data.market.totalDatacenterSpend;
  const latestSpend = data.market.totalDatacenterSpend[data.market.totalDatacenterSpend.length - 1];
  const aiSpend = data.market.aiSpendEstimate[data.market.aiSpendEstimate.length - 1];
  const summary = `AI share of infrastructure/software spend climbs from ${firstShare}% to ${latestShare}%, on top of datacenter budgets rising from $${firstSpend}B to $${latestSpend}B.`;
  const bullets = [
    `AI-attributed spend now approximates $${Math.round(aiSpend || 0)}B.`,
    "Organizations spending $100k+/month on AI jumped from 20% to 45%.",
    "Allocate security and governance alongside GenAI experimentation."
  ];
  return { summary, bullets };
}

function getQualityHighlights() {
  const data = ensureData();
  if (!data?.headcount) {
    return {
      summary: "QA automation demand scales with AI programs.",
      bullets: ["Adopt continuous testing and resilience pods alongside AI rollouts."]
    };
  }
  const qa2035 = data.headcount.years.indexOf(2035);
  const qa2025 = data.headcount.years.indexOf(2025);
  const qaStart = qa2025 !== -1 ? data.headcount.values[qa2025] : null;
  const qaEnd = qa2035 !== -1 ? data.headcount.values[qa2035] : null;
  const summary =
    qaStart && qaEnd
      ? `QA automation market doubles from ~$${qaStart}B to ~$${qaEnd}B by 2035 as AI pipelines expand.`
      : "QA automation market is on track to more than double over the next decade.";
  const bullets = [
    "Blend automation frameworks with observability for resilient releases.",
    "QA engineers with coding skills already represent 77% of postings.",
    "Use scenario planning to forecast test coverage under varying AI adoption rates."
  ];
  return { summary, bullets };
}

function getRegionalHighlights() {
  const data = ensureData();
  if (!data?.regional) {
    return {
      summary: "APAC, LATAM, and MENA hubs post double-digit AI adoption growth.",
      bullets: [
        "São Paulo, Bogotá, and Dubai narrow salary gaps with European hubs.",
        "Use regional AI usage levels to prioritize distributed pods."
      ]
    };
  }
  const topRegions = [...data.regional].sort((a, b) => b.value - a.value).slice(0, 3);
  const summary = `${topRegions[0].region} leads with ${topRegions[0].value}% of organizations reporting AI milestones.`;
  const bullets = topRegions.map(
    (item) => `${item.region}: ${item.value}% — ${item.metric.toLowerCase()}`
  );
  return { summary, bullets };
}

function getScenarioHighlights() {
  const data = ensureData();
  if (!data?.projections) {
    return {
      summary: "Forecast data highlights engineering software markets and platform adoption growth.",
      bullets: ["Platform engineering expected to influence half of infrastructure decisions by 2027."]
    };
  }
  const bullets = data.projections.map((series) => {
    const lastPoint = series.points[series.points.length - 1];
    return `${series.metric}: ${formatValueWithUnit(lastPoint.value, lastPoint.unit)} by ${lastPoint.year}`;
  });
  const summary = "Forecasts underscore platform engineering adoption and QA market expansion into the next decade.";
  return { summary, bullets };
}

function getProductDesignHighlights() {
  const data = ensureData();
  if (!data?.salary) {
    return {
      summary: "Product and design salaries stay competitive as AI-infused experiences scale.",
      bullets: ["Senior ICs remain above the $120k mark in major markets."]
    };
  }
  const { roles } = data.salary;
  const productRoles = ["Product Management", "Product & Design"];
  const bullets = productRoles
    .filter((role) => roles[role])
    .map((role) => {
      const series = roles[role];
      const latest = getLatestValue(series);
      return `${role}: ~$${Math.round(latest || 0).toLocaleString()} median package in latest dataset.`;
    });
  bullets.push("Pair PMs with design systems and AI engineering to accelerate discovery.");
  const summary = "Product and design functions maintain healthy salary premiums, especially where AI experience design is core.";
  return { summary, bullets };
}

function getLatestValue(series) {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i] != null) return series[i];
  }
  return null;
}

function getPreviousValue(series) {
  let found = false;
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i] != null) {
      if (found) return series[i];
      found = true;
    }
  }
  return null;
}

function formatMillions(value) {
  return `${(value / 1_000_000).toFixed(1)}M`;
}

function formatValueWithUnit(value, unit) {
  if (unit.includes("percent")) {
    return `${value}%`;
  }
  if (unit.includes("billion")) {
    return `$${value}B`;
  }
  if (unit.includes("count")) {
    return `${Math.round(value).toLocaleString()} roles`;
  }
  return `${value} ${unit}`;
}
