import React from 'react';

export default function PremiumLoader({ song, artist }) {
    return (
        <div className="premium-loader">
            <div className="loader-content">
                <div className="pulse-circle"></div>
                <h2 className="loader-title">Preparing your vibe 🎧</h2>
                {song && <p className="loader-song">{song}</p>}
                {artist && <p className="loader-artist">{artist}</p>}
            </div>

            <style>{`
        .premium-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          color: white;
          text-align: center;
        }
        .pulse-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #1db954;
          margin: 0 auto 24px auto;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(29, 185, 84, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(29, 185, 84, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(29, 185, 84, 0); }
        }
        .loader-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .loader-song {
          font-size: 16px;
          color: #fff;
          margin: 4px 0;
        }
        .loader-artist {
          font-size: 14px;
          color: #b3b3b3;
          margin: 0;
        }
      `}</style>
        </div>
    );
}
