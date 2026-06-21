import "./Advisor.css";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {
  CROPS,
  AREA_UNITS,
  parseSizeKg,
  findProductForFertilizer,
} from "../../data/cropData";

const Advisor = () => {
  const { product_list, addToCart, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [cropId, setCropId] = useState("");
  const [area, setArea] = useState("");
  const [unit, setUnit] = useState("acre");
  const [result, setResult] = useState(null); // { crop, acres, rows: [] }

  const calculate = () => {
    const crop = CROPS.find((c) => c.id === cropId);
    const areaNum = parseFloat(area);
    if (!crop || !areaNum || areaNum <= 0) return;

    const unitInfo = AREA_UNITS.find((u) => u.id === unit);
    const acres = areaNum * unitInfo.toAcre;

    const rows = crop.fertilizers.map((f) => {
      const neededKg = Math.round(f.kgPerAcre * acres);
      const product = findProductForFertilizer(product_list, f.keyword);

      let bagKg = null;
      let bags = null;
      let cost = null;
      if (product) {
        bagKg = parseSizeKg(product.size);
        if (bagKg) {
          bags = Math.ceil(neededKg / bagKg);
          cost = bags * product.price;
        }
      }
      return { fertilizer: f.name, neededKg, product, bagKg, bags, cost };
    });

    setResult({ crop, acres, rows });
  };

  const addRowToCart = (row) => {
    if (!row.product || !row.bags) return;
    for (let i = 0; i < row.bags; i++) addToCart(row.product._id);
  };

  const addAllToCart = () => {
    result.rows.forEach((row) => addRowToCart(row));
    navigate("/cart");
  };

  const totalCost = result
    ? result.rows.reduce((sum, r) => sum + (r.cost || 0), 0)
    : 0;
  const anyBuyable = result && result.rows.some((r) => r.bags);

  return (
    <div className="advisor">
      <div className="advisor-head">
        <h1>🌱 Crop Advisor</h1>
        <p>
          Apni fasal aur zameen ka size chuniye — hum bata denge kitni khaad
          chahiye aur uska kharcha kitna hoga.
        </p>
      </div>

      <div className="advisor-form">
        <div className="advisor-field">
          <label>Select Crop (फसल)</label>
          <select value={cropId} onChange={(e) => setCropId(e.target.value)}>
            <option value="">-- Choose crop --</option>
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="advisor-field">
          <label>Land Size (ज़मीन)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 2"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div className="advisor-field">
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            {AREA_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <button className="advisor-calc-btn" onClick={calculate}>
          Calculate
        </button>
      </div>

      {result && (
        <div className="advisor-result">
          <h2>
            For {result.crop.name} on {result.acres.toFixed(2)} acre:
          </h2>

          <div className="advisor-cards">
            {result.rows.map((row, i) => (
              <div key={i} className="advisor-card">
                <div className="advisor-card-top">
                  <h3>{row.fertilizer}</h3>
                  <span className="advisor-need">{row.neededKg} kg needed</span>
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
                          Buy <b>{row.bags}</b> bag(s) ={" "}
                          <b>₹{row.cost}</b>
                        </p>
                        <button onClick={() => addRowToCart(row)}>
                          Add to Cart
                        </button>
                      </>
                    ) : (
                      <p className="advisor-note">
                        Available in store — add to cart from the shop.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="advisor-note">
                    Not stocked right now. You need ~{row.neededKg} kg.
                  </p>
                )}
              </div>
            ))}
          </div>

          {anyBuyable && (
            <div className="advisor-total">
              <p>
                Estimated total: <b>₹{totalCost}</b>
              </p>
              <button onClick={addAllToCart}>Add All to Cart</button>
            </div>
          )}

          <p className="advisor-disclaimer">
            ⚠️ Ye general guidance hai (per-acre standard doses). Sahi maatra
            soil test aur local krishi expert se confirm karein.
          </p>
        </div>
      )}
    </div>
  );
};

export default Advisor;
