import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";

const CreateEventPage = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dateTime: "",
        location: "",
        capacity: 10,
        image: null,
        category: "Other"
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await api.post("/events", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            addToast("Event created successfully!", "success");
            navigate("/");
        } catch (err) {
            addToast(err.response?.data?.message || "Failed to create event", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Create New Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Event Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. React Workshop"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Event Image</label>
                        <input
                            type="file"
                            className="form-input"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            required
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
                            placeholder="City or Online"
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
                            placeholder="What is this event about?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ resize: 'none' }}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="nav-btn" style={{ width: '100%', padding: '15px' }} disabled={loading}>
                        {loading ? "Creating..." : "Launch Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;
