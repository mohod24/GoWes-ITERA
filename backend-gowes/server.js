import express from "express";
import helmet from "helmet";
import cors from "cors";
import bookingsRouter from "./routes/bookings.routes.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/bookings", bookingsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
