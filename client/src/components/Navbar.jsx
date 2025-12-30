import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, PlusCircle, Calendar } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Link to="/" className="nav-logo">NexusEvents</Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Explore</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={18} /> Dashboard
                            </Link>
                            <Link to="/create-event" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PlusCircle size={18} /> Create
                            </Link>
                            <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 8px' }}></div>
                            <span className="nav-link" style={{ cursor: 'default', color: 'var(--text-main)' }}>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', display: 'block', lineHeight: '1' }}>Welcome back,</span>
                                {user.name}
                            </span>
                            <button onClick={logout} className="nav-btn secondary" style={{ padding: '8px 16px' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
