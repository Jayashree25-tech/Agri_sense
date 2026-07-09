// ---- Crop knowledge base ----
// baseTempC: base temperature used for Growing Degree Day (GDD) calculation
//   GDD (per day) = max(0, avgTemp - baseTempC)
// gddToMaturity: rough total GDD needed to reach maturity/harvest (approximate, for demo purposes)
// idealTempC: [min, max] ideal growing temperature range
// idealHumidity: [min, max] ideal relative humidity % range
// waterNeedMm: rough daily water requirement in mm (very approximate, for demo purposes)

export const CROPS = {
  wheat: {
    label: 'Wheat',
    baseTempC: 5,
    gddToMaturity: 1700,
    idealTempC: [10, 25],
    idealHumidity: [40, 70],
    waterNeedMm: 4,
    diseaseRisks: [
      {
        name: 'Rust (Yellow/Brown Rust)',
        condition: (w) => w.humidity >= 70 && w.tempC >= 10 && w.tempC <= 22,
        message: 'High humidity with mild temperatures favors rust fungus. Inspect leaves for orange/yellow pustules.',
      },
      {
        name: 'Powdery Mildew',
        condition: (w) => w.humidity >= 60 && w.tempC >= 15 && w.tempC <= 22 && w.condition === 'Clouds',
        message: 'Cool, humid, overcast conditions favor powdery mildew. Watch for white powdery patches on leaves.',
      },
    ],
  },
  rice: {
    label: 'Rice',
    baseTempC: 10,
    gddToMaturity: 2000,
    idealTempC: [20, 35],
    idealHumidity: [60, 90],
    waterNeedMm: 8,
    diseaseRisks: [
      {
        name: 'Blast Disease',
        condition: (w) => w.humidity >= 85 && w.tempC >= 20 && w.tempC <= 28,
        message: 'High humidity and warm temps strongly favor rice blast. Monitor leaves for diamond-shaped lesions.',
      },
      {
        name: 'Bacterial Leaf Blight',
        condition: (w) => w.condition === 'Rain' && w.tempC >= 25,
        message: 'Warm, rainy conditions promote bacterial leaf blight spread, especially after flooding.',
      },
    ],
  },
  cotton: {
    label: 'Cotton',
    baseTempC: 15,
    gddToMaturity: 2200,
    idealTempC: [21, 35],
    idealHumidity: [30, 60],
    waterNeedMm: 6,
    diseaseRisks: [
      {
        name: 'Aphid Infestation',
        condition: (w) => w.humidity < 50 && w.tempC >= 25 && w.tempC <= 35,
        message: 'Hot, dry weather favors rapid aphid population growth. Check undersides of leaves.',
      },
      {
        name: 'Boll Rot',
        condition: (w) => w.humidity >= 75 && (w.condition === 'Rain' || w.condition === 'Drizzle'),
        message: 'Prolonged wet conditions increase risk of boll rot in developing cotton bolls.',
      },
    ],
  },
  tomato: {
    label: 'Tomato',
    baseTempC: 10,
    gddToMaturity: 1200,
    idealTempC: [18, 27],
    idealHumidity: [50, 70],
    waterNeedMm: 5,
    diseaseRisks: [
      {
        name: 'Early/Late Blight',
        condition: (w) => w.humidity >= 70 && w.tempC >= 18 && w.tempC <= 27,
        message: 'Warm, humid conditions are ideal for blight fungus. Inspect lower leaves for dark spots.',
      },
      {
        name: 'Blossom End Rot Risk',
        condition: (w) => w.humidity < 40 && w.tempC >= 28,
        message: 'Hot, dry conditions can cause calcium uptake issues leading to blossom end rot. Maintain consistent watering.',
      },
    ],
  },
  potato: {
    label: 'Potato',
    baseTempC: 7,
    gddToMaturity: 1400,
    idealTempC: [15, 22],
    idealHumidity: [60, 80],
    waterNeedMm: 5,
    diseaseRisks: [
      {
        name: 'Late Blight',
        condition: (w) => w.humidity >= 80 && w.tempC >= 10 && w.tempC <= 22,
        message: 'Cool, wet conditions strongly favor late blight — the same disease behind the Irish famine. Act fast if seen.',
      },
    ],
  },
  sugarcane: {
    label: 'Sugarcane',
    baseTempC: 10,
    gddToMaturity: 3500,
    idealTempC: [22, 35],
    idealHumidity: [60, 85],
    waterNeedMm: 7,
    diseaseRisks: [
      {
        name: 'Red Rot',
        condition: (w) => w.humidity >= 80 && w.tempC >= 25 && w.tempC <= 32,
        message: 'Warm, humid conditions favor red rot fungus, a major sugarcane disease. Inspect stalks for reddening.',
      },
    ],
  },
};

export const VALID_CROPS = Object.keys(CROPS);
