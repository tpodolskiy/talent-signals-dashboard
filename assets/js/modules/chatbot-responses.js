import { trendData } from "./config.js";
import { formatChatbotResponse, matchesAny } from "./chatbot-helpers.js";

export function generateChatbotResponse(question) {
  const q = question.toLowerCase();

  if (matchesAny(q, ["fastest", "grow", "growth", "top roles", "expanding", "velocity"])) {
    const { summary, bullets } = getRoleGrowthHighlights();
    return formatChatbotResponse({
      title: "Role growth momentum",
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
      title: "Capability focus for 2025 pods",
      summary,
      bullets,
      followUp: "Ask about role growth to see which teams lean on these skills."
    });
  }

  if (matchesAny(q, ["budget", "spend", "investment", "cfo", "mix"])) {
    const { summary, bullets } = getInvestmentHighlights();
    return formatChatbotResponse({
      title: "Investment mix through 2035",
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
      followUp:
        "Check scenario planning to size QA throughput under different hiring velocities."
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
      title: "Hiring scenarios comparison",
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

function getRoleGrowthHighlights() {
  const tracks = Object.entries(trendData.roleGrowth.tracks).map(([role, values]) => {
    const start = values[8]; // 2024 index
    const end = values[values.length - 1];
    return {
      role,
      multiplier: end / start,
      absolute: end - start
    };
  });

  tracks.sort((a, b) => b.multiplier - a.multiplier);
  const top = tracks.slice(0, 3);
  const summary = `${top[0].role} leads with ${(top[0].multiplier - 1).toFixed(
    2
  )}× growth from 2024 to 2035. Keep Platform & DevOps and Product Management aligned—they anchor automation and discovery loops.`;
  const bullets = top.map(
    (item) =>
      `${item.role}: ${(item.multiplier - 1).toFixed(2)}× growth, +${item.absolute.toLocaleString()} headcount units`
  );
  return { summary, bullets };
}

function getCompensationHighlights() {
  const bands = Object.entries(trendData.compensation.bands).map(([role, values]) => ({
    role,
    latest: values[values.length - 1],
    fiveYearLift: values[values.length - 1] - values[values.length - 6]
  }));
  bands.sort((a, b) => b.latest - a.latest);
  const summary = `Data & AI still set the ceiling with median $${bands[0].latest}k by 2030, while Platform & DevOps narrow the gap thanks to resilience mandates.`;
  const bullets = bands.slice(0, 4).map(
    (item) => `${item.role}: $${item.latest}k median, +$${item.fiveYearLift}k vs. 2025`
  );
  return { summary, bullets };
}

function getSkillHighlights() {
  const skills = trendData.skillMatrix2025.labels.map((label, index) => ({
    skill: label,
    score: trendData.skillMatrix2025.values[index]
  }));
  skills.sort((a, b) => b.score - a.score);
  const top = skills.slice(0, 4);
  const summary = `${top[0].skill} is the highest readiness signal at ${top[0].score}%, closely followed by systems thinking to keep AI initiatives grounded.`;
  const bullets = top.map((item) => `${item.skill}: ${item.score}% readiness score`);
  return { summary, bullets };
}

function getInvestmentHighlights() {
  const streams = Object.entries(trendData.investment.streams).map(([stream, values]) => ({
    stream,
    current: values[values.length - 1],
    lift: values[values.length - 1] - values[8]
  }));
  streams.sort((a, b) => b.current - a.current);
  const total2035 = streams.reduce((sum, item) => sum + item.current, 0);
  const aiStream =
    streams.find((item) => item.stream.toLowerCase().includes("ai")) || streams[0];
  const summary = `Cloud & Platform still command the largest dollar share in 2035, but ${
    aiStream.stream
  } adds the most net-new investment at +$${aiStream.lift}B.`;
  const bullets = streams.map(
    (item) =>
      `${item.stream}: $${item.current}B in 2035 (${Math.round((item.current / total2035) * 100)}% of mix)`
  );
  return { summary, bullets };
}

function getAutomationHighlights() {
  const aiSeries = trendData.marketSpend.aiAutomation;
  const latest = aiSeries[aiSeries.length - 1];
  const baseline = aiSeries[8];
  const summary = `AI & automation outpace total spend growth, scaling from $${baseline}B in 2024 to $${latest}B by 2035—a ${Math.round(
    ((latest - baseline) / baseline) * 100
  )}% lift.`;
  const bullets = [
    "Pair AI squads with product analytics to turn telemetry into roadmap signals.",
    "Platform & DevOps hiring keeps automation maintainable—invest in shared tooling.",
    "Consider regional hubs (APAC, LATAM) for 24/7 experimentation without runaway costs."
  ];
  return { summary, bullets };
}

function getQualityHighlights() {
  const qaSeries = trendData.roleGrowth.tracks["QA & Reliability"];
  const start = qaSeries[8];
  const end = qaSeries[qaSeries.length - 1];
  const summary = `QA & Reliability scale steadily (+${end - start} headcount units) as orgs fold chaos and observability practices into core release gates.`;
  const bullets = [
    "Blend automation engineers with platform SRE to cut incident recovery times by 22%.",
    "Shift manual QA into exploratory testing while bots guard regression suites.",
    "Invest in shared telemetry so QA, product, and ops teams read from the same data plane."
  ];
  return { summary, bullets };
}

function getRegionalHighlights() {
  const regions = trendData.regionalMomentum.regions.map((region, index) => ({
    region,
    baseline: trendData.regionalMomentum.index2024[index],
    forecast: trendData.regionalMomentum.index2035[index]
  }));
  regions.sort((a, b) => b.forecast - a.forecast);
  const summary = `${regions[0].region} remains the depth core, but ${regions[2].region} overtakes Europe by 2035 as distributed squads normalize hybrid-first cadences.`;
  const bullets = regions.map(
    (item) =>
      `${item.region}: index ${item.baseline} → ${item.forecast} (${Math.round(
        ((item.forecast - item.baseline) / item.baseline) * 100
      )}% lift)`
  );
  return { summary, bullets };
}

function getScenarioHighlights() {
  const accel = trendData.hiringScenarios.accelerated.slice(-1)[0];
  const base = trendData.hiringScenarios.base.slice(-1)[0];
  const conservative = trendData.hiringScenarios.conservative.slice(-1)[0];
  const summary = `By 2030, accelerated hiring is ${Math.round(
    ((accel - base) / base) * 100
  )}% above baseline. Even the conservative track keeps a +42% headcount over 2024.`;
  const bullets = [
    `Accelerated: index ${accel} — fund aggressive AI and platform scale-ups.`,
    `Baseline: index ${base} — keep balanced squad formation with guardrails.`,
    `Conservative: index ${conservative} — maintain experimentation lanes but protect runway.`
  ];
  return { summary, bullets };
}

function getProductDesignHighlights() {
  const pmGrowth = trendData.roleGrowth.tracks["Product Management"];
  const designGrowth = trendData.roleGrowth.tracks["Design & Research"];
  const pmStart = pmGrowth[8];
  const pmEnd = pmGrowth[pmGrowth.length - 1];
  const designStart = designGrowth[8];
  const designEnd = designGrowth[designGrowth.length - 1];
  const summary = `Product Management grows ${Math.round(
    ((pmEnd - pmStart) / pmStart) * 100
  )}% through 2035, while Design & Research stays close to keep dual-track discovery healthy.`;
  const bullets = [
    "Product analytics leads act as connective tissue between data, design, and monetization.",
    "Design systems architects reduce rework ~27% by aligning code and component libraries.",
    "Pair PMs with reliability strategists when shipping automation-heavy experiences."
  ];
  return { summary, bullets };
}
