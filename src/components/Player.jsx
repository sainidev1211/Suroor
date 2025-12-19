import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

export function Player({ player, currentTrack }) {
    if (!player) return null;

    return (
        <div className="player-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 20, background: '#181818', borderTop: '1px solid #282828' }}>
            <div className="track-info" style={{ position: 'absolute', left: 20, color: 'white' }}>
                <div className="track-name" style={{ fontWeight: 'bold' }}>{currentTrack?.title || "No Track"}</div>
            </div>

            <button onClick={() => { console.log("Player: Play Clicked"); player.play(); }} style={{ background: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaPlay color="black" />
            </button>
            <button onClick={() => { console.log("Player: Pause Clicked"); player.pause(); }} style={{ background: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaPause color="black" />
            </button>
        </div>
    );
}
