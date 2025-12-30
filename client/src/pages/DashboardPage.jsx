import { useState, useEffect } from "react";
import api from "../utils/api";
import EventCard from "../components/EventCard";
import { PlusCircle, Calendar, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
    const [createdEvents, setCreatedEvents] = useState([]);
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("created");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get("/events/me");
                setCreatedEvents(data.createdEvents);
                setJoinedEvents(data.joinedEvents);
            } catch (err) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="container"><p style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</p></div>;

    const displayedEvents = activeTab === "created" ? createdEvents : joinedEvents;

    return (
        <div className="container animate-fade" style={{ padding: '40px 0 100px' }}>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your hosted and joined events</p>
                </div>
                <Link to="/create-event" className="nav-btn">
                    <PlusCircle size={20} />
                    Create New Event
                </Link>
            </div>

            <div className="tabs-container">
                <button
                    onClick={() => setActiveTab("created")}
                    className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
                >
                    <UserIcon size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Events I'm Hosting
                </button>
                <button
                    onClick={() => setActiveTab("joined")}
                    className={`tab-btn ${activeTab === "joined" ? "active" : ""}`}
                >
                    <Calendar size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Events I've Joined
                </button>
            </div>

            {displayedEvents.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: 'var(--glass)',
                    borderRadius: '16px',
                    border: '1px dashed var(--border)'
                }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        {activeTab === "created" ? "You haven't created any events yet." : "You haven't joined any events yet."}
                    </p>
                    {activeTab === "created" && (
                        <Link to="/create-event" className="nav-link" style={{ color: 'var(--primary)' }}>
                            Start your first event now →
                        </Link>
                    )}
                    {activeTab === "joined" && (
                        <Link to="/" className="nav-link" style={{ color: 'var(--primary)' }}>
                            Explore upcoming events →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="events-grid">
                    {displayedEvents.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            hideActions={true}
                            refreshEvents={() => window.location.reload()}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
