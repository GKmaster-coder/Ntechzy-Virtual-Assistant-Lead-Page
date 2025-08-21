import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Routes
import userRouter from "./routes/form.route.js";
app.use("/api/v1/user", userRouter);

export { app };
