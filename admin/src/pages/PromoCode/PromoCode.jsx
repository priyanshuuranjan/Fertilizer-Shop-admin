import { useEffect, useState } from "react";
import "./PromoCode.css";
import axios from "axios";
import { toast } from "react-toastify";

const emptyForm = {
  code: "",
  discountType: "percent",
  discountValue: "",
  maxDiscount: "",
  minOrderAmount: "",
  expiresAt: "",
};

const PromoCode = ({ url }) => {
  const [data, setData] = useState(emptyForm);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/promo/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error loading promo codes");
      }
    } catch (error) {
      toast.error("Error loading promo codes");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/promo/create`, {
        code: data.code,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        maxDiscount: Number(data.maxDiscount) || 0,
        minOrderAmount: Number(data.minOrderAmount) || 0,
        expiresAt: data.expiresAt || null,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData(emptyForm);
        await fetchPromos();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating promo code");
    }
  };

  const togglePromo = async (id) => {
    const response = await axios.post(`${url}/api/promo/toggle`, { id });
    if (response.data.success) {
      await fetchPromos();
    } else {
      toast.error("Error");
    }
  };

  const removePromo = async (id) => {
    const response = await axios.post(`${url}/api/promo/remove`, { id });
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchPromos();
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const formatDiscount = (p) =>
    p.discountType === "percent" ? `${p.discountValue}%` : `₹${p.discountValue}`;

  const formatExpiry = (d) =>
    d ? new Date(d).toLocaleDateString() : "No expiry";

  return (
    <div className="promo add flex-col">
      <form className="promo-form flex-col" onSubmit={onSubmitHandler}>
        <p className="promo-heading">Create Promo Code</p>
        <div className="promo-grid">
          <div className="flex-col">
            <p>Code</p>
            <input
              name="code"
              value={data.code}
              onChange={onChangeHandler}
              type="text"
              placeholder="e.g. WELCOME10"
              required
            />
          </div>
          <div className="flex-col">
            <p>Discount Type</p>
            <select
              name="discountType"
              value={data.discountType}
              onChange={onChangeHandler}
            >
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div className="flex-col">
            <p>Discount Value</p>
            <input
              name="discountValue"
              value={data.discountValue}
              onChange={onChangeHandler}
              type="number"
              min="1"
              placeholder={data.discountType === "percent" ? "10" : "50"}
              required
            />
          </div>
          {data.discountType === "percent" && (
            <div className="flex-col">
              <p>Max Discount (₹, optional)</p>
              <input
                name="maxDiscount"
                value={data.maxDiscount}
                onChange={onChangeHandler}
                type="number"
                min="0"
                placeholder="e.g. 200 (0 = no cap)"
              />
            </div>
          )}
          <div className="flex-col">
            <p>Min Order Amount (₹, optional)</p>
            <input
              name="minOrderAmount"
              value={data.minOrderAmount}
              onChange={onChangeHandler}
              type="number"
              min="0"
              placeholder="e.g. 500 (0 = none)"
            />
          </div>
          <div className="flex-col">
            <p>Expiry Date (optional)</p>
            <input
              name="expiresAt"
              value={data.expiresAt}
              onChange={onChangeHandler}
              type="date"
            />
          </div>
        </div>
        <button type="submit" className="promo-btn">
          CREATE CODE
        </button>
      </form>

      <p className="promo-heading">All Promo Codes</p>
      <div className="promo-table">
        <div className="promo-table-format title">
          <b>Code</b>
          <b>Discount</b>
          <b>Min Order</b>
          <b>Expiry</b>
          <b>Used</b>
          <b>Status</b>
          <b>Action</b>
        </div>
        {loading ? (
          <p className="promo-empty">Loading…</p>
        ) : list.length === 0 ? (
          <p className="promo-empty">No promo codes yet. Create one above.</p>
        ) : (
          list.map((p) => (
            <div key={p._id} className="promo-table-format">
              <p className="promo-code-cell">{p.code}</p>
              <p>{formatDiscount(p)}</p>
              <p>{p.minOrderAmount ? `₹${p.minOrderAmount}` : "—"}</p>
              <p>{formatExpiry(p.expiresAt)}</p>
              <p>{p.usedBy?.length || 0}</p>
              <p
                className={`promo-status ${p.active ? "on" : "off"}`}
                onClick={() => togglePromo(p._id)}
                title="Click to toggle"
              >
                {p.active ? "Active" : "Inactive"}
              </p>
              <p className="cursor" onClick={() => removePromo(p._id)}>
                X
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PromoCode;
