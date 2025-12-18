import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { FaTimes, FaHeart, FaRegHeart, FaEllipsisH, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export function RightPanelPlayer({ track, onClose, toggleLike, isLiked, addToPlaylist, createPlaylist, audioState, isOpen }) {
    // 1. Basic State
    // No video state needed anymore.

    // 2. Embed URL Logic
    // 2. Embed URL Logic
    // No longer needed for video, but we might want cover art.
    // const embedUrl = ...

    // 2. Embed URL Logic - No longer needed for music tracks.

    // 3. Iframe Ref
    // No longer needed as video is not rendered here.
    // const iframeRef = React.useRef(null);
    // const lastSyncTime = React.useRef(0);

    // 4. No Sync Needed if no video here

    // We only show RightPanel for Music tracks now.
    // If somehow a news track gets here, we just show info.

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

            <div className="panel-content">
                {/* Video Player (Music Only) or Cover */}
                <div className="large-cover-wrapper">
                    {track.id ? (
                        <ReactPlayer
                            ref={(p) => {
                                // Double binding to ensure we catch it
                                if (audioState.playerRef) audioState.playerRef.current = p;
                                console.log("[RightPanelPlayer] ReactPlayer Ref Callback:", p);
                            }}
                            url={`https://www.youtube.com/watch?v=${track.id}`}
                            playing={audioState.isPlaying}
                            volume={audioState.volume}
                            muted={false} // Frontend volume control
                            width="100%"
                            height="100%"
                            controls={false} // Controlled by Bottom Player
                            onReady={() => { console.log("RightPanelPlayer: onReady"); audioState.handleReady && audioState.handleReady(); }}
                            onStart={() => { console.log("RightPanelPlayer: onStart"); audioState.handleStart && audioState.handleStart(); }}
                            onProgress={audioState.handleProgress}
                            onDuration={audioState.handleDuration}
                            onEnded={audioState.handleEnded}
                            onBuffer={audioState.handleBuffer}
                            onBufferEnd={audioState.handleBufferEnd}
                            onError={audioState.handleError}
                            style={{ background: '#000' }}
                            config={{
                                youtube: {
                                    playerVars: {
                                        autoplay: 1,
                                        controls: 0,
                                        modestbranding: 1,
                                        rel: 0, // No related videos
                                        fs: 0, // No fullscreen button
                                        iv_load_policy: 3, // No annotations
                                        disablekb: 1,
                                        playsinline: 1
                                    }
                                }
                            }}
                        />
                    ) : (
                        <img src={track.cover} alt={track.title} className="large-cover" />
                    )}
                </div>

                {/* Track Info */}
                <div className="panel-track-info">
                    <div className="info-text">
                        <h2 className="panel-title">{track.title}</h2>
                        <span className="panel-artist">{track.artist}</span>
                    </div>
                    <button onClick={() => toggleLike(track)} className="like-btn-large">
                        {isLiked(track) ? <FaHeart color="#ffbe0b" /> : <FaRegHeart />}
                    </button>
                </div>

                {/* About Artist Section */}
                <div className="about-artist-card">
                    <h4>About the artist</h4>
                    <div className="artist-img-wrapper">
                        <img src={track.cover} alt="Artist" className="artist-bg" />
                        <div className="artist-overlay">
                            <span className="artist-name-large">{track.artist}</span>
                        </div>
                    </div>
                    <p className="artist-desc">
                        {track.title}
                    </p>
                </div>

                {/* Credits */}
                <div className="panel-section">
                    <h4>Credits</h4>
                    <div className="credit-row">
                        <span>Performed by</span>
                        <span className="white">{track.artist}</span>
                    </div>
                </div>

                {/* PLAYLIST ADD */}
                <div className="panel-section">
                    <h4>Add to Playlist</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <button onClick={() => addToPlaylist(track.id)} style={{ padding: '6px 12px', borderRadius: 16, border: '1px solid #444', background: 'transparent', color: 'white', cursor: 'pointer' }}>
                            + New Playlist
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
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
                .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: white;
                }
                .header-actions {
                    display: flex;
                    gap: 12px;
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
                .icon-btn:hover, .close-btn:hover { color: white; }
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
                .large-cover {
                    width: 100%;
                    height: 100%;
                    object-fit: contain; 
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
                .like-btn-large {
                    background: transparent;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #b3b3b3;
                }
                .like-btn-large:hover { color: white; transform: scale(1.1); }
                .about-artist-card {
                    background: #242424;
                    border-radius: 8px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .about-artist-card h4 {
                    padding: 16px;
                    margin: 0;
                    font-size: 16px;
                    color: white;
                }
                .artist-img-wrapper {
                    height: 200px;
                    position: relative;
                }
                .artist-bg {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.8;
                }
                .artist-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 12px 16px;
                    background: linear-gradient(transparent, rgba(0,0,0,0.8));
                }
                .artist-name-large {
                    font-size: 24px;
                    font-weight: 700;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
                .artist-desc {
                    padding: 16px;
                    color: #b3b3b3;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                }
                .panel-section h4 {
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: white;
                }
                .credit-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    color: #b3b3b3;
                    margin-bottom: 8px;
                }
                .white { color: white; }
            `}</style>
        </div >
    );
}
