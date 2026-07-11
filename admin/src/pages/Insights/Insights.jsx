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
import Spinner from "../../components/Spinner/Spinner";
import "../Dashboard/Dashboard.css";
import "./Insights.css";

// Crop Demand Insights — every Crop Advisor consultation on the shop website
// is logged (crop, land, budget, whether the plan fit the budget). This page
// turns that into stocking decisions for the owner.
const Insights = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // Explicit header — on a hard refresh this effect runs before App.jsx
        // has installed the axios default token header.
        const res = await axios.get(`${url}/api/advisor/insights`, {
          headers: { token: localStorage.getItem("adminToken") || "" },
        });
        if (res.data.success) setData(res.data.data);
        else toast.error(res.data.message || "Failed to load insights");
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [url]);

  if (loading) {
    return (
      <div className="dashboard">
        <Spinner label="Loading crop insights..." />
      </div>
    );
  }

  if (!data) return <div className="dashboard" />;

  const tiles = [
    {
      label: "Farmer Consultations",
      value: data.totalConsultations,
      icon: "🧑‍🌾",
      accent: "#22c55e",
    },
    {
      label: "Fertilizer Plans",
      value: data.growCount,
      icon: "🌱",
      accent: "#3b82f6",
    },
    {
      label: "Avg Farmer Budget",
      value: data.avgBudget ? `₹${data.avgBudget.toLocaleString("en-IN")}` : "—",
      icon: "💰",
      accent: "#f59e0b",
    },
    {
      label: "Plans Over Budget",
      value: `${data.overBudgetPct}%`,
      icon: "⚠️",
      accent: "#ef4444",
    },
  ];

  const CountTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-val">{payload[0].value} consultation(s)</p>
        </div>
      );
    }
    return null;
  };

  const maxProblem = Math.max(...data.topProblems.map((p) => p.count), 1);

  return (
    <div className="dashboard insights-page">
      <h2 className="dash-title">🌾 Crop Demand Insights</h2>
      <p className="insights-intro">
        Live demand from the website&apos;s Crop Advisor — what farmers are
        planning to grow, how much they can spend, and where stock or pricing
        is losing sales.
      </p>

      <div className="stats-grid">
        {tiles.map((c, i) => (
          <div
            key={c.label}
            className="stat-card animate-up"
            style={{
              borderTop: `3px solid ${c.accent}`,
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div className="stat-card-icon" style={{ color: c.accent }}>
              {c.icon}
            </div>
            <div>
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {data.totalConsultations === 0 ? (
        <div className="recent-section insights-empty">
          <h3 className="section-title">No consultations yet</h3>
          <p>
            When farmers use the Crop Advisor on the website, their demand will
            appear here automatically.
          </p>
        </div>
      ) : (
        <>
          {data.topCrops.length > 0 && (
            <div className="chart-section">
              <h3 className="section-title">🏆 Most Requested Crops</h3>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={data.topCrops.map((c) => ({ name: c.crop, count: c.count }))}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--light-text-secondary)", fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "var(--light-text-secondary)", fontSize: 12 }}
                    />
                    <Tooltip content={<CountTooltip />} />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {data.topCrops.length > 0 && (
            <div className="recent-section">
              <h3 className="section-title">📋 Demand Details (stock these!)</h3>
              <div className="recent-table">
                <div className="recent-row insights-row recent-header">
                  <span>Crop</span>
                  <span>Consultations</span>
                  <span>Avg Land (acre)</span>
                  <span>Avg Budget</span>
                  <span>Hit Budget Limit</span>
                </div>
                {data.topCrops.map((c) => (
                  <div key={c.crop} className="recent-row insights-row">
                    <span className="insights-crop">{c.crop}</span>
                    <span>{c.count}</span>
                    <span>{c.avgAcres}</span>
                    <span>{c.avgBudget ? `₹${c.avgBudget.toLocaleString("en-IN")}` : "—"}</span>
                    <span>
                      {c.overBudget > 0 ? (
                        <span className="stock-pill low">{c.overBudget} time(s)</span>
                      ) : (
                        <span className="stock-pill in">None</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="analytics-row">
            {data.topProblems.length > 0 && (
              <div className="recent-section analytics-card">
                <h3 className="section-title">🛡️ Crop Problems Reported</h3>
                <div className="category-list">
                  {data.topProblems.map((p) => (
                    <div key={p.problem} className="category-row">
                      <div className="category-label">
                        <span>{p.problem}</span>
                        <span className="category-rev">{p.count}</span>
                      </div>
                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{ width: `${(p.count / maxProblem) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="recent-section analytics-card">
              <h3 className="section-title">📈 Last 14 Days Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={data.trend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--light-text-secondary)", fontSize: 10 }}
                    interval={1}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "var(--light-text-secondary)", fontSize: 12 }}
                  />
                  <Tooltip content={<CountTooltip />} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;
