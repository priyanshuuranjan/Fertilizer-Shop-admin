import "./Advisor.css";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  CROPS,
  AREA_UNITS,
  PROBLEMS,
  SPRAY,
  parseSizeKg,
  parseSizeAmount,
  findProductForFertilizer,
  findProtectionProducts,
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
    growSub: "Which fertilizer and how much to use — get the exact amount & cost.",
    protectTitle: "Protect My Crop",
    protectSub: "Save your crop from insects, disease & weeds — find the right spray.",
    start: "Start",
    back: "Back",
    selectCrop: "Select Crop",
    chooseCrop: "-- Choose crop --",
    landSize: "Land Size",
    unit: "Unit",
    calculate: "Calculate",
    forCrop: (crop, acres) => `For ${crop} on ${acres} acre`,
    needed: (kg) => `${kg} kg needed`,
    buyLabel: "Buy",
    bags: "bag(s)",
    packs: "pack(s)",
    addToCart: "Add to Cart",
    addAll: "🛒 Add All to Cart",
    estTotal: "Estimated total",
    notStocked: (kg) => `Not stocked right now. You need ~${kg} kg.`,
    inStore: "Available in store — add it from the shop.",
    disclaimer:
      "⚠️ This is general guidance (standard per-acre doses). Confirm exact quantity with a soil test and your local agriculture expert.",
    protPick: "What problem are you facing?",
    sprayHowMuch: "Enter your land size to see how much you need",
    waterTanks: "Water tanks (15 L each)",
    doseNeeded: "Approx. medicine needed",
    tanks: "tank(s)",
    followLabel:
      "⚠️ Approximate guidance — always follow the dose printed on the product label.",
    noProtAvailable:
      "No matching product is in stock right now — please ask the shop.",
  },
  hi: {
    greetTitle: "नमस्ते, किसान भाई!",
    greetSub: "मैं आपका डिजिटल कृषि सहायक हूँ। बताइए — आज क्या मदद चाहिए?",
    growTitle: "फसल उगाएँ",
    growSub: "कौन-सी खाद और कितनी डालें — सही मात्रा और खर्च जानिए।",
    protectTitle: "फसल बचाएँ",
    protectSub: "कीड़े, रोग और खरपतवार से फसल बचाएँ — सही दवा खोजिए।",
    start: "शुरू करें",
    back: "वापस",
    selectCrop: "फसल चुनें",
    chooseCrop: "-- फसल चुनिए --",
    landSize: "ज़मीन का साइज़",
    unit: "इकाई",
    calculate: "हिसाब लगाएँ",
    forCrop: (crop, acres) => `${crop} के लिए ${acres} एकड़ पर`,
    needed: (kg) => `${kg} किलो चाहिए`,
    buyLabel: "खरीदें",
    bags: "बैग",
    packs: "पैक",
    addToCart: "कार्ट में डालें",
    addAll: "🛒 सब कार्ट में डालें",
    estTotal: "अनुमानित कुल",
    notStocked: (kg) => `अभी स्टॉक में नहीं। आपको लगभग ${kg} किलो चाहिए।`,
    inStore: "दुकान में उपलब्ध — शॉप से जोड़ें।",
    disclaimer:
      "⚠️ यह सामान्य जानकारी है (प्रति एकड़ मानक मात्रा)। सही मात्रा मिट्टी जाँच और स्थानीय कृषि विशेषज्ञ से ज़रूर पुष्टि करें।",
    protPick: "आपकी क्या समस्या है?",
    sprayHowMuch: "कितना चाहिए, यह देखने के लिए ज़मीन का साइज़ डालें",
    waterTanks: "पानी के टैंक (15 लीटर वाले)",
    doseNeeded: "अनुमानित दवा ज़रूरत",
    tanks: "टैंक",
    followLabel:
      "⚠️ यह अनुमानित मात्रा है — हमेशा दवा के लेबल पर लिखी मात्रा का पालन करें।",
    noProtAvailable:
      "अभी कोई मिलती-जुलती दवा स्टॉक में नहीं — कृपया दुकान से पूछें।",
  },
};

const Advisor = () => {
  const { product_list, addToCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState(null); // null | "grow" | "protect"

  // Grow (fertilizer) state
  const [cropId, setCropId] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("acre");
  const [result, setResult] = useState(null);

  // Protect (spray) state
  const [problemId, setProblemId] = useState(null);
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

  const selectedProblem = PROBLEMS.find((p) => p.id === problemId) || null;
  const protProducts = selectedProblem
    ? findProtectionProducts(product_list, selectedProblem)
    : [];

  const calculate = () => {
    const crop = CROPS.find((c) => c.id === cropId);
    const areaNum = parseFloat(area);
    if (!crop || !areaNum || areaNum <= 0) return;
    const acres = areaNum * toAcre(unit);

    const rows = crop.fertilizers.map((f) => {
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
      return { name: f.name, nameHi: f.nameHi, neededKg, product, bags, cost };
    });
    setResult({ crop, acres, rows });
  };

  const calculateSpray = () => {
    if (!selectedProblem) return;
    const crop = CROPS.find((c) => c.id === protCropId);
    const areaNum = parseFloat(protArea);
    if (!crop || !areaNum || areaNum <= 0) return;
    const acres = areaNum * toAcre(protUnit);
    const tanks = Math.ceil((SPRAY.waterPerAcre * acres) / SPRAY.tankSize);
    const totalDose = Math.round(selectedProblem.ratePerAcre * acres);

    // Build candidates, then recommend just ONE product (cheapest whose unit
    // matches the dose so we can compute packs; else cheapest available).
    const candidates = protProducts.map((p) => {
      const amt = parseSizeAmount(p.size);
      const matches = amt && amt.family === selectedProblem.family;
      let packs = null;
      let cost = null;
      if (matches) {
        packs = Math.ceil(totalDose / amt.value);
        cost = packs * p.price;
      }
      return { product: p, packs, cost, matches };
    });

    const byPrice = (a, b) => a.product.price - b.product.price;
    const recommended =
      candidates.filter((c) => c.matches).sort(byPrice)[0] ||
      candidates.sort(byPrice)[0] ||
      null;

    setProtResult({ crop, acres, tanks, totalDose, recommended });
  };

  const pickProblem = (id) => {
    setProblemId(id);
    setProtResult(null);
  };

  const addRow = (row) => row.product && row.bags && addToCartN(row.product._id, row.bags);
  const addAllToCart = () => {
    result.rows.forEach(addRow);
    navigate("/cart");
  };

  const totalCost = result
    ? result.rows.reduce((s, r) => s + (r.cost || 0), 0)
    : 0;
  const anyBuyable = result && result.rows.some((r) => r.bags);

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

  return (
    <div className="advisor">
      <div className="advisor-topbar">
        <LangToggle />
      </div>

      {/* ============ GREETING HUB ============ */}
      {mode === null && (
        <div className="greet">
          <div className="greet-hero">
            <FarmerScene />
            <h1 className="greet-title">{t.greetTitle}</h1>
            <p className="greet-sub">{t.greetSub}</p>
          </div>

          <div className="choice-cards">
            <button className="choice-card grow" onClick={() => setMode("grow")}>
              <span className="choice-emoji">🌱</span>
              <h2>{t.growTitle}</h2>
              <p>{t.growSub}</p>
              <span className="choice-go">{t.start} →</span>
            </button>

            <button
              className="choice-card protect"
              onClick={() => setMode("protect")}
            >
              <span className="choice-emoji">🛡️</span>
              <h2>{t.protectTitle}</h2>
              <p>{t.protectSub}</p>
              <span className="choice-go">{t.start} →</span>
            </button>
          </div>
        </div>
      )}

      {/* ============ GROW (FERTILIZER) ============ */}
      {mode === "grow" && (
        <div className="advisor-section">
          <button className="back-btn" onClick={() => setMode(null)}>
            ← {t.back}
          </button>
          <div className="section-head grow-head">
            <span className="section-icon">🌱</span>
            <div>
              <h1>{t.growTitle}</h1>
              <p>{t.growSub}</p>
            </div>
          </div>

          <div className="advisor-form">
            <div className="advisor-field">
              <label>{t.selectCrop}</label>
              <select value={cropId} onChange={(e) => setCropId(e.target.value)}>
                <option value="">{t.chooseCrop}</option>
                {CROPS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {cropName(c)}
                  </option>
                ))}
              </select>
            </div>
            <div className="advisor-field">
              <label>{t.landSize}</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 2"
                value={area}
                onChange={(e) => setArea(e.target.value)}
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
            <button className="advisor-calc-btn" onClick={calculate}>
              {t.calculate}
            </button>
          </div>

          {result && (
            <div className="advisor-result">
              <h2>
                <span className="advisor-result-emoji">{result.crop.emoji}</span>
                {t.forCrop(cropName(result.crop), result.acres.toFixed(3))}
              </h2>
              <div className="advisor-cards">
                {result.rows.map((row, i) => (
                  <div key={i} className="advisor-card">
                    <div className="advisor-card-top">
                      <h3>{lang === "hi" ? row.nameHi : row.name}</h3>
                      <span className="advisor-need">{t.needed(row.neededKg)}</span>
                    </div>
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
                        {row.bags ? (
                          <>
                            <p className="advisor-qty">
                              {t.buyLabel} <b>{row.bags}</b> {t.bags} ={" "}
                              <b>₹{row.cost}</b>
                            </p>
                            <button onClick={() => addRow(row)}>
                              {t.addToCart}
                            </button>
                          </>
                        ) : (
                          <p className="advisor-note">{t.inStore}</p>
                        )}
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
                    {t.estTotal}: <b>₹{totalCost}</b>
                  </p>
                  <button onClick={addAllToCart}>{t.addAll}</button>
                </div>
              )}
              <p className="advisor-disclaimer">{t.disclaimer}</p>
            </div>
          )}
        </div>
      )}

      {/* ============ PROTECT (SPRAY) ============ */}
      {mode === "protect" && (
        <div className="advisor-section">
          <button className="back-btn" onClick={() => setMode(null)}>
            ← {t.back}
          </button>
          <div className="section-head protect-head">
            <span className="section-icon">🛡️</span>
            <div>
              <h1>{t.protectTitle}</h1>
              <p>{t.protectSub}</p>
            </div>
          </div>

          <p className="prot-pick-label">{t.protPick}</p>
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

          {selectedProblem && (
            <>
              <p className="prot-tip">
                💡 {lang === "hi" ? selectedProblem.tipHi : selectedProblem.tip}
              </p>

              {/* Spray calculator — same flow as Grow: crop + land -> calculate */}
              <div className="advisor-form prot-calc-form">
                <div className="advisor-field">
                  <label>{t.selectCrop}</label>
                  <select
                    value={protCropId}
                    onChange={(e) => setProtCropId(e.target.value)}
                  >
                    <option value="">{t.chooseCrop}</option>
                    {CROPS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {cropName(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="advisor-field">
                  <label>{t.landSize}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1"
                    value={protArea}
                    onChange={(e) => setProtArea(e.target.value)}
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
                >
                  {t.calculate}
                </button>
              </div>
            </>
          )}

          {/* Results — only after the farmer presses Calculate */}
          {protResult && (
            <div className="advisor-result">
              <h2>
                <span className="advisor-result-emoji">
                  {protResult.crop.emoji}
                </span>
                {t.forCrop(cropName(protResult.crop), protResult.acres.toFixed(3))}
              </h2>

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
                <div className="spray-stat">
                  <span className="spray-stat-icon">🧪</span>
                  <div>
                    <b>
                      ~{protResult.totalDose} {selectedProblem.rateUnit}
                    </b>
                    <p>{t.doseNeeded}</p>
                  </div>
                </div>
              </div>

              {protResult.recommended ? (
                <div className="advisor-cards">
                  {(() => {
                    const { product, packs, cost } = protResult.recommended;
                    return (
                      <div className="advisor-card">
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
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <p className="advisor-note">{t.noProtAvailable}</p>
              )}

              <p className="advisor-disclaimer">{t.followLabel}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Advisor;
