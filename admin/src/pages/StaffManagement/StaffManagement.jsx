import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTilt } from "../../hooks/useTilt";
import "./StaffManagement.css";

const emptyForm = { name: "", email: "", password: "" };

const StaffManagement = ({ url }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const tilt = useTilt(6);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${url}/api/admin/staff/list`);
      if (res.data.success) setStaff(res.data.data);
      else toast.error(res.data.message || "Failed to load staff accounts");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axios.post(`${url}/api/admin/staff/add`, form);
      if (res.data.success) {
        toast.success(res.data.message);
        setForm(emptyForm);
        await fetchStaff();
      } else {
        toast.error(res.data.message || "Failed to create staff account");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setCreating(false);
    }
  };

  const removeStaff = async (id) => {
    if (!window.confirm("Remove this staff account? They'll be logged out immediately.")) return;
    try {
      const res = await axios.post(`${url}/api/admin/staff/remove`, { id });
      if (res.data.success) {
        toast.success(res.data.message);
        setStaff((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(res.data.message || "Failed to remove staff account");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="staff-page">
      <h2 className="staff-title fade-in-stagger">Manage Staff</h2>
      <p className="staff-sub fade-in-stagger" style={{ "--delay": "0.05s" }}>
        Staff accounts can manage products and orders, but cannot delete products or view revenue figures.
      </p>

      <form
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="staff-form tilt-3d fade-in-stagger"
        style={{ "--delay": "0.1s" }}
        onSubmit={onSubmit}
      >
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={onChange}
          minLength={8}
          required
        />
        <button type="submit" className="staff-submit-btn" disabled={creating}>
          {creating ? (
            <span className="staff-submit-spinner" />
          ) : (
            <>Add Staff <span className="staff-submit-arrow">→</span></>
          )}
        </button>
      </form>

      <div className="staff-list fade-in-stagger" style={{ "--delay": "0.18s" }}>
        <div className="staff-row staff-header">
          <span>Name</span>
          <span>Email</span>
          <span>Added</span>
          <span></span>
        </div>
        {loading ? (
          <p className="staff-empty">Loading...</p>
        ) : staff.length === 0 ? (
          <p className="staff-empty">No staff accounts yet — add one above.</p>
        ) : (
          staff.map((s, i) => (
            <div
              key={s._id}
              className="staff-row fade-in-stagger"
              style={{ "--delay": `${0.2 + i * 0.05}s` }}
            >
              <span>{s.name}</span>
              <span>{s.email}</span>
              <span>{new Date(s.createdAt).toLocaleDateString("en-IN")}</span>
              <span>
                <button className="staff-remove" onClick={() => removeStaff(s._id)}>
                  Remove
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
