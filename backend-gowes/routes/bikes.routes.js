// backend-gowes/routes/bikes.routes.js
import { Router } from "express";
import { list, updateStatus } from "../controllers/bikes.controller.js";

const router = Router();

router.get("/", list);
router.patch("/:id/status", updateStatus);

export default router;
