// Standard per-ACRE fertilizer recommendations (approximate, commonly used
// agriculture guidance in India). Quantities are in kg per acre.
// These are general guidelines — actual needs vary with soil test & region.
// NOTE: This is pure data + math. No AI / external API is used anywhere here.

export const CROPS = [
  {
    id: "wheat",
    name: "Wheat (गेहूँ)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 110 },
      { name: "DAP", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 20 },
    ],
  },
  {
    id: "paddy",
    name: "Paddy / Rice (धान)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 110 },
      { name: "DAP", keyword: "dap", kgPerAcre: 50 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 35 },
    ],
  },
  {
    id: "maize",
    name: "Maize (मक्का)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 120 },
      { name: "DAP", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 30 },
    ],
  },
  {
    id: "potato",
    name: "Potato (आलू)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 130 },
      { name: "DAP", keyword: "dap", kgPerAcre: 110 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 55 },
    ],
  },
  {
    id: "tomato",
    name: "Tomato (टमाटर)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", keyword: "dap", kgPerAcre: 70 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 50 },
    ],
  },
  {
    id: "sugarcane",
    name: "Sugarcane (गन्ना)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 220 },
      { name: "DAP", keyword: "dap", kgPerAcre: 65 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 70 },
    ],
  },
  {
    id: "cotton",
    name: "Cotton (कपास)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 30 },
    ],
  },
  {
    id: "mustard",
    name: "Mustard (सरसों)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 80 },
      { name: "DAP", keyword: "dap", kgPerAcre: 45 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 15 },
    ],
  },
  {
    id: "onion",
    name: "Onion (प्याज)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", keyword: "dap", kgPerAcre: 65 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 45 },
    ],
  },
  {
    id: "soybean",
    name: "Soybean (सोयाबीन)",
    fertilizers: [
      { name: "Urea", keyword: "urea", kgPerAcre: 30 },
      { name: "DAP", keyword: "dap", kgPerAcre: 70 },
      { name: "Potash (MOP)", keyword: "potash", kgPerAcre: 30 },
    ],
  },
];

// Convert a land area into acres. Bigha varies by region — using a common
// approximation; the UI notes this.
export const AREA_UNITS = [
  { id: "acre", label: "Acre (एकड़)", toAcre: 1 },
  { id: "bigha", label: "Bigha (बीघा, approx)", toAcre: 0.4 },
  { id: "hectare", label: "Hectare (हेक्टेयर)", toAcre: 2.471 },
];

// Parse a product "size" string like "25 Kg", "500 g", "1 L" into kilograms.
// Returns null if it isn't a weight we can use for bag math (e.g. liquids).
export const parseSizeKg = (sizeStr) => {
  if (!sizeStr) return null;
  const match = String(sizeStr)
    .toLowerCase()
    .match(/([\d.]+)\s*(kg|kilogram|g|gm|gram)/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  if (!value) return null;
  const unit = match[2];
  if (unit.startsWith("k")) return value; // kg
  return value / 1000; // grams -> kg
};

// Find the cheapest shop product whose name/category matches a fertilizer keyword.
export const findProductForFertilizer = (productList, keyword) => {
  const matches = productList.filter((p) => {
    const haystack = `${p.name} ${p.category}`.toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });
  if (matches.length === 0) return null;
  return matches.sort((a, b) => a.price - b.price)[0];
};
