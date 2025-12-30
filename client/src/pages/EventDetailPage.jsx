import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Calendar, MapPin, Users, ArrowLeft, Trash, Edit } from "lucide-react";
import { getImageUrl } from "../utils/imageHelper";

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                console.error("Failed to fetch event");
                addToast("Failed to load event details", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleJoin = async () => {
        if (!user) return navigate("/login");
        try {
            await api.post(`/rsvp/${id}`);
            addToast("You have successfully joined the event!", "success");
            // Refresh logic - could optimize to just update local state, but reload works for now to update counts
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to join event", "error");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            try {
                await api.delete(`/events/${id}`);
                addToast("Event deleted successfully", "success");
                navigate("/dashboard");
            } catch (err) {
                addToast("Failed to delete event", "error");
            }
        }
    };

    if (loading) return (
        <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
            <p>Loading event details...</p>
        </div>
    );

    if (!event) return (
        <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <p className="text-muted">Event not found.</p>
            <Link to="/" className="nav-link" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Home</Link>
        </div>
    );

    const isCreator = user && user.id === event.createdBy;

    return (
        <div className="container animate-fade" style={{ padding: '40px 0 100px' }}>
            <Link to="/" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: 'var(--text-muted)' }}>
                <ArrowLeft size={18} /> Back to Events
            </Link>

            <div className="event-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
                <div style={{ position: 'relative' }}>
                    <img
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        style={{
                            width: '100%',
                            borderRadius: '20px',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border)',
                            objectFit: 'cover',
                            aspectRatio: '16/10'
                        }}
                    />
                    {event.category && (
                        <span className="category-badge" style={{ top: '20px', left: '20px', fontSize: '0.9rem', padding: '8px 16px' }}>
                            {event.category}
                        </span>
                    )}
                </div>

                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: '1.2' }}>{event.title}</h1>

                    <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                        <div className="event-info" style={{ fontSize: '1.05rem', marginBottom: '16px' }}>
                            <Calendar size={20} style={{ color: 'var(--primary)' }} />
                            {new Date(event.dateTime).toLocaleString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="event-info" style={{ fontSize: '1.05rem', marginBottom: '16px' }}>
                            <MapPin size={20} style={{ color: 'var(--secondary)' }} /> {event.location}
                        </div>
                        <div className="event-info" style={{ fontSize: '1.05rem' }}>
                            <Users size={20} style={{ color: 'var(--accent)' }} />
                            <span style={{ color: event.attendeesCount >= event.capacity ? '#f87171' : 'inherit' }}>
                                {event.attendeesCount} / {event.capacity} spots filled
                            </span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>About this event</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{event.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {isCreator ? (
                            <>
                                <Link to={`/edit-event/${id}`} className="nav-btn secondary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <Edit size={18} /> Edit Event
                                </Link>
                                <button onClick={handleDelete} className="nav-btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', flex: 1 }}>
                                    <Trash size={18} /> Delete Event
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleJoin}
                                className="nav-btn"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '1.1rem',
                                    opacity: event.attendeesCount >= event.capacity ? 0.6 : 1,
                                    cursor: event.attendeesCount >= event.capacity ? 'not-allowed' : 'pointer'
                                }}
                                disabled={event.attendeesCount >= event.capacity}
                            >
                                {event.attendeesCount >= event.capacity ? "Sold Out" : "Secure My Spot"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
