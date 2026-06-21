// Standard per-ACRE fertilizer recommendations (approximate, commonly used
// agriculture guidance in India). Quantities are in kg per acre.
// These are general guidelines — actual needs vary with soil test & region.
// NOTE: This is pure data + math. No AI / external API is used anywhere here.

export const CROPS = [
  {
    id: "wheat",
    name: "Wheat",
    nameHi: "गेहूँ",
    emoji: "🌾",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 110 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 20 },
    ],
  },
  {
    id: "paddy",
    name: "Paddy / Rice",
    nameHi: "धान",
    emoji: "🌾",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 110 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 50 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 35 },
    ],
  },
  {
    id: "maize",
    name: "Maize",
    nameHi: "मक्का",
    emoji: "🌽",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 120 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 30 },
    ],
  },
  {
    id: "potato",
    name: "Potato",
    nameHi: "आलू",
    emoji: "🥔",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 130 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 110 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 55 },
    ],
  },
  {
    id: "tomato",
    name: "Tomato",
    nameHi: "टमाटर",
    emoji: "🍅",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 70 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 50 },
    ],
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    nameHi: "गन्ना",
    emoji: "🎋",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 220 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 65 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 70 },
    ],
  },
  {
    id: "cotton",
    name: "Cotton",
    nameHi: "कपास",
    emoji: "🧵",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 30 },
    ],
  },
  {
    id: "mustard",
    name: "Mustard",
    nameHi: "सरसों",
    emoji: "🌼",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 80 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 45 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 15 },
    ],
  },
  {
    id: "onion",
    name: "Onion",
    nameHi: "प्याज",
    emoji: "🧅",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 65 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 45 },
    ],
  },
  {
    id: "soybean",
    name: "Soybean",
    nameHi: "सोयाबीन",
    emoji: "🫘",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 30 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 70 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 30 },
    ],
  },
  {
    id: "lentil",
    name: "Lentil (Masoor)",
    nameHi: "मसूर",
    emoji: "🫘",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 35 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 45 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 15 },
    ],
  },
  {
    id: "gram",
    name: "Gram (Chana)",
    nameHi: "चना",
    emoji: "🫛",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 35 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 50 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 15 },
    ],
  },
  {
    id: "pigeonpea",
    name: "Pigeon Pea (Arhar)",
    nameHi: "अरहर",
    emoji: "🌿",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 35 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 15 },
    ],
  },
  {
    id: "pea",
    name: "Pea (Matar)",
    nameHi: "मटर",
    emoji: "🫛",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 40 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 50 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 20 },
    ],
  },
  {
    id: "moong",
    name: "Green Gram (Moong)",
    nameHi: "मूँग",
    emoji: "🫘",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 25 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 45 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 15 },
    ],
  },
  {
    id: "jute",
    name: "Jute (Pat)",
    nameHi: "जूट / पटसन",
    emoji: "🌿",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 80 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 40 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 20 },
    ],
  },
  {
    id: "bajra",
    name: "Pearl Millet (Bajra)",
    nameHi: "बाजरा",
    emoji: "🌾",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 80 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 40 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 20 },
    ],
  },
  {
    id: "barley",
    name: "Barley (Jau)",
    nameHi: "जौ",
    emoji: "🌾",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 45 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 20 },
    ],
  },
  {
    id: "garlic",
    name: "Garlic (Lehsun)",
    nameHi: "लहसुन",
    emoji: "🧄",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 70 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 50 },
    ],
  },
  {
    id: "chilli",
    name: "Chilli (Mirch)",
    nameHi: "मिर्च",
    emoji: "🌶️",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 70 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 50 },
    ],
  },
  {
    id: "brinjal",
    name: "Brinjal (Baingan)",
    nameHi: "बैंगन",
    emoji: "🍆",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 100 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 75 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 50 },
    ],
  },
  {
    id: "cauliflower",
    name: "Cauliflower (Gobhi)",
    nameHi: "फूलगोभी",
    emoji: "🥦",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 100 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 80 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 50 },
    ],
  },
  {
    id: "litchi",
    name: "Litchi",
    nameHi: "लीची",
    emoji: "🍒",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 120 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 60 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 80 },
    ],
  },
  {
    id: "mango",
    name: "Mango (Aam)",
    nameHi: "आम",
    emoji: "🥭",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 90 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 55 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 70 },
    ],
  },
  {
    id: "banana",
    name: "Banana (Kela)",
    nameHi: "केला",
    emoji: "🍌",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 200 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 110 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 300 },
    ],
  },
  {
    id: "makhana",
    name: "Makhana (Foxnut)",
    nameHi: "मखाना",
    emoji: "🪷",
    fertilizers: [
      { name: "Urea", nameHi: "यूरिया", keyword: "urea", kgPerAcre: 50 },
      { name: "DAP", nameHi: "डीएपी", keyword: "dap", kgPerAcre: 30 },
      { name: "Potash (MOP)", nameHi: "पोटाश", keyword: "potash", kgPerAcre: 20 },
    ],
  },
];

// Land-area units -> conversion factor to ACRE. Values follow the common
// Bihar/Mithila system (1 bigha = 20 katha, 1 katha = 20 dhur).
export const AREA_UNITS = [
  { id: "acre", label: "Acre", labelHi: "एकड़", toAcre: 1 },
  { id: "bigha", label: "Bigha", labelHi: "बीघा", toAcre: 0.625 },
  { id: "katha", label: "Katha", labelHi: "कट्ठा", toAcre: 0.03125 },
  { id: "dhur", label: "Dhur", labelHi: "धुर", toAcre: 0.0015625 },
];

// Crop-protection problems. Each maps to the shop product category/keywords
// that solve it, so suggestions always reflect real stock (no fake dosages).
export const PROBLEMS = [
  {
    id: "insect",
    label: "Insects / Pests",
    labelHi: "कीड़े-मकोड़े",
    emoji: "🐛",
    tip: "Mix the insecticide in water and spray in the cool evening hours. Wear a mask, gloves and cover your skin.",
    tipHi: "कीटनाशक को पानी में मिलाकर शाम के ठंडे समय में छिड़काव करें। मास्क, दस्ताने पहनें और शरीर ढकें।",
    ratePerAcre: 250,
    rateUnit: "ml",
    family: "liquid",
    matchCategories: ["insecticide", "pesticide"],
    matchKeywords: [
      "insecticide",
      "imida",
      "chlorpyri",
      "acephate",
      "cypermethrin",
      "monocrotophos",
    ],
  },
  {
    id: "fungus",
    label: "Fungal Disease",
    labelHi: "फफूंदी / रोग",
    emoji: "🍄",
    tip: "Spray the fungicide evenly on leaves at the first sign of spots/blight. Repeat after 10–12 days if needed.",
    tipHi: "पत्तों पर धब्बे/झुलसा दिखते ही फफूंदनाशक का समान छिड़काव करें। ज़रूरत पर 10–12 दिन बाद दोहराएँ।",
    ratePerAcre: 500,
    rateUnit: "g",
    family: "solid",
    matchCategories: ["fungicide", "fungicides"],
    matchKeywords: [],
  },
  {
    id: "weed",
    label: "Weeds",
    labelHi: "खरपतवार",
    emoji: "🌿",
    tip: "Spray the herbicide on weeds, not on the crop. Use a hood/shield on the nozzle and avoid windy days.",
    tipHi: "खरपतवार पर ही शाकनाशी छिड़कें, फसल पर नहीं। नोज़ल पर हुड लगाएँ और तेज़ हवा में छिड़काव न करें।",
    ratePerAcre: 1000,
    rateUnit: "ml",
    family: "liquid",
    matchCategories: ["herbicide"],
    matchKeywords: [],
  },
];

// Find shop products that treat a given problem (by category or name keyword).
export const findProtectionProducts = (productList, problem) => {
  return productList.filter((p) => {
    const cat = (p.category || "").toLowerCase();
    const name = (p.name || "").toLowerCase();
    if (problem.matchCategories.some((c) => cat.includes(c))) return true;
    if (problem.matchKeywords.some((k) => name.includes(k))) return true;
    return false;
  });
};

// Standard spray assumptions for a knapsack sprayer.
export const SPRAY = { waterPerAcre: 150, tankSize: 15 };

// Parse a product size into { value, family } where family is 'liquid' (value
// in ml) or 'solid' (value in g). Returns null if unrecognised.
export const parseSizeAmount = (sizeStr) => {
  if (!sizeStr) return null;
  const m = String(sizeStr)
    .toLowerCase()
    .match(/([\d.]+)\s*(kg|kilogram|gm|gram|g|ml|ltr|litre|liter|l)\b/);
  if (!m) return null;
  const value = parseFloat(m[1]);
  if (!value) return null;
  const u = m[2];
  if (u === "kg" || u === "kilogram") return { value: value * 1000, family: "solid" };
  if (u === "g" || u === "gm" || u === "gram") return { value, family: "solid" };
  if (u === "l" || u === "ltr" || u === "litre" || u === "liter")
    return { value: value * 1000, family: "liquid" };
  return { value, family: "liquid" }; // ml
};

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
