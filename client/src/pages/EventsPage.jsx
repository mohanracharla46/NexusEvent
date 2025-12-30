import { useState, useEffect } from "react";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import { Search } from "lucide-react";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const categories = ["All", "Tech", "Music", "Sports", "Art", "Food", "Other"];

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/events?category=${category}`);
                setEvents(data);
                setFilteredEvents(data);
            } catch (err) {
                console.error("Failed to fetch events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [category]);

    useEffect(() => {
        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [searchTerm, events]);

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div className="hero animate-fade">
                <h1>Discover Amazing <span style={{ color: 'var(--primary)' }}>Events</span></h1>
                <p>Curated experiences at your fingertips. Discover tech meetups, concerts, and workshops happening now.</p>

                <div className="search-container" style={{ marginTop: '40px' }}>
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, category or location..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="category-filters animate-fade" style={{ animationDelay: '0.1s' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`filter-btn ${category === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ color: 'var(--text-muted)' }}>Fetching events...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }} className="animate-fade">
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                    <h3 style={{ marginBottom: '10px' }}>No events found</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            ) : (
                <div className="events-grid animate-fade" style={{ animationDelay: '0.2s' }}>
                    {filteredEvents.map(event => (
                        <EventCard key={event._id} event={event} refreshEvents={() => window.location.reload()} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
