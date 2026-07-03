import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Spinner from "../../components/Spinner/Spinner";
import { useTilt } from "../../hooks/useTilt";
import "./Dashboard.css";

// Smoothly counts a number up from 0 to `target` over `duration` ms.
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef();

  useEffect(() => {
    const numeric = Number(target) || 0;
    let start;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic for a snappy finish
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(numeric * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
};

const StatCard = ({ label, rawValue, format, icon, accent, index }) => {
  const animated = useCountUp(rawValue);
  const tilt = useTilt(8);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="stat-card tilt-3d animate-up"
      style={{
        borderTop: `3px solid ${accent}`,
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div className="stat-card-icon" style={{ color: accent }}>
        {icon}
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{format ? format(animated) : animated}</p>
      </div>
    </div>
  );
};

const Dashboard = ({ url, isSuperAdmin }) => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const statsRes = await axios.get(`${url}/api/dashboard/stats`);
        if (statsRes.data.success) setStats(statsRes.data.data);
        else toast.error("Failed to load dashboard");

        // Analytics is Super Admin only — the backend 403s Staff, so skip
        // the request (and the noisy error toast) for them entirely.
        if (isSuperAdmin) {
          try {
            const analyticsRes = await axios.get(`${url}/api/dashboard/analytics`);
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
          } catch {
            // non-fatal — dashboard still renders without the analytics section
          }
        }
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [url, isSuperAdmin]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dash-skeleton-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card skeleton-card" />
          ))}
        </div>
        <Spinner label="Loading dashboard..." />
      </div>
    );
  }

  const fmtMoney = (n) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;

  const cards = [
    ...(isSuperAdmin
      ? [{ label: "Total Revenue", rawValue: stats.totalRevenue, format: fmtMoney, icon: "₹", accent: "#22c55e" }]
      : []),
    { label: "Total Orders", rawValue: stats.totalOrders, icon: "📦", accent: "#3b82f6" },
    { label: "Products", rawValue: stats.totalProducts, icon: "🌱", accent: "#f59e0b" },
    { label: "Customers", rawValue: stats.totalUsers, icon: "👤", accent: "#ec4899" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-val">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard">
      <h2 className="dash-title">Dashboard</h2>

      <div className="stats-grid">
        {cards.map((c, i) => (
          <StatCard key={c.label} index={i} {...c} />
        ))}
      </div>

      {isSuperAdmin && stats.chartData && (
      <div className="chart-section">
        <h3 className="section-title">Last 7 Days Revenue</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fill: "var(--light-text-secondary)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--light-text-secondary)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      )}

      {isSuperAdmin && analytics && (
        <div className="analytics-row">
          <div className="recent-section analytics-card">
            <h3 className="section-title">🏆 Best Sellers</h3>
            {analytics.bestSellers.length === 0 ? (
              <p className="analytics-empty">No sales yet</p>
            ) : (
              <div className="bestseller-list">
                {analytics.bestSellers.map((p, i) => (
                  <div key={p.name} className="bestseller-row">
                    <span className="bestseller-rank">{i + 1}</span>
                    <span className="bestseller-name">{p.name}</span>
                    <span className="bestseller-units">{p.unitsSold} sold</span>
                    <span className="bestseller-rev">₹{p.revenue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="recent-section analytics-card">
            <h3 className="section-title">📊 Revenue by Category</h3>
            {analytics.revenueByCategory.length === 0 ? (
              <p className="analytics-empty">No sales yet</p>
            ) : (
              <div className="category-list">
                {(() => {
                  const max = Math.max(
                    ...analytics.revenueByCategory.map((c) => c.revenue),
                    1
                  );
                  return analytics.revenueByCategory.map((c) => (
                    <div key={c.category} className="category-row">
                      <div className="category-label">
                        <span>{c.category}</span>
                        <span className="category-rev">₹{c.revenue}</span>
                      </div>
                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{ width: `${(c.revenue / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="recent-section low-stock-section">
          <h3 className="section-title">
            ⚠️ Low Stock Alert
            <span className="low-stock-count">
              {stats.lowStockProducts.length}
            </span>
          </h3>
          <div className="low-stock-grid">
            {stats.lowStockProducts.map((p) => (
              <div key={p._id} className="low-stock-item">
                <div>
                  <p className="low-stock-name">{p.name}</p>
                  <p className="low-stock-cat">{p.category}</p>
                </div>
                <span
                  className={`stock-pill ${p.stock === 0 ? "out" : "low"}`}
                >
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-section">
        <h3 className="section-title">Recent Orders</h3>
        <div className="recent-table">
          <div className="recent-row recent-header">
            <span>Customer</span>
            <span>Items</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {stats.recentOrders.map((o) => (
            <div key={o._id} className="recent-row">
              <span>
                {o.address?.firstName} {o.address?.lastName}
              </span>
              <span>{o.items?.length} item(s)</span>
              <span>₹{o.amount}</span>
              <span className={`status-badge status-${o.status?.replace(/\s+/g, "-").toLowerCase()}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
