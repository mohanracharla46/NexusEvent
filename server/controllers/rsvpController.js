import RSVP from "../models/RSVP.js";
import Event from "../models/Event.js";

export const joinEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        /* Check if event is full */
        if (event.attendeesCount >= event.capacity) {
            return res.status(400).json({ message: "Event is full" });
        }

        /* Check if user already RSVP'd */
        const existingRSVP = await RSVP.findOne({ user: userId, event: eventId });
        if (existingRSVP) {
            return res.status(400).json({ message: "You have already RSVP'd to this event" });
        }

        /* Create RSVP */
        await RSVP.create({ user: userId, event: eventId });

        /* Update event attendees count */
        event.attendeesCount += 1;
        await event.save();

        res.status(201).json({ message: "Joined event successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
