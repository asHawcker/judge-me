import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";

import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import judgeRoutes from "./routes/judgeRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/api", judgeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "JudgeMe Backend is running successfully",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer is running`);
  console.log(
    `Accepting requests from: ${
      process.env.CLIENT_URL || "http://localhost:5173"
    }\n`
  );
});
