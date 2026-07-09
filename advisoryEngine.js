import { CROPS } from './cropData.js';

// ---- Growing Degree Days for a single day ----
export function calcDailyGDD(avgTempC, baseTempC) {
  return Math.max(0, avgTempC - baseTempC);
}

// ---- Irrigation advice based on forecast rain chance + recent humidity ----
function irrigationAdvice(crop, current, forecastDays) {
  const nextRainDay = forecastDays.find((d) => d.pop >= 0.5);
  const heavyRainSoon = forecastDays.slice(0, 2).some((d) => d.pop >= 0.6);

  if (heavyRainSoon) {
    return {
      action: 'skip',
      headline: 'Skip irrigation',
      detail: `Rain is likely in the next 2 days (${Math.round(
        (nextRainDay?.pop || 0.6) * 100
      )}% chance). Save water and let natural rainfall do the work.`,
    };
  }
  if (current.humidity >= 75 && current.condition !== 'Clear') {
    return {
      action: 'reduce',
      headline: 'Reduce irrigation',
      detail: `Humidity is high (${current.humidity}%). Soil moisture is likely retained longer than usual — cut back slightly to avoid waterlogging.`,
    };
  }
  if (current.tempC >= 32 && current.humidity < 40) {
    return {
      action: 'irrigate',
      headline: 'Irrigate today',
      detail: `Hot and dry conditions (${current.tempC}°C, ${current.humidity}% humidity) will increase crop water stress. Recommended daily water need: ~${crop.waterNeedMm}mm.`,
    };
  }
  return {
    action: 'normal',
    headline: 'Maintain normal irrigation schedule',
    detail: `Conditions are within a typical range. Stick to your regular irrigation routine (~${crop.waterNeedMm}mm/day guideline for this crop).`,
  };
}

// ---- Disease/pest risk check against today's conditions ----
function diseaseRisks(crop, current) {
  return crop.diseaseRisks
    .filter((rule) => rule.condition(current))
    .map((rule) => ({ name: rule.name, message: rule.message }));
}

// ---- Sowing/Harvest window suggestion from 5-day forecast ----
function fieldWorkWindow(forecastDays) {
  return forecastDays.map((d) => {
    let verdict = 'good';
    let reason = 'Stable conditions — safe for fieldwork, sowing, or harvest.';
    if (d.pop >= 0.6) {
      verdict = 'avoid';
      reason = `High rain chance (${Math.round(d.pop * 100)}%) — avoid harvesting or sowing today.`;
    } else if (d.pop >= 0.3) {
      verdict = 'caution';
      reason = `Moderate rain chance (${Math.round(d.pop * 100)}%) — plan fieldwork for earlier in the day.`;
    } else if (d.maxC >= 38) {
      verdict = 'caution';
      reason = `Very high temperature expected (${d.maxC}°C) — avoid strenuous fieldwork in peak afternoon heat.`;
    }
    return { date: d.date, verdict, reason };
  });
}

// ---- Build a natural-language advisory paragraph from the structured data ----
function buildSummary({ cropLabel, cityLabel, irrigation, risks, gdd }) {
  let text = `${cropLabel} conditions in ${cityLabel}: ${irrigation.detail} `;
  if (risks.length) {
    text += `Watch out for ${risks.map((r) => r.name).join(' and ')} given current conditions. `;
  } else {
    text += `No significant pest or disease risk detected right now. `;
  }
  text += `Accumulated growing degree days so far this season: ${gdd.accumulated} of an estimated ${gdd.toMaturity} needed for maturity (${gdd.percentComplete}% of the way there).`;
  return text;
}

/**
 * Build a full advisory for a crop given current weather + forecast.
 * seasonStartDate: ISO date string (YYYY-MM-DD) the farmer marks as sowing date,
 * used to estimate accumulated GDD since planting.
 */
export function buildAdvisory({ cropKey, current, forecastDays, seasonStartDate }) {
  const crop = CROPS[cropKey];
  if (!crop) throw new Error(`Unknown crop: ${cropKey}`);

  const irrigation = irrigationAdvice(crop, current, forecastDays);
  const risks = diseaseRisks(crop, current);
  const fieldWork = fieldWorkWindow(forecastDays);

  // Simple GDD estimate: assume average daily temp ~ current temp times days elapsed
  // since seasonStartDate (a real system would sum actual daily history; this is a
  // reasonable approximation for a demo/placement project).
  let daysElapsed = 1;
  if (seasonStartDate) {
    const start = new Date(seasonStartDate + 'T00:00:00');
    const now = new Date();
    daysElapsed = Math.max(1, Math.round((now - start) / (1000 * 60 * 60 * 24)));
  }
  const dailyGDD = calcDailyGDD(current.tempC, crop.baseTempC);
  const accumulated = Math.round(dailyGDD * daysElapsed);
  const percentComplete = Math.min(100, Math.round((accumulated / crop.gddToMaturity) * 100));

  const gdd = {
    dailyGDD: Math.round(dailyGDD * 10) / 10,
    accumulated,
    toMaturity: crop.gddToMaturity,
    percentComplete,
    daysElapsed,
  };

  const idealTemp = current.tempC >= crop.idealTempC[0] && current.tempC <= crop.idealTempC[1];
  const idealHumidity = current.humidity >= crop.idealHumidity[0] && current.humidity <= crop.idealHumidity[1];

  const summary = buildSummary({
    cropLabel: crop.label,
    cityLabel: current.city,
    irrigation,
    risks,
    gdd,
  });

  return {
    crop: { key: cropKey, label: crop.label, idealTempC: crop.idealTempC, idealHumidity: crop.idealHumidity },
    conditionFit: { idealTemp, idealHumidity },
    irrigation,
    risks,
    fieldWork,
    gdd,
    summary,
  };
}
