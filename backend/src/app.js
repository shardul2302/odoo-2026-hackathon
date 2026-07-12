import express from "express";

import authRoutes from "./routes/auth.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import emissionFactorRoutes from "./routes/emissionFactor.routes.js";
import carbonTransactionRoutes from "./routes/carbonTransaction.routes.js";

const app = express();

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

export default app;