import express from "express";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API is running..."
    });
});

// Register Routes
app.use("/api/v1/auth", authRoutes);

export default app;