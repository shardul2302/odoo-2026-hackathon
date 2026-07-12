import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import emissionFactorRoutes from "./routes/emissionFactor.routes.js";
import carbonTransactionRoutes from "./routes/carbonTransaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3001", "http://127.0.0.1:3002"],
    credentials: true,
}));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API is running...",
    });
});

// Register Routes

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/departments",
    departmentRoutes
);

app.use(
    "/api/v1/categories",
    categoryRoutes
);

app.use(
    "/api/v1/emission-factors",
    emissionFactorRoutes
);

app.use(
    "/api/v1/carbon-transactions",
    carbonTransactionRoutes
);

app.use(
    "/api/v1/dashboard",
    dashboardRoutes
);

export default app;