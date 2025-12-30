import express from "express";
import protect from "../middleware/authMiddleware.js";
import { joinEvent } from "../controllers/rsvpController.js";

const router = express.Router();

router.post("/:id", protect, joinEvent);

export default router;

