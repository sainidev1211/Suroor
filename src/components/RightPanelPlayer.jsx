import React, { useState, useEffect } from 'react';
import YouTubePlayer from "./YouTubePlayer";
import PremiumLoader from "./PremiumLoader";
import { FaTimes, FaEllipsisH } from 'react-icons/fa';

export function RightPanelPlayer({ track, onClose, toggleLike, isLiked, addToPlaylist, setPlayer, isOpen }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Simulate "Preparing vibe" or wait for real event from YouTubePlayer
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, [track?.id]);

    if (!track) return null;

    return (
        <div className="right-panel glass-panel">
            {isLoading && <PremiumLoader song={track.title} artist={track.artist} />}

            <div className="panel-header">
                <h3>Now Playing</h3>
                <div className="header-actions">
                    <button className="icon-btn"><FaEllipsisH /></button>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>
            </div>

            <div className="panel-content">
                <div className="large-cover-wrapper">
                    {track.youtubeId || track.id ? (
                        <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}> {/* Non-interactive */}
                            <YouTubePlayer
                                videoId={track.youtubeId || track.id}
                                onPlayerReady={setPlayer}
                            />
                        </div>
                    ) : (
                        <img src={track.cover} alt={track.title} className="large-cover" />
                    )}
                </div>

                <div className="panel-track-info">
                    <div className="info-text">
                        <h2 className="panel-title">{track.title}</h2>
                        <span className="panel-artist">{track.artist}</span>
                    </div>
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
                    overflow-y: auto;
                    transition: width 0.3s ease;
                }
                .panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    background: transparent;
                }
                 .panel-content {
                    padding: 0 20px 100px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    color: white;
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
                .panel-track-info {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
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
