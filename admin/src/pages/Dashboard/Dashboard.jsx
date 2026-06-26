import { useEffect, useState } from "react";
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
import "./Dashboard.css";

const StatCard = ({ label, value, icon, accent }) => (
  <div className="stat-card" style={{ borderTop: `3px solid ${accent}` }}>
    <div className="stat-card-icon" style={{ color: accent }}>
      {icon}
    </div>
    <div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${url}/api/dashboard/stats`);
        if (res.data.success) setStats(res.data.data);
        else toast.error("Failed to load dashboard");
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [url]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dash-skeleton-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  const fmt = (n) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;

  const cards = [
    { label: "Total Revenue", value: fmt(stats.totalRevenue), icon: "₹", accent: "#22c55e" },
    { label: "Total Orders", value: stats.totalOrders, icon: "📦", accent: "#3b82f6" },
    { label: "Products", value: stats.totalProducts, icon: "🌱", accent: "#f59e0b" },
    { label: "Customers", value: stats.totalUsers, icon: "👤", accent: "#ec4899" },
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
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

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
