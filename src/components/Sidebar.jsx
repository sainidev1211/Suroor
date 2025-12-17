import React from 'react';
import { FaMusic, FaMicrophone, FaBookOpen, FaMagic, FaAlignLeft, FaTicketAlt, FaUsers, FaCalendarAlt, FaVideo, FaHeart, FaGlobe, FaSatelliteDish } from 'react-icons/fa';
// import logo from '../assets/logo.jpg'; 

export function Sidebar({ setView }) {
    // Helper to determine active state - simplified for this demo
    const [active, setActive] = React.useState('music');

    const handleNav = (id) => {
        setActive(id);
        if (['music', 'podcasts', 'stories', 'horror', 'crime'].includes(id)) {
            setView(id);
        } else {
            console.log("Navigated to:", id);
            setView(id); // Allow all views to trigger setView
        }
    };

    const NavItem = ({ id, icon: Icon, label }) => (
        <div
            className={`nav-item ${active === id ? 'active' : ''}`}
            onClick={() => handleNav(id)}
        >
            <Icon size={20} />
            <span>{label}</span>
        </div>
    );

    return (
        <aside className="sidebar">
            {/* LOGO */}
            <div className="logo">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                    <img src="/suroor_logo.jpg" alt="SUROOR" className="logo-img" style={{ maxWidth: 40, borderRadius: 8 }} />
                    <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--brand-gold)', letterSpacing: '1px' }}>SUROOR</span>
                </div>
            </div>



            {/* NAV MENU */}
            <nav className="nav-menu">
                <NavItem id="music" icon={FaMusic} label="Music" />
                <NavItem id="stories" icon={FaBookOpen} label="Stories" />
                <NavItem id="horror" icon={FaBookOpen} label="Horror Stories" />
                <NavItem id="crime" icon={FaBookOpen} label="Crime Stories" />

                <div style={{ margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>

                <NavItem id="favorites" icon={FaHeart} label="Liked Songs" />
                <NavItem id="news_india" icon={FaSatelliteDish} label="News India" />
                <NavItem id="news_intl" icon={FaGlobe} label="News World" />

                <div style={{ margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>

                <NavItem id="ai" icon={FaMagic} label="AI Recommendations" />
                <NavItem id="lyrics" icon={FaAlignLeft} label="Lyrics" />
                <NavItem id="concerts" icon={FaTicketAlt} label="Concerts" />
                <NavItem id="community" icon={FaUsers} label="Community" />
                <NavItem id="events" icon={FaCalendarAlt} label="Events" />
                <NavItem id="live" icon={FaVideo} label="Live" />
            </nav>
        </aside>
    );
}
