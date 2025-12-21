import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaListUl } from 'react-icons/fa';

export function Player({ player, currentTrack, onNext, onPrev }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(100);
    const [progress, setProgress] = useState(0);

    // Sync Play/Pause state? 
    // Without 2-way binding, we assume button click works.

    // Simulate progress for UI feel if real sync fails
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => setProgress(p => (p + 0.1) % 100), 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!currentTrack) return null;

    return (
        <div className="spotify-player">
            {/* Left: Info */}
            <div className="player-left">
                <img src={currentTrack.cover} alt="" className="player-art" />
                <div className="player-info-text">
                    <div className="player-track-name">{currentTrack.title}</div>
                    <div className="player-artist-name">{currentTrack.artist}</div>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="player-center">
                <div className="player-controls-row">
                    <button className="control-btn" onClick={onPrev}><FaStepBackward /></button>
                    <button className="play-btn-circle" onClick={() => {
                        if (isPlaying) player.pause();
                        else player.play();
                        setIsPlaying(!isPlaying);
                    }}>
                        {isPlaying ? <FaPause color="black" /> : <FaPlay color="black" style={{ marginLeft: 2 }} />}
                    </button>
                    <button className="control-btn" onClick={onNext}><FaStepForward /></button>
                </div>
                <div className="progress-row">
                    <span className="time-text">0:00</span>
                    <input
                        type="range"
                        min="0" max="100"
                        value={progress}
                        onChange={(e) => {
                            const val = e.target.value;
                            setProgress(val);
                            // Estimate seek: Assume 3 min song? 
                            // Real seek needs duration.
                            // player.seekTo(val * duration / 100);
                        }}
                        className="spotify-range"
                    />
                    <span className="time-text">--:--</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div className="player-right">
                <FaListUl className="control-icon" />
                <div className="volume-wrapper">
                    <FaVolumeUp className="control-icon" />
                    <input
                        type="range"
                        min="0" max="100"
                        value={volume}
                        onChange={(e) => {
                            setVolume(e.target.value);
                            player.setVolume(e.target.value);
                        }}
                        className="spotify-range volume-range"
                    />
                </div>
            </div>

            <style>{`
                .spotify-player {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 90px;
                    background: #181818;
                    border-top: 1px solid #282828;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 16px;
                    z-index: 200;
                    color: white;
                }
                .player-left {
                    display: flex;
                    align-items: center;
                    width: 30%;
                    min-width: 180px;
                }
                .player-art {
                    width: 56px;
                    height: 56px;
                    border-radius: 4px;
                    margin-right: 14px;
                    object-fit: cover;
                }
                .player-info-text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .player-track-name {
                    font-size: 14px;
                    color: white;
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                .player-artist-name {
                    font-size: 11px;
                    color: #b3b3b3;
                }
                .player-center {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 40%;
                    max-width: 722px;
                }
                .player-controls-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 8px;
                }
                .control-btn {
                    background: transparent;
                    border: none;
                    color: #b3b3b3;
                    font-size: 16px;
                    cursor: pointer;
                }
                .control-btn:hover { color: white; }
                .play-btn-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .play-btn-circle:hover { transform: scale(1.05); }
                .progress-row {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    gap: 8px;
                }
                .time-text {
                    font-size: 11px;
                    color: #a7a7a7;
                    min-width: 40px;
                    text-align: center;
                }
                .spotify-range {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 4px;
                    background: #4d4d4d;
                    border-radius: 2px;
                    cursor: pointer;
                }
                .spotify-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    display: none; 
                }
                .spotify-range:hover::-webkit-slider-thumb {
                    display: block;
                }
                .spotify-range:hover {
                    background: #1db954; 
                }
                .player-right {
                    width: 30%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 12px;
                }
                .volume-wrapper {
                    display: flex;
                    align-items: center;
                    width: 120px;
                    gap: 8px;
                }
                .volume-range {
                    width: 80px;
                }
                .control-icon {
                    color: #b3b3b3;
                    font-size: 16px;
                }
            `}</style>
        </div>
    );
}
