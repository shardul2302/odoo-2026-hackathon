import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import Department from "../models/department.model.js";
import Category from "../models/category.model.js";
import EmissionFactor from "../models/emissionFactor.model.js";
import CarbonTransaction from "../models/carbonTransaction.model.js";
import User from "../models/user.model.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([
    Department.deleteMany({}),
    Category.deleteMany({}),
    EmissionFactor.deleteMany({}),
    CarbonTransaction.deleteMany({}),
    User.deleteMany({ email: { $regex: /@ecosphere\.com$/i } }),
  ]);

  const departments = await Department.insertMany([
    { name: "Operations", description: "Manufacturing and field operations", isActive: true },
    { name: "People & Culture", description: "Employee engagement and training", isActive: true },
    { name: "Finance", description: "Budget tracking and ESG reporting", isActive: true },
    { name: "Supply Chain", description: "Procurement and vendor sustainability review", isActive: true },
  ]);

  const categories = await Category.insertMany([
    { name: "Energy", description: "Power and utilities", isActive: true },
    { name: "Travel", description: "Business travel and commuting", isActive: true },
    { name: "Waste", description: "Material disposal and recycling", isActive: true },
    { name: "Community", description: "Volunteer and community outreach programs", isActive: true },
  ]);

  const emissionFactors = await EmissionFactor.insertMany([
    {
      name: "Grid Electricity",
      category: categories[0]._id,
      unit: "kWh",
      factor: 0.42,
      description: "Average grid electricity emission factor",
      isActive: true,
    },
    {
      name: "Diesel Fuel",
      category: categories[1]._id,
      unit: "L",
      factor: 2.68,
      description: "Diesel combustion factor",
      isActive: true,
    },
    {
      name: "Office Waste",
      category: categories[2]._id,
      unit: "kg",
      factor: 0.18,
      description: "Landfill waste estimate",
      isActive: true,
    },
    {
      name: "Volunteer Travel",
      category: categories[3]._id,
      unit: "km",
      factor: 0.12,
      description: "Community outreach transport factor",
      isActive: true,
    },
  ]);

  const passwordHash = async (plain) => bcrypt.hash(plain, 10);

  const adminPassword = await passwordHash("Admin123!");
  const employeePassword = await passwordHash("Employee123!");
  const managerPassword = await passwordHash("Manager123!");

  const adminUser = await User.create({
    name: "EcoSphere Admin",
    email: "admin@ecosphere.com",
    password: adminPassword,
    role: "Admin",
    department: departments[0]._id,
  });

  await User.create({
    name: "Mina Patel",
    email: "employee@ecosphere.com",
    password: employeePassword,
    role: "Employee",
    department: departments[1]._id,
  });

  await User.create({
    name: "Daniel Brooks",
    email: "manager@ecosphere.com",
    password: managerPassword,
    role: "Manager",
    department: departments[3]._id,
  });

  await CarbonTransaction.insertMany([
    {
      user: adminUser._id,
      category: categories[0]._id,
      activity: "Factory energy usage",
      quantity: 5400,
      unit: "kWh",
      carbonAmount: 2268,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      user: adminUser._id,
      category: categories[1]._id,
      activity: "Executive travel",
      quantity: 320,
      unit: "km",
      carbonAmount: 61.6,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      user: adminUser._id,
      category: categories[2]._id,
      activity: "Office waste disposal",
      quantity: 840,
      unit: "kg",
      carbonAmount: 151.2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      user: adminUser._id,
      category: categories[3]._id,
      activity: "Community clean-up drive",
      quantity: 180,
      unit: "km",
      carbonAmount: 21.6,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  ]);

  console.log("Seed data created successfully");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
