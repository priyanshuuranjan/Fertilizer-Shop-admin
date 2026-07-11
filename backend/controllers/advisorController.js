import advisorModel from "../models/advisorModel.js";

// Public: the frontend fires this after every advisor calculation.
// Keep it forgiving — bad numbers are clamped, never rejected with a 500.
const logAdvisorQuery = async (req, res) => {
  try {
    const { mode, crop, problem, acres, budget, fullCost, planCost, fitsBudget } =
      req.body;

    if (mode !== "grow" && mode !== "protect") {
      return res.json({ success: false, message: "Invalid mode" });
    }

    const num = (v, max = 10_000_000) => {
      const n = Number(v);
      if (!Number.isFinite(n) || n < 0) return 0;
      return Math.min(n, max);
    };

    await advisorModel.create({
      mode,
      crop: String(crop || "").slice(0, 60),
      problem: String(problem || "").slice(0, 60),
      acres: num(acres, 100000),
      budget: num(budget),
      fullCost: num(fullCost),
      planCost: num(planCost),
      fitsBudget: fitsBudget !== false,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging advisor query" });
  }
};

// Admin: aggregated demand insights for the Crop Insights page.
const getAdvisorInsights = async (req, res) => {
  try {
    const [totals, topCrops, topProblems, budgetStats, trendRaw] =
      await Promise.all([
        advisorModel.aggregate([
          { $group: { _id: "$mode", count: { $sum: 1 } } },
        ]),
        advisorModel.aggregate([
          { $match: { mode: "grow", crop: { $ne: "" } } },
          {
            $group: {
              _id: "$crop",
              count: { $sum: 1 },
              avgAcres: { $avg: "$acres" },
              avgBudget: { $avg: "$budget" },
              overBudget: { $sum: { $cond: ["$fitsBudget", 0, 1] } },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
        advisorModel.aggregate([
          { $match: { mode: "protect", problem: { $ne: "" } } },
          { $group: { _id: "$problem", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        advisorModel.aggregate([
          { $match: { mode: "grow", budget: { $gt: 0 } } },
          {
            $group: {
              _id: null,
              avgBudget: { $avg: "$budget" },
              overBudget: { $sum: { $cond: ["$fitsBudget", 0, 1] } },
              withBudget: { $sum: 1 },
            },
          },
        ]),
        advisorModel.aggregate([
          {
            $match: {
              date: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const modeCounts = Object.fromEntries(totals.map((t) => [t._id, t.count]));

    // Fill the last 14 days so the chart has no gaps.
    const trendMap = Object.fromEntries(trendRaw.map((d) => [d._id, d.count]));
    const trend = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      trend.push({
        day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        count: trendMap[key] || 0,
      });
    }

    const budget = budgetStats[0] || null;

    res.json({
      success: true,
      data: {
        totalConsultations: (modeCounts.grow || 0) + (modeCounts.protect || 0),
        growCount: modeCounts.grow || 0,
        protectCount: modeCounts.protect || 0,
        topCrops: topCrops.map((c) => ({
          crop: c._id,
          count: c.count,
          avgAcres: Math.round((c.avgAcres || 0) * 100) / 100,
          avgBudget: Math.round(c.avgBudget || 0),
          overBudget: c.overBudget,
        })),
        topProblems: topProblems.map((p) => ({
          problem: p._id,
          count: p.count,
        })),
        avgBudget: budget ? Math.round(budget.avgBudget) : 0,
        overBudgetPct: budget?.withBudget
          ? Math.round((budget.overBudget / budget.withBudget) * 100)
          : 0,
        trend,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching advisor insights" });
  }
};

export { logAdvisorQuery, getAdvisorInsights };
