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
    // Weeds need one more answer — the right medicine is COMPLETELY different
    // for a standing crop vs clearing an empty field (non-selective kills all).
    contexts: [
      {
        id: "standing",
        emoji: "🌾",
        label: "Weeds inside my standing crop",
        labelHi: "खड़ी फसल के अंदर खरपतवार",
      },
      {
        id: "clearfield",
        emoji: "🚜",
        label: "Clear an empty field / bunds (no crop)",
        labelHi: "खाली खेत / मेड़ साफ़ करना (फसल नहीं)",
      },
    ],
  },
];

// ===================== Product safety knowledge =====================
// Real-world knowledge about specific protection products the shop sells.
// This is what stops the advisor recommending a non-selective herbicide
// (Mera 71 / Glycel / Roundup = glyphosate — kills EVERY green plant)
// to a farmer with a standing crop.
export const PROTECTION_KNOWLEDGE = [
  {
    id: "glyphosate",
    match: ["mera 71", "mera71", "glycel", "roundup", "glyphosate"],
    selectivity: "nonselective",
    videoKey: "mera71",
    // dose depends on formulation: liquid SL ~1 L/acre, SG granules ~500 g/acre
    ratePerAcre: { liquid: 1000, solid: 500 },
    warn: {
      en: "Kills EVERY green plant it touches — crop included. Use ONLY to clear empty fields, bunds or before sowing. NEVER spray on or near a standing crop.",
      hi: "यह जिस भी हरे पौधे पर पड़ेगा उसे मार देगा — फसल भी। केवल खाली खेत, मेड़ या बुवाई से पहले प्रयोग करें। खड़ी फसल पर या उसके पास कभी न छिड़कें।",
    },
  },
  {
    id: "bispyribac",
    match: ["nominee"],
    selectivity: "selective",
    crops: ["paddy"],
    videoKey: "nominee",
    ratePerAcre: { liquid: 100 },
    note: {
      en: "Only for paddy/rice — kills grassy weeds without harming the rice plants.",
      hi: "केवल धान के लिए — धान को नुकसान पहुँचाए बिना घास-फूस के खरपतवार मारता है।",
    },
  },
  {
    id: "24d",
    match: ["weedmar", "topper"],
    selectivity: "selective",
    crops: ["wheat", "paddy", "maize", "sugarcane", "bajra", "barley"],
    ratePerAcre: { solid: 400, liquid: 400 },
    note: {
      en: "Kills broad-leaf weeds in cereal crops (wheat, paddy, maize, sugarcane). NOT for vegetable or broad-leaf crops.",
      hi: "अनाज वाली फसलों (गेहूँ, धान, मक्का, गन्ना) में चौड़ी पत्ती के खरपतवार मारता है। सब्ज़ी या चौड़ी पत्ती वाली फसलों के लिए नहीं।",
    },
  },
  {
    id: "clodinafop",
    match: ["topik", "clodinafop"],
    selectivity: "selective",
    crops: ["wheat"],
    ratePerAcre: { solid: 160 },
    note: {
      en: "Only for wheat — kills grassy weeds like gulli danda (Phalaris minor) and wild oats without harming the wheat.",
      hi: "केवल गेहूँ के लिए — गुल्ली डंडा और जंगली जई जैसी घास मारता है, गेहूँ को नुकसान नहीं।",
    },
  },
  {
    id: "atrazine",
    match: ["atrataf", "atrazine"],
    selectivity: "selective",
    crops: ["maize", "sugarcane"],
    ratePerAcre: { solid: 500 },
    note: {
      en: "For maize and sugarcane — spray on moist soil just after sowing, before the weeds come up.",
      hi: "मक्का और गन्ने के लिए — बुवाई के तुरंत बाद, खरपतवार निकलने से पहले नम मिट्टी पर छिड़कें।",
    },
  },
  {
    id: "pretilachlor",
    match: ["rifit", "pretilachlor"],
    selectivity: "selective",
    crops: ["paddy"],
    ratePerAcre: { liquid: 500 },
    note: {
      en: "Only for transplanted paddy — apply within 3-4 days of transplanting to stop weeds before they sprout.",
      hi: "केवल रोपाई वाले धान के लिए — रोपाई के 3-4 दिन के अंदर डालें ताकि खरपतवार उगने से पहले ही रुक जाएँ।",
    },
  },
  // Popular insecticides / fungicides — notes + tutorial videos.
  {
    id: "confidor",
    match: ["confidor"],
    videoKey: "confidor",
    note: {
      en: "Systemic insecticide for sucking pests — aphids, jassids, whitefly, thrips.",
      hi: "रस चूसने वाले कीटों — माहू, हरा तेला, सफेद मक्खी, थ्रिप्स — के लिए असरदार दवा।",
    },
  },
  {
    id: "coragen",
    match: ["coragen"],
    videoKey: "coragen",
    ratePerAcre: { liquid: 60 },
    note: {
      en: "Very strong on stem borers and caterpillars — a few ml per tank is enough.",
      hi: "तना छेदक और सूंडी (इल्ली) पर बहुत असरदार — प्रति टैंक कुछ ml ही काफी है।",
    },
  },
  {
    id: "saaf",
    match: ["saaf"],
    videoKey: "saaf",
    note: {
      en: "Double-action fungicide for leaf spots, blight and wilt on most crops.",
      hi: "पत्ती धब्बा, झुलसा और उकठा रोग के लिए दो-तरफ़ा असर वाला फफूंदनाशक।",
    },
  },
];

// Match a shop product to its knowledge entry (by name keyword).
export const findKnowledge = (product) => {
  const name = (product?.name || "").toLowerCase();
  return (
    PROTECTION_KNOWLEDGE.find((k) => k.match.some((m) => name.includes(m))) ||
    null
  );
};

// Pick the right spray product for a problem, respecting:
//  - crop safety (selective vs non-selective herbicides, crop suitability)
//  - product-specific dose rates where known
//  - the farmer's budget (cheapest option that fits; else cheapest overall)
// Returns { recommended, overBudget, noSafe } where recommended =
// { product, know, amt, dose, rateUnit, packs, cost } or null.
export const computeSprayPlan = (
  productList,
  problem,
  { cropId, weedContext, budgetNum, acres }
) => {
  const enriched = findProtectionProducts(productList, problem).map((p) => ({
    product: p,
    know: findKnowledge(p),
    amt: parseSizeAmount(p.size),
  }));

  let pool = enriched;
  let noSafe = false;
  if (problem.id === "weed") {
    if (weedContext === "clearfield") {
      // Non-selective is exactly what field clearing needs.
      const nonsel = enriched.filter(
        (c) => c.know?.selectivity === "nonselective"
      );
      pool = nonsel.length ? nonsel : enriched;
    } else {
      // Standing crop: ONLY known-selective products safe for this crop.
      // Unknown herbicides are excluded — safer to send the farmer to the
      // shop counter than to guess.
      pool = enriched.filter(
        (c) =>
          c.know?.selectivity === "selective" &&
          (!c.know.crops || c.know.crops.includes(cropId))
      );
      noSafe = pool.length === 0;
    }
  }

  const withCost = pool.map((c) => {
    const family = c.amt?.family;
    const rate =
      c.know?.ratePerAcre?.[family] ??
      (family === problem.family ? problem.ratePerAcre : null);
    let dose = null;
    let packs = null;
    let cost = null;
    if (rate && c.amt) {
      dose = Math.round(rate * acres);
      packs = Math.ceil(dose / c.amt.value);
      cost = packs * c.product.price;
    }
    return {
      ...c,
      dose,
      packs,
      cost,
      rateUnit: family === "solid" ? "g" : "ml",
    };
  });

  const computable = withCost
    .filter((c) => c.cost !== null)
    .sort((a, b) => a.cost - b.cost);
  const inBudget =
    budgetNum > 0 ? computable.filter((c) => c.cost <= budgetNum) : computable;
  const recommended =
    inBudget[0] ||
    computable[0] ||
    [...withCost].sort((a, b) => a.product.price - b.product.price)[0] ||
    null;
  const overBudget = !!(
    recommended &&
    budgetNum > 0 &&
    recommended.cost !== null &&
    recommended.cost > budgetNum
  );

  return { recommended, overBudget, noSafe };
};

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

// When a farmer's budget can't cover the full plan, fertilizers are bought in
// this order of agronomic importance (basal phosphorus first, then nitrogen,
// then potash). Reasons are shown on the plan cards so the farmer knows WHY.
export const FERTILIZER_PRIORITY = {
  dap: {
    rank: 1,
    why: "Roots & flowering — must go in at sowing",
    whyHi: "जड़ और फूल के लिए — बुवाई के समय ज़रूरी",
  },
  urea: {
    rank: 2,
    why: "Green growth — can be given in splits",
    whyHi: "हरियाली और बढ़वार — किस्तों में दे सकते हैं",
  },
  potash: {
    rank: 3,
    why: "Grain quality & disease strength",
    whyHi: "दाने की चमक और रोग से लड़ने की ताकत",
  },
};

// Short HINDI "how to use" tutorial videos (YouTube) so a farmer can watch
// the method right inside the advisor. Keys match fertilizer keywords,
// problem ids, and PROTECTION_KNOWLEDGE videoKeys. IDs verified live via
// YouTube oEmbed; all titles are Hindi/Devanagari farming content.
export const HOW_TO_VIDEOS = {
  urea: {
    id: "6BgZn6mOVdY",
    title: "Urea: when & how much to apply",
    titleHi: "यूरिया कब और कितना डालें",
  },
  dap: {
    id: "IuEFowHEtjo",
    title: "DAP: when & how much to apply",
    titleHi: "डीएपी खाद कब और कितना डालें",
  },
  potash: {
    id: "8u4USLG39V4",
    title: "When & how to use Potash",
    titleHi: "पोटाश कब, कितना और कैसे डालें",
  },
  insect: {
    id: "KA32DKyuVYA",
    title: "The right way to spray on crops",
    titleHi: "फसल पर छिड़काव करने का सही तरीका",
  },
  fungus: {
    id: "QDDg-3frbKg",
    title: "Which spray for fungal disease",
    titleHi: "फफूंद रोग में कौन-सा स्प्रे करें",
  },
  weed: {
    id: "Y3UALOx0uTg",
    title: "Weed control: when & how",
    titleHi: "खरपतवार नियंत्रण कैसे करें",
  },
  mera71: {
    id: "Y2tTrt1wTaQ",
    title: "How to use Mera 71 herbicide",
    titleHi: "मेरा 71 खरपतवार नाशक का उपयोग",
  },
  nominee: {
    id: "WlDWkoXVWXs",
    title: "Nominee Gold in paddy — right method",
    titleHi: "धान में नॉमिनी गोल्ड का सही तरीका",
  },
  confidor: {
    id: "ri4L8IRCMUA",
    title: "How to use Confidor insecticide",
    titleHi: "कॉन्फिडोर कीटनाशक का उपयोग",
  },
  coragen: {
    id: "6LIQ8U_W5aA",
    title: "The right way to use Coragen",
    titleHi: "कोराजन के उपयोग का सही तरीका",
  },
  saaf: {
    id: "pJg0z5KPngE",
    title: "How to use UPL Saaf fungicide",
    titleHi: "यूपीएल साफ़ फफूंदनाशक का उपयोग",
  },
};

// Split a plan across a budget: buy full bags for the most important
// fertilizers first, then as many bags of the rest as the money allows.
// budgetNum = 0/null means "no limit" (everything stays full).
// Each row gains: planBags, planCost, coveragePct, status
// (full | partial | skipped | na — na = product not stocked / no bag math).
export const allocateBudget = (rows, budgetNum) => {
  const rankOf = (r) => FERTILIZER_PRIORITY[r.keyword]?.rank ?? 99;

  if (!budgetNum || budgetNum <= 0) {
    return rows.map((r) => ({
      ...r,
      planBags: r.bags,
      planCost: r.cost,
      coveragePct: r.bags ? 100 : null,
      status: r.bags ? "full" : "na",
    }));
  }

  let remaining = budgetNum;
  const allocated = new Map();

  [...rows]
    .sort((a, b) => rankOf(a) - rankOf(b))
    .forEach((r) => {
      if (!r.product || !r.bags) {
        allocated.set(r, { planBags: null, planCost: null, coveragePct: null, status: "na" });
        return;
      }
      const affordable = Math.min(r.bags, Math.floor(remaining / r.product.price));
      remaining -= affordable * r.product.price;
      allocated.set(r, {
        planBags: affordable,
        planCost: affordable * r.product.price,
        coveragePct: Math.round((affordable / r.bags) * 100),
        status:
          affordable === r.bags ? "full" : affordable > 0 ? "partial" : "skipped",
      });
    });

  return rows.map((r) => ({ ...r, ...allocated.get(r) }));
};

// Find the best-value shop product whose name/category matches a fertilizer
// keyword — cheapest per KG (a 25 Kg bag at ₹840 beats a 1 Kg pack at ₹50),
// falling back to plain price when a size can't be parsed.
export const findProductForFertilizer = (productList, keyword) => {
  const matches = productList.filter((p) => {
    const haystack = `${p.name} ${p.category}`.toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });
  if (matches.length === 0) return null;
  const perKg = (p) => {
    const kg = parseSizeKg(p.size);
    return kg ? p.price / kg : Infinity;
  };
  return matches.sort(
    (a, b) => perKg(a) - perKg(b) || a.price - b.price
  )[0];
};
