import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { Player } from './components/Player';
import { RightPanelPlayer } from './components/RightPanelPlayer';
import PremiumLoader from './components/PremiumLoader';
import { useLibrary } from './hooks/useLibrary';
import './index.css';

function App() {
  const [view, setView] = useState('music');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // NEW STATE: Simple Song & Player
  const [currentSong, setCurrentSong] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  React.useEffect(() => {
    // Simulate System Boot
    setTimeout(() => setIsSystemReady(true), 2000);

    // Detect First User Interaction
    const unlockAutoplay = () => {
      if (!hasUserInteracted) {
        console.log("App: User Interaction Detected. Autoplay Unlocked.");
        setHasUserInteracted(true);
      }
    };
    window.addEventListener('click', unlockAutoplay);
    window.addEventListener('keydown', unlockAutoplay);
    return () => {
      window.removeEventListener('click', unlockAutoplay);
      window.removeEventListener('keydown', unlockAutoplay);
    };
  }, [hasUserInteracted]);

  const library = useLibrary();

  const handlePlay = (track) => {
    console.log("App: Play Request", track);
    // Ensure we have an ID for YouTube
    // If the track object from MainView has 'id' (youtube ID), use it.
    setCurrentSong({
      ...track,
      youtubeId: track.id // Assuming track.id IS the video ID
    });
    setIsRightPanelOpen(true);
  };

  return (
    <div className="app-container">
      {!isSystemReady && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, background: 'black' }}>
          <PremiumLoader song="Welcome to Suroor" artist="Loading System..." />
        </div>
      )}

      <Sidebar setView={setView} />

      <MainView
        setView={setView}
        view={view}
        onPlay={handlePlay}
        currentTrack={currentSong}
        likedSongs={library.likedSongs}
        user={library.user}
        onLogin={library.login}
        onSignup={library.signup}
        toggleLike={library.toggleLike}
        isLiked={library.isLiked}
      />

      {/* ALWAYS RENDER RIGHT PANEL IF SONG EXISTS (Hide on Mobile) */}
      <div className="right-panel-container" style={{ display: currentSong ? 'block' : 'none' }}>
        <RightPanelPlayer
          track={currentSong}
          onClose={() => setIsRightPanelOpen(false)}
          setPlayer={setPlayer}
          autoPlay={hasUserInteracted}
          onVideoReady={() => { }}
        />
      </div>

      {/* BOTTOM PLAYER - ALWAYS VISIBLE */}
      <div style={{ display: 'block' }}>
        <Player
          player={player}
          currentTrack={currentSong}
        />
      </div>

      <style>{`
        .right-panel-container {
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 50;
        }
        @media (max-width: 1024px) {
            .right-panel-container {
                display: none !important;
            }
        }
      `}</style>
    </div>
  );
}

export default App;
