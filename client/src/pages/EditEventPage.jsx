import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dateTime: "",
        location: "",
        capacity: 10,
        image: null,
        category: "Other"
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                // Format date for datetime-local input
                const formattedDate = new Date(data.dateTime).toISOString().slice(0, 16);
                setFormData({ ...data, dateTime: formattedDate });
                setLoading(false);
            } catch (err) {
                alert("Failed to fetch event data");
                navigate("/");
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            /* Only append image if it's a file object (newly selected) */
            if (key === 'image' && typeof formData[key] === 'string') return;
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            await api.put(`/events/${id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate(`/event/${id}`);
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="container"><p>Loading...</p></div>;

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Update Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Update Image (Leave empty to keep current)</label>
                        <input
                            type="file"
                            className="form-input"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={formData.dateTime}
                                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacity</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            className="form-input"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="Tech">Tech</option>
                            <option value="Music">Music</option>
                            <option value="Sports">Sports</option>
                            <option value="Art">Art</option>
                            <option value="Food">Food</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ resize: 'none' }}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="nav-btn" style={{ width: '100%', padding: '15px' }} disabled={updating}>
                        {updating ? "Saving Changes..." : "Update Event"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="nav-link"
                        style={{ width: '100%', marginTop: '15px', color: 'var(--text-muted)' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEventPage;
