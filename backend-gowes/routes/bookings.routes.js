// backend-gowes/routes/bookings.routes.js
import { Router } from "express";
import {
  list,
  create,
  getOne,
  checkIn,
  returnBike,
  cancel,
} from "../controllers/bookings.controller.js";

const router = Router();

router.get("/", list);
router.post("/", create);
router.get("/:id", getOne);
router.patch("/:id/checkin", checkIn);
router.patch("/:id/return", returnBike);
router.delete("/:id", cancel);

export default router;
