import React, { useState, useEffect } from 'react';
import YouTubePlayer from "./YouTubePlayer";
import PremiumLoader from "./PremiumLoader";
import { Community } from "./Community";
import { FaTimes, FaEllipsisH, FaCommentAlt, FaMusic } from 'react-icons/fa';

export function RightPanelPlayer({ track, onClose, toggleLike, isLiked, addToPlaylist, setPlayer, isOpen, autoPlay, onStateChange }) {
    const [activeTab, setActiveTab] = useState('playing'); // 'playing' | 'chat'

    if (!track) return null;

    return (
        <div className="right-panel glass-panel">
            <div className="panel-header">
                <h3>Now Playing</h3>
                <div className="header-actions">
                    <button className="icon-btn"><FaEllipsisH /></button>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>
            </div>

            <div className="panel-content" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* VIDEO AREA - FIXED TOP */}
                <div className="large-cover-wrapper" style={{ flexShrink: 0, margin: '0 20px 20px 20px', width: 'calc(100% - 40px)' }}>
                    {track.youtubeId || track.id ? (
                        <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}> {/* Non-interactive */}
                            <YouTubePlayer
                                videoId={track.youtubeId || track.id}
                                onPlayerReady={setPlayer}
                                autoPlay={autoPlay}
                                onStateChange={onStateChange}
                            />
                        </div>
                    ) : (
                        <img src={track.cover} alt={track.title} className="large-cover" />
                    )}
                </div>

                {/* TABS */}
                <div className="panel-tabs" style={{ display: 'flex', borderBottom: '1px solid #333', padding: '0 20px', marginBottom: 20 }}>
                    <button
                        onClick={() => setActiveTab('playing')}
                        style={{
                            flex: 1, padding: '10px', background: 'transparent', border: 'none', color: activeTab === 'playing' ? '#ffbe0b' : '#aaa',
                            borderBottom: activeTab === 'playing' ? '2px solid #ffbe0b' : 'none', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        style={{
                            flex: 1, padding: '10px', background: 'transparent', border: 'none', color: activeTab === 'chat' ? '#ffbe0b' : '#aaa',
                            borderBottom: activeTab === 'chat' ? '2px solid #ffbe0b' : 'none', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        Community
                    </button>
                </div>

                {/* TAB CONTENT */}
                <div className="tab-content" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px 20px' }}>
                    {activeTab === 'playing' ? (
                        <div className="panel-track-info">
                            <div className="info-text">
                                <h2 className="panel-title">{track.title}</h2>
                                <span className="panel-artist">{track.artist}</span>
                            </div>
                            <div className="about-artist" style={{ marginTop: 30, padding: 20, background: '#222', borderRadius: 12 }}>
                                <h4>About the Artist</h4>
                                <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
                                    {track.artist} is a trending artist on Suroor. Listen to more of their tracks in the library.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Community trackId={track.id} />
                    )}
                </div>
            </div>
            <style>{`
                /* Reuse existing styles */
                .right-panel {
                    width: 380px;
                    min-width: 300px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid rgba(255,255,255,0.1);
                    background: #121212;
                    overflow: hidden; /* Hide outer scroll, handle inner */
                    transition: width 0.3s ease;
                }
                .panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: transparent;
                }
                .large-cover-wrapper {
                    width: 100%;
                    aspect-ratio: 16/9;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                    background: black;
                    position: relative;
                }
                .panel-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    line-height: 1.2;
                }
                .panel-artist {
                    color: #b3b3b3;
                    font-size: 16px;
                    font-weight: 500;
                }
                .icon-btn, .close-btn {
                    background: transparent;
                    border: none;
                    color: #b3b3b3;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
            `}</style>
        </div>
    );
}
