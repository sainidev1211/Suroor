import React from 'react';
import { FaMusic, FaMicrophone, FaBookOpen, FaMagic, FaAlignLeft, FaTicketAlt, FaUsers, FaCalendarAlt, FaVideo, FaHeart, FaGlobe, FaSatelliteDish } from 'react-icons/fa';
// import logo from '../assets/logo.jpg'; 

import { useNavigate, useLocation } from 'react-router-dom';

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active based on path
    const getActive = () => {
        const path = location.pathname;
        if (path === '/') return 'music';
        if (path === '/stories') return 'stories';
        if (path === '/library') return 'favorites';
        return '';
    };

    const active = getActive();

    const handleNav = (id) => {
        if (id === 'music') navigate('/');
        else if (id === 'stories') navigate('/stories');
        else if (id === 'favorites') navigate('/library');
        else if (id === 'horror' || id === 'crime') navigate('/stories');
        else {
            console.log("Navigating to Placeholder:", id);
            navigate('/'); // Fallback
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
