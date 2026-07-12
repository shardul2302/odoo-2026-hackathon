import Department from "../models/department.model.js";
import Category from "../models/category.model.js";
import EmissionFactor from "../models/emissionFactor.model.js";
import CarbonTransaction from "../models/carbonTransaction.model.js";
import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [departments, categories, factors, transactions, users] = await Promise.all([
    Department.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    EmissionFactor.countDocuments({ isActive: true }),
    CarbonTransaction.find().sort({ date: -1 }).limit(5).populate("category", "name"),
    User.countDocuments(),
  ]);

  const totalCarbon = transactions.reduce((sum, item) => sum + (item.carbonAmount || 0), 0);
  const latestTransactionTotal = transactions[0]?.carbonAmount || 0;

  const monthlyTrend = [
    { month: "Jan", value: 182 },
    { month: "Feb", value: 214 },
    { month: "Mar", value: 196 },
    { month: "Apr", value: 248 },
    { month: "May", value: 267 },
    { month: "Jun", value: 312 },
  ];

  const sustainabilityBreakdown = [
    { name: "Energy", value: 42, color: "#10b981" },
    { name: "Travel", value: 28, color: "#34d399" },
    { name: "Waste", value: 20, color: "#6ee7b7" },
    { name: "Community", value: 10, color: "#a7f3d0" },
  ];

  res.status(200).json(
    new ApiResponse(200, "Dashboard stats fetched", {
      departments,
      categories,
      factors,
      users,
      totalCarbon: Number(totalCarbon.toFixed(1)),
      latestTransactionTotal: Number(latestTransactionTotal.toFixed(1)),
      monthlyTrend,
      sustainabilityBreakdown,
      recentTransactions: transactions,
      insights: [
        "Emission tracking is improving month over month.",
        "Operations remain your largest sustainability focus area.",
        "Three active departments are keeping reporting on schedule.",
      ],
    })
  );
});
