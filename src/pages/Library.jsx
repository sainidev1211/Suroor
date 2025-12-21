import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaPlay } from 'react-icons/fa';

export const Library = ({ onPlay }) => {
    const { user, library } = useAuth();

    if (!user) {
        return (
            <div className="main-view" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <h2>Library Locked</h2>
                <p style={{ color: '#b3b3b3' }}>Please sign in to access your collection.</p>
            </div>
        );
    }

    return (
        <div className="main-view">
            <div className="view-header">
                <h1>My Library</h1>
            </div>

            <section className="track-section">
                <h3>Liked Songs</h3>
                <div className="songs-list">
                    {library.likedSongs.length === 0 ? (
                        <div style={{ color: '#b3b3b3', fontStyle: 'italic' }}>No liked songs yet. Go explore!</div>
                    ) : (
                        library.likedSongs.map((track, i) => (
                            <div key={track.id} className="song-row" onClick={() => onPlay(track)}>
                                <span className="song-number">{i + 1}</span>
                                <img src={track.cover} alt="" className="song-row-img" />
                                <div className="song-row-info">
                                    <div className="song-row-title">{track.title}</div>
                                    <div className="song-row-artist">{track.artist}</div>
                                </div>
                                <span className="song-duration">3:45</span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};
