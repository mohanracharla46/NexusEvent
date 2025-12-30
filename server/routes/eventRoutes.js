import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getUserEvents
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/me", protect, getUserEvents);
router.get("/:id", getEventById);
router.post("/", protect, upload.single("image"), createEvent);
router.put("/:id", protect, upload.single("image"), updateEvent);
router.delete("/:id", protect, deleteEvent);


export default router;
