import "./Advisor.css";
import { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  CROPS,
  AREA_UNITS,
  PROBLEMS,
  SPRAY,
  FERTILIZER_PRIORITY,
  HOW_TO_VIDEOS,
  allocateBudget,
  computeSprayPlan,
  parseSizeKg,
  findProductForFertilizer,
} from "../../data/cropData";

// Flat illustrated field scene (sun + hills + swaying crops + a farmer).
const FarmerScene = () => (
  <svg
    className="farm-scene"
    viewBox="0 0 320 190"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Farmer standing in a field"
  >
    {/* sun */}
    <circle cx="262" cy="48" r="22" fill="#FFD45E" />
    <g className="sun-rays" stroke="#FFD45E" strokeWidth="4" strokeLinecap="round">
      <line x1="289" y1="48" x2="300" y2="48" />
      <line x1="281" y1="29" x2="288" y2="22" />
      <line x1="262" y1="21" x2="262" y2="11" />
      <line x1="243" y1="29" x2="236" y2="22" />
      <line x1="235" y1="48" x2="225" y2="48" />
      <line x1="243" y1="67" x2="236" y2="74" />
      <line x1="262" y1="75" x2="262" y2="85" />
      <line x1="281" y1="67" x2="288" y2="74" />
    </g>

    {/* hills */}
    <path d="M0 150 Q80 120 160 150 T320 150 L320 190 L0 190 Z" fill="#bfe7c6" />
    <path d="M0 166 Q90 142 180 166 T320 162 L320 190 L0 190 Z" fill="#8fd49b" />

    {/* crops */}
    {[40, 70, 230, 262, 292].map((x, i) => (
      <g
        key={x}
        className={`crop crop${i + 1}`}
        transform={`translate(${x}, 124)`}
      >
        <path d="M0 38 C -3 22 0 10 0 0" stroke="#3f9d54" strokeWidth="3" fill="none" />
        <path d="M0 24 C -8 20 -11 14 -12 8" stroke="#4caf63" strokeWidth="2.5" fill="none" />
        <path d="M0 24 C 8 20 11 14 12 8" stroke="#4caf63" strokeWidth="2.5" fill="none" />
        <ellipse cx="0" cy="-2" rx="4" ry="9" fill="#e3b53d" />
      </g>
    ))}

    {/* farmer */}
    <g className="farmer">
      <ellipse cx="120" cy="171" rx="26" ry="5" fill="rgba(0,0,0,0.08)" />
      <rect x="111" y="142" width="7" height="24" rx="3" fill="#5b4636" />
      <rect x="122" y="142" width="7" height="24" rx="3" fill="#5b4636" />
      <path d="M106 110 Q120 102 134 110 L138 146 Q120 152 102 146 Z" fill="#2e9e4f" />
      <path d="M107 112 L96 134" stroke="#2e9e4f" strokeWidth="8" strokeLinecap="round" />
      <path d="M133 112 L144 134" stroke="#2e9e4f" strokeWidth="8" strokeLinecap="round" />
      <circle cx="96" cy="135" r="4" fill="#f4c193" />
      <circle cx="144" cy="135" r="4" fill="#f4c193" />
      <circle cx="120" cy="93" r="13" fill="#f4c193" />
      <ellipse cx="120" cy="83" rx="22" ry="6" fill="#9c6b3f" />
      <path d="M109 83 Q120 65 131 83 Z" fill="#b07d4b" />
    </g>
  </svg>
);

// All UI text in both languages, so the toggle can swap everything at once.
const STR = {
  en: {
    greetTitle: "Namaste, Kisan Bhai!",
    greetSub:
      "I'm your digital farming helper. Tell me — what do you need today?",
    growTitle: "Grow My Crop",
    growSub: "Tell your budget, crop & land — get the best plan you can afford.",
    protectTitle: "Protect My Crop",
    protectSub:
      "Tell your problem, budget & land — get the right medicine, safely.",
    start: "Start",
    back: "Back",
    next: "Next →",
    // wizard steps
    stepBudget: "Budget",
    stepCrop: "Crop",
    stepLand: "Land",
    stepPlan: "Plan",
    stepProblem: "Problem",
    budgetTitle: "💰 How much can you spend?",
    budgetSub:
      "Tell me your budget and I'll make the best fertilizer plan inside it. Leave empty for no limit.",
    protBudgetTitle: "💰 How much can you spend on medicine?",
    protBudgetSub:
      "I'll pick the right medicine inside your budget. Leave empty for no limit.",
    noLimit: "No limit",
    cropTitle: "🌾 Which crop are you growing?",
    protCropTitle: "🌾 Which crop needs protection?",
    landTitle: "📏 How much land do you have?",
    landClearTitle: "📏 How much area do you want to clear?",
    selectCrop: "Select Crop",
    chooseCrop: "-- Choose crop --",
    landSize: "Land Size",
    unit: "Unit",
    calculate: "Show My Plan",
    startOver: "↺ Start Again",
    forCrop: (crop, acres) => `For ${crop} on ${acres} acre`,
    forClear: (acres) => `To clear ${acres} acre`,
    clearFieldLabel: "Field clearing",
    needed: (kg) => `${kg} kg needed`,
    buyLabel: "Buy",
    bags: "bag(s)",
    packs: "pack(s)",
    addToCart: "Add to Cart",
    addAll: "🛒 Add All to Cart",
    estTotal: "Your plan total",
    fullPlanCost: "Full plan cost",
    // budget results
    budgetUsed: "Budget used",
    ofBudget: (spent, budget) => `₹${spent} of ₹${budget}`,
    fitsBudget: "🎉 Great news — your full plan fits your budget!",
    trimmedNote:
      "Your budget can't cover the full plan, so I bought the most important fertilizers first.",
    fullDose: "✓ Full dose",
    partialDose: (pct) => `◐ ${pct}% of dose`,
    skippedDose: "Budget over — skipped",
    whyFirst: "Why this order?",
    budgetLeft: (amt) => `₹${amt} left in your budget`,
    watchVideo: "▶ Watch: How to use",
    openYoutube: "Open on YouTube ↗",
    notStocked: (kg) => `Not stocked right now. You need ~${kg} kg.`,
    inStore: "Available in store — add it from the shop.",
    disclaimer:
      "⚠️ This is general guidance (standard per-acre doses). Confirm exact quantity with a soil test and your local agriculture expert.",
    protPick: "🛡️ What problem are you facing?",
    weedWhere: "Where are the weeds?",
    waterTanks: "Water tanks (15 L each)",
    doseNeeded: "Approx. medicine needed",
    tanks: "tank(s)",
    safetyHead: "Read before you spray!",
    goodToKnow: "Good to know",
    sprayFits: (cost, b) => `✓ ₹${cost} — fits inside your ₹${b} budget`,
    sprayOver: (cost, b) =>
      `This costs ₹${cost} — more than your ₹${b} budget. Ask the shop for a smaller pack, or increase the budget.`,
    noSafeProduct:
      "We don't stock a weed medicine that is SAFE for this crop. Do NOT spray a field-clearing herbicide (like Mera 71 / Glycel) on a standing crop — it will kill the crop too. Please ask at the shop counter.",
    followLabel:
      "⚠️ Approximate guidance — always follow the dose printed on the product label.",
    noProtAvailable:
      "No matching product is in stock right now — please ask the shop.",
  },
  hi: {
    greetTitle: "नमस्ते, किसान भाई!",
    greetSub: "मैं आपका डिजिटल कृषि सहायक हूँ। बताइए — आज क्या मदद चाहिए?",
    growTitle: "फसल उगाएँ",
    growSub: "बजट, फसल और ज़मीन बताइए — आपके बजट में सबसे अच्छा प्लान पाइए।",
    protectTitle: "फसल बचाएँ",
    protectSub: "समस्या, बजट और ज़मीन बताइए — सही और सुरक्षित दवा पाइए।",
    start: "शुरू करें",
    back: "वापस",
    next: "आगे →",
    stepBudget: "बजट",
    stepCrop: "फसल",
    stepLand: "ज़मीन",
    stepPlan: "प्लान",
    stepProblem: "समस्या",
    budgetTitle: "💰 आप कितना खर्च कर सकते हैं?",
    budgetSub:
      "अपना बजट बताइए — मैं उसी में सबसे अच्छा खाद प्लान बनाऊँगा। कोई सीमा नहीं है तो खाली छोड़ दें।",
    protBudgetTitle: "💰 दवा पर कितना खर्च कर सकते हैं?",
    protBudgetSub:
      "आपके बजट के अंदर सही दवा चुनूँगा। कोई सीमा नहीं है तो खाली छोड़ दें।",
    noLimit: "कोई सीमा नहीं",
    cropTitle: "🌾 कौन-सी फसल उगा रहे हैं?",
    protCropTitle: "🌾 किस फसल को बचाना है?",
    landTitle: "📏 कितनी ज़मीन है?",
    landClearTitle: "📏 कितना क्षेत्र साफ़ करना है?",
    selectCrop: "फसल चुनें",
    chooseCrop: "-- फसल चुनिए --",
    landSize: "ज़मीन का साइज़",
    unit: "इकाई",
    calculate: "मेरा प्लान दिखाएँ",
    startOver: "↺ फिर से शुरू करें",
    forCrop: (crop, acres) => `${crop} के लिए ${acres} एकड़ पर`,
    forClear: (acres) => `${acres} एकड़ साफ़ करने के लिए`,
    clearFieldLabel: "खेत की सफ़ाई",
    needed: (kg) => `${kg} किलो चाहिए`,
    buyLabel: "खरीदें",
    bags: "बैग",
    packs: "पैक",
    addToCart: "कार्ट में डालें",
    addAll: "🛒 सब कार्ट में डालें",
    estTotal: "आपके प्लान का कुल",
    fullPlanCost: "पूरे प्लान का खर्च",
    budgetUsed: "बजट का उपयोग",
    ofBudget: (spent, budget) => `₹${budget} में से ₹${spent}`,
    fitsBudget: "🎉 खुशखबरी — पूरा प्लान आपके बजट में आ गया!",
    trimmedNote:
      "आपके बजट में पूरा प्लान नहीं आया, इसलिए सबसे ज़रूरी खाद पहले खरीदी गई है।",
    fullDose: "✓ पूरी मात्रा",
    partialDose: (pct) => `◐ मात्रा का ${pct}%`,
    skippedDose: "बजट ख़त्म — छोड़ा गया",
    whyFirst: "यह क्रम क्यों?",
    budgetLeft: (amt) => `बजट में ₹${amt} बचे हैं`,
    watchVideo: "▶ देखें: कैसे उपयोग करें",
    openYoutube: "YouTube पर खोलें ↗",
    notStocked: (kg) => `अभी स्टॉक में नहीं। आपको लगभग ${kg} किलो चाहिए।`,
    inStore: "दुकान में उपलब्ध — शॉप से जोड़ें।",
    disclaimer:
      "⚠️ यह सामान्य जानकारी है (प्रति एकड़ मानक मात्रा)। सही मात्रा मिट्टी जाँच और स्थानीय कृषि विशेषज्ञ से ज़रूर पुष्टि करें।",
    protPick: "🛡️ आपकी क्या समस्या है?",
    weedWhere: "खरपतवार कहाँ हैं?",
    waterTanks: "पानी के टैंक (15 लीटर वाले)",
    doseNeeded: "अनुमानित दवा ज़रूरत",
    tanks: "टैंक",
    safetyHead: "छिड़काव से पहले ज़रूर पढ़ें!",
    goodToKnow: "जानना ज़रूरी",
    sprayFits: (cost, b) => `✓ ₹${cost} — आपके ₹${b} बजट के अंदर है`,
    sprayOver: (cost, b) =>
      `इसकी कीमत ₹${cost} है — आपके ₹${b} बजट से ज़्यादा। दुकान से छोटा पैक पूछें या बजट बढ़ाएँ।`,
    noSafeProduct:
      "इस फसल के लिए सुरक्षित खरपतवार दवा अभी स्टॉक में नहीं है। खड़ी फसल पर खेत साफ़ करने वाली दवा (जैसे मेरा 71 / ग्लाइसेल) कभी न छिड़कें — फसल भी मर जाएगी। कृपया दुकान पर पूछें।",
    followLabel:
      "⚠️ यह अनुमानित मात्रा है — हमेशा दवा के लेबल पर लिखी मात्रा का पालन करें।",
    noProtAvailable:
      "अभी कोई मिलती-जुलती दवा स्टॉक में नहीं — कृपया दुकान से पूछें।",
  },
};

const BUDGET_CHIPS = [2000, 5000, 10000, 20000];

// Fullscreen modal playing a "how to use" tutorial right inside the advisor.
const VideoModal = ({ video, lang, t, onClose }) => (
  <div className="video-overlay" onClick={onClose}>
    <div className="video-modal" onClick={(e) => e.stopPropagation()}>
      <div className="video-head">
        <h3>{lang === "hi" ? video.titleHi : video.title}</h3>
        <button className="video-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <a
        className="video-yt-link"
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noreferrer"
      >
        {t.openYoutube}
      </a>
    </div>
  </div>
);

// Numbered progress stepper shared by both wizards.
const Stepper = ({ current, labels, tone }) => (
  <div className={`wiz-stepper ${tone || ""}`}>
    {labels.map((label, i) => (
      <div
        key={label}
        className={`wiz-step ${current === i ? "current" : ""} ${
          current > i ? "done" : ""
        }`}
      >
        <span className="wiz-dot">{current > i ? "✓" : i + 1}</span>
        <span className="wiz-label">{label}</span>
        {i < labels.length - 1 && <span className="wiz-line" />}
      </div>
    ))}
  </div>
);

// Budget question panel shared by both wizards.
const BudgetPanel = ({ title, sub, value, onChange, onNext, t }) => (
  <div className="wiz-panel">
    <h2 className="wiz-q">{title}</h2>
    <p className="wiz-sub">{sub}</p>
    <div className="budget-input-wrap">
      <span className="budget-rupee">₹</span>
      <input
        type="number"
        min="0"
        className="budget-input"
        placeholder="5000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onNext()}
        autoFocus
      />
    </div>
    <div className="budget-chips">
      {BUDGET_CHIPS.map((b) => (
        <button
          key={b}
          className={`budget-chip ${parseFloat(value) === b ? "active" : ""}`}
          onClick={() => onChange(String(b))}
        >
          ₹{b.toLocaleString("en-IN")}
        </button>
      ))}
      <button
        className={`budget-chip no-limit ${value === "" ? "active" : ""}`}
        onClick={() => onChange("")}
      >
        ∞ {t.noLimit}
      </button>
    </div>
    <button className="advisor-calc-btn wiz-next" onClick={onNext}>
      {t.next}
    </button>
  </div>
);

// Crop tile grid shared by both wizards.
const CropGrid = ({ title, cropId, onPick, lang }) => (
  <div className="wiz-panel">
    <h2 className="wiz-q">{title}</h2>
    <div className="crop-grid">
      {CROPS.map((c) => (
        <button
          key={c.id}
          className={`crop-tile ${cropId === c.id ? "active" : ""}`}
          onClick={() => onPick(c.id)}
        >
          <span className="crop-tile-emoji">{c.emoji}</span>
          <span className="crop-tile-name">
            {lang === "hi" ? c.nameHi : c.name}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const Advisor = () => {
  const { product_list, addToCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState(null); // null | "grow" | "protect"
  const [video, setVideo] = useState(null); // currently playing how-to video

  // Grow (fertilizer) wizard state
  const [growStep, setGrowStep] = useState(1); // 1 budget, 2 crop, 3 land, 4 plan
  const [budget, setBudget] = useState("");
  const [cropId, setCropId] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("acre");
  const [result, setResult] = useState(null);

  // Protect (spray) wizard state — screens: problem, budget, crop, land, plan
  const [protScreen, setProtScreen] = useState("problem");
  const [problemId, setProblemId] = useState(null);
  const [weedContext, setWeedContext] = useState(null); // standing | clearfield
  const [protBudget, setProtBudget] = useState("");
  const [protCropId, setProtCropId] = useState("");
  const [protArea, setProtArea] = useState("");
  const [protUnit, setProtUnit] = useState("acre");
  const [protResult, setProtResult] = useState(null);

  const t = STR[lang];
  const cropName = (c) => (lang === "hi" ? c.nameHi : c.name);
  const unitLabel = (u) => (lang === "hi" ? u.labelHi : u.label);
  const toAcre = (u) => AREA_UNITS.find((x) => x.id === u).toAcre;
  const addToCartN = (id, n) => {
    for (let i = 0; i < n; i++) addToCart(id);
  };

  // Fire-and-forget demand logging — powers the admin "Crop Insights" page.
  const logConsultation = (payload) => {
    axios.post(`${url}/api/advisor/log`, payload).catch(() => {});
  };

  const selectedProblem = PROBLEMS.find((p) => p.id === problemId) || null;
  const isClearfield = problemId === "weed" && weedContext === "clearfield";

  // Protect wizard screen order (crop is skipped when clearing an empty field)
  const protScreens = isClearfield
    ? ["problem", "budget", "land", "plan"]
    : ["problem", "budget", "crop", "land", "plan"];
  const protStepLabels = protScreens.map(
    (s) =>
      ({
        problem: t.stepProblem,
        budget: t.stepBudget,
        crop: t.stepCrop,
        land: t.stepLand,
        plan: t.stepPlan,
      }[s])
  );
  const protIndex = Math.max(protScreens.indexOf(protScreen), 0);

  const openGrow = () => {
    setMode("grow");
    setGrowStep(1);
    setResult(null);
  };

  const openProtect = () => {
    setMode("protect");
    setProtScreen("problem");
    setProblemId(null);
    setWeedContext(null);
    setProtResult(null);
  };

  const growBack = () => {
    if (growStep <= 1) setMode(null);
    else setGrowStep(growStep - 1);
  };

  const protBack = () => {
    if (protIndex <= 0) setMode(null);
    else setProtScreen(protScreens[protIndex - 1]);
  };

  const pickCrop = (id) => {
    setCropId(id);
    setGrowStep(3);
  };

  const pickProblem = (id) => {
    setProblemId(id);
    setWeedContext(null);
    setProtResult(null);
    // Weeds need one more answer (standing crop vs empty field) before moving on.
    if (id !== "weed") setProtScreen("budget");
  };

  const pickWeedContext = (ctxId) => {
    setWeedContext(ctxId);
    setProtScreen("budget");
  };

  const pickProtCrop = (id) => {
    setProtCropId(id);
    setProtScreen("land");
  };

  const calculate = () => {
    const crop = CROPS.find((c) => c.id === cropId);
    const areaNum = parseFloat(area);
    if (!crop || !areaNum || areaNum <= 0) return;
    const acres = areaNum * toAcre(unit);
    const budgetNum = Math.max(parseFloat(budget) || 0, 0);

    const baseRows = crop.fertilizers.map((f) => {
      const neededKg = Math.round(f.kgPerAcre * acres);
      const product = findProductForFertilizer(product_list, f.keyword);
      let bags = null;
      let cost = null;
      if (product) {
        const bagKg = parseSizeKg(product.size);
        if (bagKg) {
          bags = Math.ceil(neededKg / bagKg);
          cost = bags * product.price;
        }
      }
      return {
        name: f.name,
        nameHi: f.nameHi,
        keyword: f.keyword,
        neededKg,
        product,
        bags,
        cost,
      };
    });

    const rows = allocateBudget(baseRows, budgetNum);
    const fullCost = baseRows.reduce((s, r) => s + (r.cost || 0), 0);
    const planCost = rows.reduce((s, r) => s + (r.planCost || 0), 0);
    const fitsBudget = !budgetNum || fullCost <= budgetNum;

    setResult({ crop, acres, rows, budgetNum, fullCost, planCost, fitsBudget });
    setGrowStep(4);

    logConsultation({
      mode: "grow",
      crop: crop.name,
      acres: Math.round(acres * 1000) / 1000,
      budget: budgetNum,
      fullCost,
      planCost,
      fitsBudget,
    });
  };

  const calculateSpray = () => {
    if (!selectedProblem) return;
    const crop = CROPS.find((c) => c.id === protCropId) || null;
    if (!isClearfield && !crop) return;
    const areaNum = parseFloat(protArea);
    if (!areaNum || areaNum <= 0) return;
    const acres = areaNum * toAcre(protUnit);
    const budgetNum = Math.max(parseFloat(protBudget) || 0, 0);
    const tanks = Math.ceil((SPRAY.waterPerAcre * acres) / SPRAY.tankSize);

    const plan = computeSprayPlan(product_list, selectedProblem, {
      cropId: protCropId,
      weedContext,
      budgetNum,
      acres,
    });

    setProtResult({ crop, acres, tanks, budgetNum, ...plan });
    setProtScreen("plan");

    logConsultation({
      mode: "protect",
      crop: isClearfield ? "Field clearing" : crop.name,
      problem: selectedProblem.label,
      acres: Math.round(acres * 1000) / 1000,
      budget: budgetNum,
      planCost: plan.recommended?.cost || 0,
      fitsBudget: !plan.overBudget,
    });
  };

  const addRow = (row) =>
    row.product && row.planBags && addToCartN(row.product._id, row.planBags);
  const addAllToCart = () => {
    result.rows.forEach(addRow);
    navigate("/cart");
  };

  const anyBuyable = result && result.rows.some((r) => r.planBags);
  const budgetLeftAmt = result
    ? Math.max(result.budgetNum - result.planCost, 0)
    : 0;

  const LangToggle = () => (
    <div className="lang-toggle">
      <span className={lang === "en" ? "lang-active" : ""}>EN</span>
      <button
        type="button"
        className={`lang-switch ${lang === "hi" ? "on" : ""}`}
        onClick={() => setLang(lang === "en" ? "hi" : "en")}
        aria-label="Toggle language"
      >
        <span className="lang-knob" />
      </button>
      <span className={lang === "hi" ? "lang-active" : ""}>हिंदी</span>
    </div>
  );

  const WATCH = (key) =>
    HOW_TO_VIDEOS[key] && (
      <button className="video-btn" onClick={() => setVideo(HOW_TO_VIDEOS[key])}>
        {t.watchVideo}
      </button>
    );

  return (
    <div className="advisor">
      <div className="advisor-topbar">
        <LangToggle />
      </div>

      {video && (
        <VideoModal video={video} lang={lang} t={t} onClose={() => setVideo(null)} />
      )}

      {/* ============ GREETING HUB ============ */}
      {mode === null && (
        <div className="greet">
          <div className="greet-hero">
            <FarmerScene />
            <h1 className="greet-title">{t.greetTitle}</h1>
            <p className="greet-sub">{t.greetSub}</p>
          </div>

          <div className="choice-cards">
            <button className="choice-card grow" onClick={openGrow}>
              <span className="choice-emoji">🌱</span>
              <h2>{t.growTitle}</h2>
              <p>{t.growSub}</p>
              <span className="choice-go">{t.start} →</span>
            </button>

            <button className="choice-card protect" onClick={openProtect}>
              <span className="choice-emoji">🛡️</span>
              <h2>{t.protectTitle}</h2>
              <p>{t.protectSub}</p>
              <span className="choice-go">{t.start} →</span>
            </button>
          </div>
        </div>
      )}

      {/* ============ GROW (BUDGET-FIRST WIZARD) ============ */}
      {mode === "grow" && (
        <div className="advisor-section">
          <button className="back-btn" onClick={growBack}>
            ← {t.back}
          </button>
          <div className="section-head grow-head">
            <span className="section-icon">🌱</span>
            <div>
              <h1>{t.growTitle}</h1>
              <p>{t.growSub}</p>
            </div>
          </div>

          <Stepper
            current={growStep - 1}
            labels={[t.stepBudget, t.stepCrop, t.stepLand, t.stepPlan]}
          />

          {growStep === 1 && (
            <BudgetPanel
              title={t.budgetTitle}
              sub={t.budgetSub}
              value={budget}
              onChange={setBudget}
              onNext={() => setGrowStep(2)}
              t={t}
            />
          )}

          {growStep === 2 && (
            <CropGrid
              title={t.cropTitle}
              cropId={cropId}
              onPick={pickCrop}
              lang={lang}
            />
          )}

          {growStep === 3 && (
            <div className="wiz-panel">
              <h2 className="wiz-q">{t.landTitle}</h2>
              <div className="advisor-form wiz-form">
                <div className="advisor-field">
                  <label>{t.landSize}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && calculate()}
                    autoFocus
                  />
                </div>
                <div className="advisor-field">
                  <label>{t.unit}</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    {AREA_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {unitLabel(u)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="advisor-calc-btn"
                  onClick={calculate}
                  disabled={!parseFloat(area)}
                >
                  {t.calculate} 🌱
                </button>
              </div>
            </div>
          )}

          {growStep === 4 && result && (
            <div className="advisor-result">
              <h2>
                <span className="advisor-result-emoji">{result.crop.emoji}</span>
                {t.forCrop(cropName(result.crop), result.acres.toFixed(3))}
              </h2>

              {result.budgetNum > 0 && (
                <div className={`budget-meter ${result.fitsBudget ? "ok" : "over"}`}>
                  <div className="budget-meter-head">
                    <span>{t.budgetUsed}</span>
                    <b>{t.ofBudget(result.planCost, result.budgetNum)}</b>
                  </div>
                  <div className="budget-meter-track">
                    <div
                      className="budget-meter-fill"
                      style={{
                        width: `${Math.min(
                          (result.planCost / result.budgetNum) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="budget-meter-note">
                    {result.fitsBudget ? t.fitsBudget : t.trimmedNote}
                  </p>
                  {result.fitsBudget && budgetLeftAmt > 0 && (
                    <p className="budget-meter-left">💵 {t.budgetLeft(budgetLeftAmt)}</p>
                  )}
                </div>
              )}

              <div className="advisor-cards">
                {result.rows.map((row, i) => (
                  <div
                    key={i}
                    className={`advisor-card ${row.status === "skipped" ? "card-skipped" : ""}`}
                  >
                    <div className="advisor-card-top">
                      <h3>{lang === "hi" ? row.nameHi : row.name}</h3>
                      <span className="advisor-need">{t.needed(row.neededKg)}</span>
                    </div>

                    {result.budgetNum > 0 && row.status !== "na" && (
                      <span className={`dose-badge dose-${row.status}`}>
                        {row.status === "full" && t.fullDose}
                        {row.status === "partial" && t.partialDose(row.coveragePct)}
                        {row.status === "skipped" && t.skippedDose}
                      </span>
                    )}

                    {FERTILIZER_PRIORITY[row.keyword] && (
                      <p className="dose-why">
                        <b>{t.whyFirst}</b>{" "}
                        {lang === "hi"
                          ? FERTILIZER_PRIORITY[row.keyword].whyHi
                          : FERTILIZER_PRIORITY[row.keyword].why}
                      </p>
                    )}

                    {row.product ? (
                      <>
                        <div className="advisor-product">
                          <img
                            src={`${url}/images/${row.product.image}`}
                            alt={row.product.name}
                          />
                          <div>
                            <p className="advisor-pname">{row.product.name}</p>
                            <p className="advisor-psize">
                              {row.product.size} · ₹{row.product.price}
                            </p>
                          </div>
                        </div>
                        {row.planBags ? (
                          <>
                            <p className="advisor-qty">
                              {t.buyLabel} <b>{row.planBags}</b>
                              {row.planBags < row.bags && <> / {row.bags}</>} {t.bags}{" "}
                              = <b>₹{row.planCost}</b>
                            </p>
                            <button onClick={() => addRow(row)}>{t.addToCart}</button>
                          </>
                        ) : row.status === "skipped" ? (
                          <p className="advisor-note">{t.skippedDose}</p>
                        ) : (
                          <p className="advisor-note">{t.inStore}</p>
                        )}
                        {WATCH(row.keyword)}
                      </>
                    ) : (
                      <p className="advisor-note">{t.notStocked(row.neededKg)}</p>
                    )}
                  </div>
                ))}
              </div>

              {anyBuyable && (
                <div className="advisor-total">
                  <p>
                    {t.estTotal}: <b>₹{result.planCost}</b>
                    {!result.fitsBudget && (
                      <span className="full-plan-cost">
                        {" "}
                        · {t.fullPlanCost}: ₹{result.fullCost}
                      </span>
                    )}
                  </p>
                  <button onClick={addAllToCart}>{t.addAll}</button>
                </div>
              )}

              <button className="back-btn start-over" onClick={openGrow}>
                {t.startOver}
              </button>
              <p className="advisor-disclaimer">{t.disclaimer}</p>
            </div>
          )}
        </div>
      )}

      {/* ============ PROTECT (BUDGET-FIRST WIZARD) ============ */}
      {mode === "protect" && (
        <div className="advisor-section">
          <button className="back-btn" onClick={protBack}>
            ← {t.back}
          </button>
          <div className="section-head protect-head">
            <span className="section-icon">🛡️</span>
            <div>
              <h1>{t.protectTitle}</h1>
              <p>{t.protectSub}</p>
            </div>
          </div>

          <Stepper current={protIndex} labels={protStepLabels} tone="red" />

          {/* ---- Screen 1: Problem (+ weed context) ---- */}
          {protScreen === "problem" && (
            <div className="wiz-panel prot-panel">
              <h2 className="wiz-q">{t.protPick}</h2>
              <div className="prot-problems">
                {PROBLEMS.map((p) => (
                  <button
                    key={p.id}
                    className={`prot-problem ${problemId === p.id ? "active" : ""}`}
                    onClick={() => pickProblem(p.id)}
                  >
                    <span className="prot-emoji">{p.emoji}</span>
                    {lang === "hi" ? p.labelHi : p.label}
                  </button>
                ))}
              </div>

              {problemId === "weed" && (
                <div className="weed-context">
                  <p className="weed-context-q">{t.weedWhere}</p>
                  <div className="weed-context-cards">
                    {selectedProblem.contexts.map((ctx) => (
                      <button
                        key={ctx.id}
                        className={`weed-context-card ${
                          weedContext === ctx.id ? "active" : ""
                        }`}
                        onClick={() => pickWeedContext(ctx.id)}
                      >
                        <span className="weed-context-emoji">{ctx.emoji}</span>
                        {lang === "hi" ? ctx.labelHi : ctx.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---- Screen 2: Budget ---- */}
          {protScreen === "budget" && (
            <BudgetPanel
              title={t.protBudgetTitle}
              sub={t.protBudgetSub}
              value={protBudget}
              onChange={setProtBudget}
              onNext={() => setProtScreen(isClearfield ? "land" : "crop")}
              t={t}
            />
          )}

          {/* ---- Screen 3: Crop (skipped for field clearing) ---- */}
          {protScreen === "crop" && (
            <CropGrid
              title={t.protCropTitle}
              cropId={protCropId}
              onPick={pickProtCrop}
              lang={lang}
            />
          )}

          {/* ---- Screen 4: Land ---- */}
          {protScreen === "land" && (
            <div className="wiz-panel prot-panel">
              <h2 className="wiz-q">
                {isClearfield ? t.landClearTitle : t.landTitle}
              </h2>
              <div className="advisor-form wiz-form">
                <div className="advisor-field">
                  <label>{t.landSize}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1"
                    value={protArea}
                    onChange={(e) => setProtArea(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && calculateSpray()}
                    autoFocus
                  />
                </div>
                <div className="advisor-field">
                  <label>{t.unit}</label>
                  <select
                    value={protUnit}
                    onChange={(e) => setProtUnit(e.target.value)}
                  >
                    {AREA_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {unitLabel(u)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="advisor-calc-btn protect-calc-btn"
                  onClick={calculateSpray}
                  disabled={!parseFloat(protArea)}
                >
                  {t.calculate} 🛡️
                </button>
              </div>
            </div>
          )}

          {/* ---- Screen 5: Plan ---- */}
          {protScreen === "plan" && protResult && (
            <div className="advisor-result">
              <h2>
                <span className="advisor-result-emoji">
                  {isClearfield ? "🚜" : protResult.crop.emoji}
                </span>
                {isClearfield
                  ? t.forClear(protResult.acres.toFixed(3))
                  : t.forCrop(
                      cropName(protResult.crop),
                      protResult.acres.toFixed(3)
                    )}
              </h2>

              <p className="prot-tip">
                💡 {lang === "hi" ? selectedProblem.tipHi : selectedProblem.tip}
              </p>

              {protResult.noSafe ? (
                <div className="safety-callout danger">
                  <b>⚠️ {t.safetyHead}</b>
                  <p>{t.noSafeProduct}</p>
                </div>
              ) : protResult.recommended ? (
                <>
                  <div className="spray-summary">
                    <div className="spray-stat">
                      <span className="spray-stat-icon">💧</span>
                      <div>
                        <b>
                          {protResult.tanks} {t.tanks}
                        </b>
                        <p>{t.waterTanks}</p>
                      </div>
                    </div>
                    {protResult.recommended.dose && (
                      <div className="spray-stat">
                        <span className="spray-stat-icon">🧪</span>
                        <div>
                          <b>
                            ~{protResult.recommended.dose}{" "}
                            {protResult.recommended.rateUnit}
                          </b>
                          <p>{t.doseNeeded}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {(() => {
                    const { product, know, packs, cost } = protResult.recommended;
                    return (
                      <div className="advisor-cards">
                        <div className="advisor-card prot-reco-card">
                          <div className="advisor-product">
                            <img
                              src={`${url}/images/${product.image}`}
                              alt={product.name}
                            />
                            <div>
                              <p className="advisor-pname">{product.name}</p>
                              <p className="advisor-psize">
                                {product.size} · ₹{product.price}
                              </p>
                            </div>
                          </div>

                          {know?.warn && (
                            <div className="safety-callout danger">
                              <b>☠️ {t.safetyHead}</b>
                              <p>{lang === "hi" ? know.warn.hi : know.warn.en}</p>
                            </div>
                          )}
                          {know?.note && (
                            <div className="safety-callout info">
                              <b>💡 {t.goodToKnow}</b>
                              <p>{lang === "hi" ? know.note.hi : know.note.en}</p>
                            </div>
                          )}

                          {protResult.budgetNum > 0 && cost !== null && (
                            <p
                              className={`spray-budget-line ${
                                protResult.overBudget ? "over" : "ok"
                              }`}
                            >
                              {protResult.overBudget
                                ? t.sprayOver(cost, protResult.budgetNum)
                                : t.sprayFits(cost, protResult.budgetNum)}
                            </p>
                          )}

                          {packs ? (
                            <>
                              <p className="advisor-qty">
                                {t.buyLabel} <b>{packs}</b> {t.packs} ={" "}
                                <b>₹{cost}</b>
                              </p>
                              <button onClick={() => addToCartN(product._id, packs)}>
                                {t.addToCart}
                              </button>
                            </>
                          ) : (
                            <button onClick={() => addToCart(product._id)}>
                              {t.addToCart}
                            </button>
                          )}
                          {WATCH(know?.videoKey || selectedProblem.id)}
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <p className="advisor-note">{t.noProtAvailable}</p>
              )}

              <button className="back-btn start-over" onClick={openProtect}>
                {t.startOver}
              </button>
              <p className="advisor-disclaimer">{t.followLabel}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Advisor;
