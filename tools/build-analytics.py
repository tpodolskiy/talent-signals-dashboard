#!/usr/bin/env python3
"""Aggregate CSV datasets into the analytics JSON consumed by the UI."""
import csv
import json
from collections import defaultdict
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "data" / "analytics-data.json"

TOPICS = ["headcount", "salary", "investment", "regional", "specialties", "projections"]


def load(topic):
    with (DATA_DIR / f"{topic}.csv").open(encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def build_market(investment_rows):
    total = {}
    share = {}
    for row in investment_rows:
        metric = row["Metric"]
        year = int(row["Year"])
        value = float(row["Value"].replace(",", ""))
        if metric in {
            "Global datacenter spending (systems software services)",
            "Global datacenter spending (projected)",
        }:
            total[year] = value
        elif metric == "AI share of datacenter spending":
            share[year] = value / 100.0
        elif metric == "AI share of datacenter spending (projected)":
            share[year] = value / 100.0
        elif metric == "AI share of IT revenues (projected)":
            share.setdefault(year, value / 100.0)

    years = sorted(total)
    ai_spend = [round(total[y] * share.get(y, 0), 2) if share.get(y) else None for y in years]
    return {
        "years": years,
        "totalDatacenterSpend": [round(total[y], 2) for y in years],
        "aiSpendEstimate": ai_spend,
        "aiSharePercent": [round(share.get(y, 0) * 100, 1) for y in years],
    }


def build_allocation(investment_rows):
    buckets = {
        "Public Cloud Platforms": 0.0,
        "Generative AI Tools": 0.0,
        "Security Platforms": 0.0,
    }
    for row in investment_rows:
        metric = row["Metric"]
        if metric == "AI budget allocation - public cloud platforms":
            buckets["Public Cloud Platforms"] = float(row["Value"])
        elif metric == "AI budget allocation - generative AI tools":
            buckets["Generative AI Tools"] = float(row["Value"])
        elif metric == "AI budget allocation - security platforms":
            buckets["Security Platforms"] = float(row["Value"])
    buckets["Other Initiatives"] = max(0.0, 100.0 - sum(buckets.values()))
    return [{"label": label, "value": round(value, 2)} for label, value in buckets.items()]


def build_salary(salary_rows):
    role_map = {
        "software engineer": "Software Engineering",
        "developer": "Software Engineering",
        "devops": "Platform & DevOps",
        "platform engineer": "Platform & DevOps",
        "sre": "Platform & DevOps",
        "product manager": "Product Management",
        "product designer": "Product & Design",
        "ux": "Product & Design",
        "designer": "Product & Design",
        "qa": "QA & Reliability",
        "quality assurance": "QA & Reliability",
        "tester": "QA & Reliability",
    }
    year_values = defaultdict(list)
    for row in salary_rows:
        metric = row["Metric"].lower()
        role = next((label for key, label in role_map.items() if key in metric), None)
        if not role:
            continue
        try:
            value = float(row["Value"].replace(",", ""))
        except ValueError:
            continue
        if value < 1000:
            continue
        year = int(row["Year"])
        year_values[(role, year)].append(value)
    roles = sorted({role for role, _ in year_values})
    years = sorted({year for _, year in year_values})
    series = {}
    for role in roles:
        role_series = []
        for year in years:
            values = year_values.get((role, year))
            role_series.append(round(sum(values) / len(values), 2) if values else None)

        # Forward-fill gaps so line charts render continuous trends.
        last_value = None
        for index, value in enumerate(role_series):
            if value is not None:
                last_value = value
            elif last_value is not None:
                role_series[index] = last_value

        # Back-fill leading nulls with the first observed data point.
        first_value = next((val for val in role_series if val is not None), None)
        if first_value is not None:
            for index, value in enumerate(role_series):
                if value is None:
                    role_series[index] = first_value
                else:
                    break

        series[role] = role_series
    return {"years": years, "roles": series}


def build_headcount(headcount_rows):
    developers = {}
    qa_market = {}
    for row in headcount_rows:
        metric = row["Metric"]
        try:
            year = int(row["Year"])
            value = float(row["Value"].replace(",", ""))
        except ValueError:
            continue
        if metric.startswith("Global software developers"):
            developers[year] = value
        elif "automation" in metric.lower():
            qa_market[year] = value
    years = sorted(set(developers.keys()) | set(qa_market.keys()))
    values = [developers.get(year) for year in years]
    qa_series = [qa_market.get(year) for year in years]
    return {"years": years, "values": values, "qaMarket": qa_series}


def build_specialties(specialty_rows):
    entries = []
    for row in specialty_rows:
        if row["Unit"] != "percent":
            continue
        try:
            value = float(row["Value"])
        except ValueError:
            continue
        entries.append((value, row["Metric"], row["Source"]))
    entries.sort(reverse=True)
    return [
        {"metric": metric, "value": round(value, 1), "source": source}
        for value, metric, source in entries[:6]
    ]


def build_regional(regional_rows, headcount_rows, projection_rows):
    highlights = {}
    for row in headcount_rows:
        metric = row["Metric"]
        if metric.startswith("Tech hiring rate"):
            try:
                value = float(row["Value"].replace(",", ""))
            except ValueError:
                continue
            region = row["Region/Role"].strip()
            highlights[region] = {
                "metric": "Tech hiring rate",
                "value": round(value, 1),
                "region": region
            }
    for row in projection_rows:
        if row["Metric"] == "Software development roles growth (10-year forecast)":
            try:
                value = float(row["Value"].replace(",", ""))
            except ValueError:
                continue
            highlights.setdefault("United States", {
                "metric": "10-year dev role growth",
                "value": round(value, 1),
                "region": "United States"
            })
    ordered = sorted(highlights.values(), key=lambda item: item["value"], reverse=True)
    return ordered


def build_projections(projection_rows):
    buckets = defaultdict(list)
    for row in projection_rows:
        try:
            year = int(row["Year"])
            value = float(row["Value"].replace(",", ""))
        except ValueError:
            continue
        buckets[row["Metric"]].append((year, value, row["Unit"]))
    series = []
    for metric, points in buckets.items():
        points.sort()
        series.append({
            "metric": metric,
            "points": [{"year": year, "value": value, "unit": unit} for year, value, unit in points]
        })
    return series


def main():
    datasets = {topic: load(topic) for topic in TOPICS}
    analytics = {
        "market": build_market(datasets["investment"]),
        "allocation": build_allocation(datasets["investment"]),
        "salary": build_salary(datasets["salary"]),
        "headcount": build_headcount(datasets["headcount"]),
        "specialties": build_specialties(datasets["specialties"]),
        "regional": build_regional(datasets["regional"], datasets["headcount"], datasets["projections"]),
        "projections": build_projections(datasets["projections"]),
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(analytics, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT.relative_to(Path.cwd())}")


if __name__ == "__main__":
    main()
