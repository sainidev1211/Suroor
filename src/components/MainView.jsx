import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaSearch, FaPlay, FaCrown, FaTrash, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Loader } from './Loader';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function MainView({ view, setView, likedSongs, playlists, onPlay, currentTrack, user, onLogin, onSignup, toggleLike, isLiked }) {

    const [query, setQuery] = useState("");
    const [tracks, setTracks] = useState([]);
    const [greeting, setGreeting] = useState("Good Afternoon");
    const [history, setHistory] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeChip, setActiveChip] = useState('all');

    // ... existing history/greeting code ...
    // Load history
    useEffect(() => {
        try {
            const h = JSON.parse(localStorage.getItem('spotelly_search_history') || "[]");
            setHistory(h);
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    const addToHistory = (q) => {
        if (!q.trim()) return;
        const newH = [q, ...history.filter(i => i !== q)].slice(0, 5);
        setHistory(newH);
        localStorage.setItem('spotelly_search_history', JSON.stringify(newH));
    };

    // Dynamic Greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");

        // Default fetching based on View
        setQuery(""); // Clear manual search when view changes
        if (view === 'music') searchMusic("Top Global Hits 2024", 'music');
        else if (view === 'podcasts') searchMusic("Trending Podcasts 2024", 'podcast');
        else if (view === 'stories') searchMusic("Audio Stories for everyone", 'stories');
        else if (view === 'horror') searchMusic("Horror Stories Audio", 'horror');
        else if (view === 'crime') searchMusic("Crime Stories Audio", 'crime');
        else if (view === 'news_india') searchMusic("Live News India", 'live');
        else if (view === 'news_intl') searchMusic("World News Live", 'live');

        setActiveChip('all');
    }, [view]);

    const [isSearching, setIsSearching] = useState(false);

    // Search Logic
    const searchMusic = async (q, type = 'music') => {
        if (!q) return;
        setIsSearching(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/search?query=${q}&type=${type}`);
            const enhanced = res.data.map(track => ({
                ...track,
                source: `${BACKEND_URL}/stream?query=${track.id}`
            }));
            setTracks(enhanced);
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounce Search
    useEffect(() => {
        const delay = setTimeout(() => {
            // Determine type based on current view for manual searches
            let type = 'music';
            if (view === 'podcasts') type = 'podcast';
            else if (['stories', 'horror', 'crime'].includes(view)) type = 'stories';
            else if (['news_india', 'news_intl'].includes(view)) type = 'live';

            if (query) {
                searchMusic(query, type);
                addToHistory(query);
            }
        }, 1000); // Slower debounce to avoid spamming history
        return () => clearTimeout(delay);
    }, [query, view]);

    // CHIP HANDLER
    const handleChipClick = (type, label) => {
        setActiveChip(type);
        setQuery(""); // Clear search
        const queryTerm = label + " " + (type === 'music' ? "hits" : "latest");
        searchMusic(queryTerm, type);
    };

    // RENDER HELPERS
    const renderCard = (track) => (
        <div key={track.id} className="card group">
            {/* Image & Hover Actions */}
            <div className="card-img-wrapper" style={{ position: 'relative' }}>
                <img src={track.cover} alt={track.title} />
                <div className="card-overlay hover:opacity-100" style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 16, opacity: 0, transition: 'opacity 0.2s', borderRadius: 8
                }}>
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                        {isLiked && isLiked(track) ? <FaHeart color="#ffbe0b" size={24} /> : <FaRegHeart color="white" size={24} />}
                    </button>
                    <button onClick={() => onPlay(track)}
                        style={{ background: '#ffbe0b', border: 'none', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FaPlay color="black" size={20} style={{ marginLeft: 4 }} />
                    </button>
                </div>
            </div>
            <div className="card-title" style={{ marginTop: 8 }}>{track.title}</div>
            <div className="card-desc">{track.artist}</div>
        </div>
    );

    // VIDEO PLAYER RENDERER REMOVED - Using FullScreenPlayer instead to prevent double audio

    // Determine Content
    let content;
    let title = greeting;

    // AUTH VIEW
    if (view === 'login') {
        const [isSignup, setIsSignup] = useState(false);
        const [authError, setAuthError] = useState("");

        const handleAuth = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            setAuthError("");

            try {
                if (isSignup) {
                    await onSignup(data.name, data.email, data.password);
                    alert("Account created!");
                } else {
                    await onLogin(data.email, data.password);
                }
                // Redirect implicit via state change in parent or manual?
                // Usually parent will switch view if user is logged in.
            } catch (err) {
                setAuthError("Authentication failed. Please check credentials.");
            }
        };

        content = (
            <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                <div style={{ background: '#222', padding: 40, borderRadius: 12, width: 400 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isSignup ? "Create Account" : "Log in to SUROOR"}</h2>
                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {isSignup && <input name="name" placeholder="Full Name" required style={{ padding: 12, borderRadius: 4, border: 'none' }} />}
                        <input name="email" type="email" placeholder="Email" required style={{ padding: 12, borderRadius: 4, border: 'none' }} />
                        <input name="password" type="password" placeholder="Password" required style={{ padding: 12, borderRadius: 4, border: 'none' }} />

                        {authError && <div style={{ color: 'red', fontSize: 12, textAlign: 'center' }}>{authError}</div>}

                        <button type="submit" style={{ padding: 12, borderRadius: 24, border: 'none', background: 'var(--brand-gold)', color: 'black', fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>
                            {isSignup ? "Sign Up" : "Log In"}
                        </button>
                    </form>
                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#aaa', cursor: 'pointer' }} onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                    </div>
                </div>
            </div>
        );
    } else if (view === 'news_india' || view === 'news_intl') {
        // Special Layout for News - List Only (Video opens in FullScreen)
        content = (
            <div className="news-layout" style={{ height: '100%', padding: 20 }}>
                <div className="news-list" style={{ maxWidth: 800, margin: '0 auto', background: '#222', borderRadius: 12, padding: 20 }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: 20, borderBottom: '1px solid #444', paddingBottom: 10 }}>
                        {view === 'news_india' ? 'Live News India' : 'World News Live'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {tracks.map(track => (
                            <div key={track.id} onClick={() => onPlay({ ...track, isVideo: true })} style={{
                                display: 'flex', gap: 16, cursor: 'pointer', padding: 12,
                                background: currentTrack?.id === track.id ? '#333' : 'rgba(255,255,255,0.05)', borderRadius: 8,
                                alignItems: 'center', transition: 'background 0.2s'
                            }}>
                                <img src={track.cover} style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 4 }} alt="" />
                                <div>
                                    <div style={{ fontWeight: 600, color: 'white', fontSize: 16 }}>{track.title}</div>
                                    <div style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>{track.artist} • Live</div>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <FaPlay color="var(--brand-gold)" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    } else if (view === 'music') title = "Music";
    // ... REST OF LOGIC SAME ...
    else if (view === 'podcasts') title = "Podcasts";
    else if (view === 'stories') title = "Stories";
    else if (view === 'horror') title = "Horror Stories";
    else if (view === 'crime') title = "Crime Stories";
    else if (view === 'favorites') title = "Liked Songs";
    else title = view.charAt(0).toUpperCase() + view.slice(1);

    if (!['news_india', 'news_intl', 'login'].includes(view)) {
        if (view === 'favorites') {
            // ... existing favorites logic
            content = (
                <div className="cards-grid">
                    {likedSongs && likedSongs.length > 0 ? likedSongs.map(renderCard) : <div style={{ color: '#aaa', padding: 20 }}>No liked songs yet. Go explore!</div>}
                </div>
            );
        } else if (['music', 'podcasts', 'stories', 'horror', 'crime', 'home'].includes(view)) {
            // ... existing grid logic
            content = (
                <div className="cards-grid">
                    {tracks.map(renderCard)}
                </div>
            );
        } else {
            // SOON
            content = (
                <div style={{
                    height: '60vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)'
                }}>
                    <h1 style={{ fontSize: 48, marginBottom: 16 }}>SOON...</h1>
                    <p>WE ARE WORKING ON IT</p>
                </div>
            );
        }
    }

    // Chips UI
    const chips = [
        { id: 'all', label: 'All' },
        { id: 'music', label: 'Music' },
        { id: 'podcast', label: 'Podcasts' },
        { id: 'live', label: 'Live Events' }
    ];

    return (
        <main className="main-view">
            {/* TOP BAR */}
            <header className="top-bar">
                <div className="search-box">
                    <FaSearch color="rgba(255,255,255,0.5)" size={16} />
                    <input
                        type="text"
                        placeholder="What do you want to play?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                    {isSearching && <div style={{ display: 'flex', justifyContent: 'center', margin: 30 }}><Loader /></div>}

                    {/* Search History Dropdown */}
                    {isSearchFocused && history.length > 0 && !query && (
                        <div className="search-history" style={{
                            position: 'absolute', top: 50, left: 0, width: '100%',
                            background: '#282828', borderRadius: 8, padding: 10, zIndex: 100,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}>
                            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>Recent Searches</div>
                            {history.map((h, i) => (
                                <div key={i} className="history-item" style={{
                                    padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                                    color: '#fff', fontSize: 14, justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => setQuery(h)}>
                                        <FaClock size={12} color="#888" />
                                        {h}
                                    </div>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        const newH = history.filter(item => item !== h);
                                        setHistory(newH);
                                        localStorage.setItem('spotelly_search_history', JSON.stringify(newH));
                                    }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}>
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    {user ? (
                        <>
                            <div style={{ textAlign: 'right', marginRight: 10 }}>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
                                <div style={{ fontSize: 10, color: 'var(--brand-gold)', fontFamily: 'cursive' }}>Love From Dev</div>
                            </div>
                            <img src={user.avatar || "https://i.pravatar.cc/150"} alt="User" />
                        </>
                    ) : (
                        <button onClick={() => setView('login')} style={{
                            background: 'white', color: 'black', border: 'none',
                            padding: '8px 24px', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer'
                        }}>
                            Sign In
                        </button>
                    )}
                </div>
            </header>

            {/* CHIPS */}
            <div className="category-chips" style={{ display: 'flex', gap: 8, padding: '0 24px 20px 24px' }}>
                {chips.map(chip => (
                    <button key={chip.id}
                        onClick={() => handleChipClick(chip.id === 'all' ? 'music' : chip.id, chip.label)}
                        style={{
                            background: activeChip === chip.id ? 'white' : 'rgba(255,255,255,0.1)',
                            color: activeChip === chip.id ? 'black' : 'white',
                            border: 'none', padding: '6px 16px', borderRadius: 16, cursor: 'pointer', fontSize: 14, fontWeight: 500
                        }}>
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="content-area" style={{ paddingTop: 0 }}>
                {view !== 'home' && <h2 className="section-title">{title}</h2>}
                {content}
            </div>

            <style>{`
                .card:hover .card-overlay { opacity: 1 !important; }
            `}</style>
        </main>
    );
}
