import React, { useEffect, useState } from 'react';
import { FaMagic, FaClock, FaMoon, FaSun, FaCloudRain } from 'react-icons/fa';

export const AI = ({ onPlay }) => {
    const [greeting, setGreeting] = useState('');
    const [mood, setMood] = useState('focus');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 5) { setGreeting('Late Night Vibes'); setMood('chill'); }
        else if (hour < 12) { setGreeting('Morning Boost'); setMood('energy'); }
        else if (hour < 18) { setGreeting('Afternoon Focus'); setMood('focus'); }
        else { setGreeting('Evening Unwind'); setMood('relax'); }
    }, []);

    const MIXES = [
        { id: 'ai1', title: 'Your Daily Mix 1', artist: 'Made for You • Fresh & New', cover: 'https://placehold.co/300x300/1a1a1a/FFF?text=Mix+1' },
        { id: 'ai2', title: 'On Repeat', artist: 'Songs you love right now', cover: 'https://placehold.co/300x300/330033/FFF?text=Repeat' },
        { id: 'ai3', title: 'Discover Weekly', artist: 'New finds for Dev', cover: 'https://placehold.co/300x300/003366/FFF?text=Discover' },
        { id: 'ai4', title: 'Time Capsule', artist: 'Your favorites from 2024', cover: 'https://placehold.co/300x300/663300/FFF?text=2024' },
    ];

    const MOOD_PLAYLISTS = {
        'chill': [{ id: 'm1', title: 'Lofi Beats', artist: 'Relaxing Instrumental', cover: 'https://placehold.co/300x300/222/FFF?text=Lofi' }],
        'energy': [{ id: 'm2', title: 'Workout Hype', artist: 'High BPM', cover: 'https://placehold.co/300x300/red/FFF?text=Gym' }],
        'focus': [{ id: 'm3', title: 'Deep Focus', artist: 'Ambient & Piano', cover: 'https://placehold.co/300x300/blue/FFF?text=Focus' }],
        'relax': [{ id: 'm4', title: 'Sleep Sounds', artist: 'Rain & Nature', cover: 'https://placehold.co/300x300/grey/FFF?text=Sleep' }],
    };

    return (
        <div className="main-view fade-in">
            {/* HERO HEADER */}
            <div className="view-header" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '40px 30px', borderRadius: '0 0 20px 20px', marginBottom: 30
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: '50%' }}>
                        <FaMagic size={32} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 48, margin: 0, fontWeight: 800 }}>AI Personalization</h1>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: 18 }}>Curated just for you, powered by Suroor AI.</p>
                    </div>
                </div>
            </div>

            {/* MOOD SECTION */}
            <section className="track-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    {mood === 'chill' ? <FaMoon size={24} color="#a29bfe" /> : <FaSun size={24} color="#ffd700" />}
                    <h2 style={{ margin: 0 }}>{greeting}</h2>
                    <span className="badge-ai">Time-based</span>
                </div>

                <div className="cards-grid">
                    {MOOD_PLAYLISTS[mood]?.map(item => (
                        <div key={item.id} className="card group" onClick={() => onPlay({ ...item, youtubeId: '5qap5aO4i9A' })}>
                            <div className="card-img-wrapper">
                                <img src={item.cover} alt={item.title} />
                                <div className="card-overlay">
                                    <button className="play-btn-round">▶</button>
                                </div>
                            </div>
                            <div className="card-title">{item.title}</div>
                            <div className="card-desc">{item.artist}</div>
                        </div>
                    ))}
                    {/* Filler for demo */}
                    <div className="card group">
                        <div className="card-img-wrapper">
                            <img src="https://placehold.co/300x300/444/FFF?text=News" alt="News" />
                        </div>
                        <div className="card-title">Hourly Updates</div>
                        <div className="card-desc">Catch up in 3 mins</div>
                    </div>
                </div>
            </section>

            {/* CURATED MIXES */}
            <section className="track-section">
                <h3>Uniquely Yours</h3>
                <div className="cards-grid">
                    {MIXES.map(track => (
                        <div key={track.id} className="card group" onClick={() => onPlay({ ...track, youtubeId: 'jfKfPfyJRdk' })}>
                            <div className="card-img-wrapper">
                                <img src={track.cover} alt={track.title} />
                                <div className="card-overlay">
                                    <button className="play-btn-round">▶</button>
                                </div>
                            </div>
                            <div className="card-title">{track.title}</div>
                            <div className="card-desc">{track.artist}</div>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
                .badge-ai {
                    background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%);
                    color: black;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .play-btn-round {
                    width: 50px; height: 50px; border-radius: 50%;
                    background: #1db954; border: none; font-size: 24px;
                    display: flex; alignItems: center; justifyContent: center;
                    cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    transition: transform 0.2s;
                }
                .play-btn-round:hover { transform: scale(1.1); }
            `}</style>
        </div>
    );
};
