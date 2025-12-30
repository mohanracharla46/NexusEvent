import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { Calendar, MapPin, Users, Trash } from "lucide-react";
import { getImageUrl } from "../utils/imageHelper";

const EventCard = ({ event, refreshEvents, hideActions = false }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const isCreator = user && user.id === event.createdBy;
    const isFull = event.attendeesCount >= event.capacity;

    const handleJoin = async (e) => {
        // ... (existing helper logic)
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            await api.post(`/rsvp/${event._id}`);
            addToast("Joined event successfully!", "success");
            refreshEvents();
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to join event", "error");
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.delete(`/events/${event._id}`);
                addToast("Event deleted successfully", "success");
                refreshEvents();
            } catch (err) {
                addToast("Failed to delete event", "error");
            }
        }
    };

    return (
        <div className="event-card">
            <Link to={`/event/${event._id}`} className="event-img-container">
                <img src={getImageUrl(event.image)} alt={event.title} className="event-img" />
                {event.category && (
                    <span className="category-badge">
                        {event.category}
                    </span>
                )}
            </Link>
            <div className="event-body">
                <Link to={`/event/${event._id}`}>
                    <h3 className="event-title">{event.title}</h3>
                </Link>

                <div style={{ marginBottom: '16px' }}>
                    <div className="event-info">
                        <Calendar size={16} /> {new Date(event.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="event-info">
                        <MapPin size={16} /> {event.location}
                    </div>
                    <div className="event-info">
                        <Users size={16} /> <span style={{ color: isFull ? '#f87171' : 'inherit' }}>{event.attendeesCount} / {event.capacity} Joined</span>
                    </div>
                </div>

                <div className="event-footer">
                    {isCreator ? (
                        !hideActions && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link to={`/edit-event/${event._id}`} className="nav-btn btn-sm secondary">Edit</Link>
                                <button onClick={handleDelete} className="nav-btn btn-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    <Trash size={14} />
                                </button>
                            </div>
                        )
                    ) : (
                        <button
                            onClick={handleJoin}
                            disabled={isFull}
                            className="nav-btn btn-sm"
                            style={{
                                opacity: isFull ? 0.5 : 1,
                                filter: isFull ? 'grayscale(1)' : 'none'
                            }}
                        >
                            {isFull ? "Full" : "Join Now"}
                        </button>
                    )}
                    <Link to={`/event/${event._id}`} className="nav-link" style={{ fontSize: '0.85rem' }}>Details</Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
