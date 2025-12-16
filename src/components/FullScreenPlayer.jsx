import React, { useState } from 'react';
import { FaChevronDown, FaPlay, FaPause, FaStepForward, FaStepBackward, FaHeart, FaRegHeart } from 'react-icons/fa';

export function FullScreenPlayer({ track, onClose, isPlaying, togglePlay, playNext, playPrev, toggleLike, isLiked }) {
    // Local state to toggle "Audio Mode" (hiding video) for Video Tracks (News)
    const [viewAsAudio, setViewAsAudio] = useState(false);

    if (!track) return null;

    // Effective Mode: If track is NOT video, we usually just see Audio UI.
    // If track IS video, we see Video UI unless 'viewAsAudio' is true.
    const showVideoUI = track.isVideo && !viewAsAudio;

    return (
        <div className="fullscreen-player">
            {/* BACKGROUND LAYER */}
            <div className="fs-bg">
                {/* 1. Motion Background for SONGS (if not isVideo) */}
                {!track.isVideo && (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${track.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${track.id}&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
                        title="bg-motion"
                        style={{ position: 'absolute', top: '50%', left: '50%', width: '300%', height: '300%', transform: 'translate(-50%, -50%)', filter: 'blur(30px) brightness(0.5)', opacity: 0.8, pointerEvents: 'none', border: 'none' }}
                        allow="autoplay; encrypted-media"
                        tabIndex="-1"
                    />
                )}

                {/* 2. Static Fallback */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${track.cover})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'blur(50px) brightness(0.4)', zIndex: -1
                }}></div>
            </div >

            {/* HIDDEN PLAYER FOR NEWS AUDIO MODE (Must play sound if track.isVideo) */}
            {
                track.isVideo && (
                    <div style={showVideoUI ?
                        // Visible State (Main Video)
                        {
                            position: 'relative', width: '90%', maxWidth: 1000, height: '60vh',
                            margin: '0 auto 30px auto', borderRadius: 12, overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 10, background: 'black',
                            flexShrink: 0
                        } :
                        // Hidden State (Audio Only - keep playing in background)
                        // KEY FIX: Make it huge but invisible to prevent browser throttling background tabs/iframes
                        {
                            position: 'fixed', top: 0, left: 0, width: '200%', height: '200%',
                            opacity: 0.001, pointerEvents: 'none', zIndex: -100
                        }
                    }>
                        <iframe
                            width="100%" height="100%"
                            src={`https://www.youtube.com/embed/${track.id}?autoplay=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
                            title="main-video" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )
            }
            <div className="fs-content" style={{ zIndex: 20 }}>
                {/* HEADER */}
                <div className="fs-header">
                    <button onClick={onClose} className="fs-close-btn">
                        <FaChevronDown size={24} />
                    </button>
                    <span>{track.isVideo && !viewAsAudio ? 'WATCHING LIVE' : 'NOW PLAYING'}</span>

                    {/* TOGGLE BUTTON (Only for Video Tracks) */}
                    {track.isVideo && (
                        <button onClick={() => setViewAsAudio(!viewAsAudio)} style={{
                            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                            padding: '6px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 12, fontWeight: 'bold'
                        }}>
                            {viewAsAudio ? 'Switch to Video' : 'Switch to Audio'}
                        </button>
                    )}
                    {!track.isVideo && <div style={{ width: 24 }}></div>}
                </div>

                {/* ART & LYRICS UI (Shown if NOT showing active Video UI) */}
                {(!showVideoUI) && (
                    <>
                        <div className="fs-art-container">
                            <img src={track.cover} alt={track.title} className="fs-art" />
                        </div>

                        <div className="fs-info">
                            <h1>{track.title}</h1>
                            <p>{track.artist}</p>
                        </div>

                        <div className="fs-lyrics">
                            <h3>Lyrics / Info</h3>
                            <p style={{ marginBottom: 20 }}>
                                {track.isVideo ? "Listening to Live Feed" : "We couldn't fetch live captions for this track."}
                            </p>
                            {!track.isVideo && (
                                <button
                                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(track.title + " " + track.artist + " lyrics")}`, '_blank')}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                                        padding: '10px 20px', borderRadius: 20, cursor: 'pointer', fontSize: 14
                                    }}>
                                    Search Lyrics on Google
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* CONTROLS (Always Visible in Audio Mode from UI perspective. 
                   If Video Mode, we hide them as YouTube has controls. 
                   NOTE: If track.isVideo is true (News), useAudio is Paused. 
                   Controls here like "Pause" call togglePlay -> audio.pause(). 
                   BUT audio element is ALREADY paused. 
                   So these controls won't pause the YouTube Iframe.
                   We accept this limitation for News: User must use "Switch to Video" to pause, 
                   or we just hide controls for News tracks even in Audio Mode?
                   Actually, hiding controls for News is safer to avoid confusion.
                   "Like" stays. */}

                <div className="fs-controls">
                    <button className="fs-action-btn" onClick={() => toggleLike && toggleLike(track)}>
                        {isLiked && isLiked(track) ? <FaHeart color="#ffbe0b" size={28} /> : <FaRegHeart size={28} />}
                    </button>

                    {/* Standard Transport only for Non-Video tracks */}
                    {!track.isVideo && (
                        <div className="fs-transport">
                            <button onClick={playPrev}><FaStepBackward size={28} /></button>
                            <button onClick={togglePlay} className="fs-play-btn">
                                {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} style={{ marginLeft: 4 }} />}
                            </button>
                            <button onClick={playNext}><FaStepForward size={28} /></button>
                        </div>
                    )}

                    {/* For News in Audio Mode, we show a dummy "playing" icon or nothing? 
                        Let's show nothing to avoid broken buttons. User controls via toggle -> Video -> Pause. 
                    */}

                    <div style={{ width: 28 }}></div>
                </div>
            </div>

            <style>{`
                .fullscreen-player {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: 2000; overflow: hidden;
                    display: flex; flex-direction: column;
                }
                .fs-bg {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    z-index: -1; overflow: hidden;
                    background: #111;
                }
                .fs-content {
                    height: 100%; display: flex; flex-direction: column; align-items: center;
                    padding: 40px 20px; color: white;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    width: 100%;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .fs-header {
                    width: 100%; display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 20px;
                }
                .fs-close-btn {
                    background: none; border: none; color: white; cursor: pointer;
                }
                .fs-art-container {
                    width: 300px; height: 300px; margin-bottom: 30px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    border-radius: 8px; overflow: hidden;
                }
                .fs-art {
                    width: 100%; height: 100%; object-fit: cover;
                }
                .fs-info {
                    text-align: center; margin-bottom: 30px;
                }
                .fs-info h1 {
                    font-size: 24px; margin: 0 0 8px 0;
                }
                .fs-info p {
                    font-size: 18px; color: rgba(255,255,255,0.7); margin: 0;
                }
                .fs-lyrics {
                    flex: 1; width: 100%; max-width: 400px; overflow-y: auto; text-align: center;
                    margin-bottom: 30px; color: rgba(255,255,255,0.6);
                    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                }
                .fs-controls {
                    width: 100%; max-width: 400px;
                    display: flex; justify-content: space-between; align-items: center;
                    margin-top: auto; padding-bottom: 40px;
                }
                .fs-transport {
                    display: flex; gap: 30px; align-items: center;
                }
                .fs-action-btn {
                    background: none; border: none; color: white; cursor: pointer;
                }
                .fs-play-btn {
                    width: 70px; height: 70px; border-radius: 50%; background: white; color: black;
                    border: none; display: flex; alignItems: center; justifyContent: center; cursor: pointer;
                }
            `}</style>
        </div >
    );
}

