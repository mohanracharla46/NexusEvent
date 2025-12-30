import Event from "../models/Event.js";
import RSVP from "../models/RSVP.js";

export const createEvent = async (req, res) => {
    try {
        const eventData = { ...req.body };

        if (req.file) {
            eventData.image = `/uploads/${req.file.filename}`;
        }

        const event = await Event.create({
            ...eventData,
            createdBy: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        const { category } = req.query;
        const query = { dateTime: { $gte: new Date() } };
        if (category && category !== "All") {
            query.category = category;
        }
        const events = await Event.find(query).populate("createdBy", "name");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Forbidden" });

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("createdBy", "name");
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.createdBy.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Forbidden" });

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        const createdEvents = await Event.find({ createdBy: req.user._id });
        const joinedRsvps = await RSVP.find({ user: req.user._id }).populate("event");
        const joinedEvents = joinedRsvps.map(rsvp => rsvp.event).filter(event => event !== null);

        res.json({ createdEvents, joinedEvents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
