import React, { useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaVolumeUp, FaVolumeMute, FaListUl, FaHeart, FaRegHeart, FaShareAlt, FaTimes } from 'react-icons/fa';
import { MdLyrics } from 'react-icons/md';

export function Player({
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seek,
    volume,
    changeVolume,
    toggleLike,
    isLiked,
    isLoadingNext,
    isBuffering,
    playNext,
    playPrevious,
    onExpand // New prop to Expand
}) {

    const progressRef = useRef(null);
    const volumeRef = useRef(null);
    const [isMuted, setIsMuted] = React.useState(false);

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const handleSeekClick = (e) => {
        if (!progressRef.current || !duration) return;
        const width = progressRef.current.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const newTime = (clickX / width) * duration;
        seek(newTime);
    };

    const handleVolumeClick = (e) => {
        if (!volumeRef.current) return;
        const width = volumeRef.current.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        let newVol = clickX / width;
        if (newVol < 0) newVol = 0;
        if (newVol > 1) newVol = 1;
        changeVolume(newVol);
        if (newVol > 0) setIsMuted(false);
    };

    const toggleMute = () => {
        if (isMuted) {
            changeVolume(0.5); // Restore to some level
            setIsMuted(false);
        } else {
            changeVolume(0);
            setIsMuted(true);
        }
    };

    const [showLyrics, setShowLyrics] = React.useState(false);
    const [lyricsText, setLyricsText] = React.useState("");
    const [lyricsLoading, setLyricsLoading] = React.useState(false);

    React.useEffect(() => {
        if (showLyrics && currentTrack?.title && currentTrack?.artist) {
            setLyricsLoading(true);
            setLyricsText(""); // Reset

            // Abort controller to cancel previous requests
            const controller = new AbortController();
            const signal = controller.signal;

            const fetchLyrics = async () => {
                try {
                    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
                    const res = await fetch(`${BACKEND_URL}/lyrics?title=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(currentTrack.artist)}`, { signal });
                    if (!res.ok) throw new Error("Fetch failed");
                    const data = await res.json();
                    if (!signal.aborted) {
                        setLyricsText(data.lyrics);
                        setLyricsLoading(false);
                    }
                } catch (e) {
                    if (!signal.aborted) {
                        console.error("Lyrics fetch error", e);
                        setLyricsText("Could not load lyrics.");
                        setLyricsLoading(false);
                    }
                }
            };

            fetchLyrics();

            return () => controller.abort();
        } else if (showLyrics && !currentTrack) {
            setLyricsText("Play a track to see lyrics.");
        }
    }, [showLyrics, currentTrack]);

    const handleShare = () => {
        if (!currentTrack) return;
        const textToShare = `Check out "${currentTrack.title}" by ${currentTrack.artist} on SUROOR!`;
        navigator.clipboard.writeText(textToShare).then(() => {
            alert("Link copied to clipboard!");
        });
    };

    return (
        <div className="player-bar">
            {/* LEFT: Track Info (Click to Expand) */}
            <div className="player-left" onClick={onExpand} style={{ cursor: 'pointer' }}>
                <img
                    src={currentTrack?.cover || "https://dummyimage.com/60x60/333/fff&text=Music"}
                    alt=""
                    className="current-art"
                    style={{ opacity: isLoadingNext ? 0.5 : 1, transition: 'opacity 0.3s' }}
                />
                <div className="track-info">
                    <div className="track-name">{currentTrack?.title || "No Track Playing"}</div>
                    <div className="artist-name">{currentTrack?.artist || "Select a song"}</div>
                </div>
                <button className="control-btn" onClick={(e) => { e.stopPropagation(); if (toggleLike && currentTrack) toggleLike(currentTrack); }}>
                    {isLiked && currentTrack && isLiked(currentTrack) ? <FaHeart color="#ffbe0b" /> : <FaRegHeart />}
                </button>
            </div>

            {/* CENTER: Controls */}
            <div className="player-center">
                <div className="player-controls">
                    <button className="control-btn" onClick={() => console.log('shuffle')}>
                        <FaRandom size={16} />
                    </button>
                    <button className="control-btn" onClick={playPrevious}>
                        <FaStepBackward size={18} />
                    </button>
                    <button className="play-pause-btn" onClick={togglePlay}>
                        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} style={{ marginLeft: 2 }} />}
                    </button>
                    <button className="control-btn" onClick={playNext}>
                        <FaStepForward size={18} />
                    </button>
                    <button className="control-btn" onClick={() => console.log('loop')}>
                        <FaRedo size={16} />
                    </button>
                </div>

                <div className="progress-container">
                    <span>{formatTime(currentTime)}</span>
                    <div
                        className="progress-bar"
                        ref={progressRef}
                        onClick={handleSeekClick}
                    >
                        <div
                            className="progress-fill"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* RIGHT: Volume & Extras */}
            <div className="player-right">
                <button className={`control-btn ${showLyrics ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); if (currentTrack) setShowLyrics(!showLyrics); }} title="Lyrics">
                    <MdLyrics style={{ color: showLyrics ? '#ffbe0b' : 'white' }} /> Lyrics
                </button>
                <button className="share-btn" onClick={handleShare}>
                    <FaShareAlt size={14} />
                    Share
                </button>

                <FaListUl size={18} className="control-btn" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="volume-container">
                    <button className="control-btn" onClick={toggleMute}>
                        {volume === 0 || isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                    </button>
                    <div
                        className="volume-bar"
                        ref={volumeRef}
                        onClick={handleVolumeClick}
                        style={{ width: 100 }}
                    >
                        <div
                            className="volume-fill"
                            style={{ width: `${(volume || 0) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            {(isLoadingNext || isBuffering) && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '4px 12px', borderRadius: 12, fontSize: 12, color: '#ffbe0b' }}>Loading... (DEBUG)</div>}
            {!isLoadingNext && !isBuffering && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', opacity: 0.3, fontSize: 10, color: '#fff' }}>DEBUG</div>}

            {/* Simple Lyrics Overlay */}
            {/* Simple Lyrics Overlay */}
            {showLyrics && (
                <div className="lyrics-overlay" style={{ bottom: 100, right: 20, width: 350, maxHeight: 500, borderRadius: 12 }}>
                    <h3 style={{ color: 'white', marginBottom: 12, textAlign: 'center' }}>Lyrics</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#ddd', fontSize: 14, textAlign: 'center' }}>
                        {lyricsLoading ? <div style={{ textAlign: 'center' }}>Loading...</div> : (lyricsText || "Lyrics not found.")}
                    </div>
                    <button onClick={() => setShowLyrics(false)} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>
            )}
        </div>
    );
}
