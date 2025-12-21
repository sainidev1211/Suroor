import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { RightPanelPlayer } from './components/RightPanelPlayer';
import PremiumLoader from './components/PremiumLoader';
import { Home } from './pages/Home';
import { Stories } from './pages/Stories';
import { Library } from './pages/Library';
import { useLibrary } from './hooks/useLibrary';
import './index.css';

function AppContent() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // NEW STATE: Simple Song & Player
  const [currentSong, setCurrentSong] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isSongLoading, setIsSongLoading] = useState(false);

  React.useEffect(() => {
    // Simulate System Boot
    setTimeout(() => setIsSystemReady(true), 1500);

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

  // Use old library hook for compatible Home/MainView props for now
  const library = useLibrary();

  const handlePlay = (track) => {
    console.log("App: Play Request", track);
    setIsSongLoading(true);
    setCurrentSong({
      ...track,
      youtubeId: track.id
    });
    setIsRightPanelOpen(true);
  };

  const handlePlayerStateChange = (state) => {
    // 1 = Playing. If playing, stop loading.
    if (state === 1) {
      setIsSongLoading(false);
    }
  };

  return (
    <div className="app-container">
      {!isSystemReady && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, background: 'black' }}>
          <PremiumLoader song="Welcome to Suroor" artist="Loading System..." />
        </div>
      )}

      {isSongLoading && currentSong && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 'calc(100% - 90px)', zIndex: 150, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
          <PremiumLoader song={currentSong.title} artist={currentSong.artist} />
        </div>
      )}

      <Sidebar />

      <div style={{ flex: 1, overflow: 'hidden' }}> {/* Main Content Area */}
        <Routes>
          <Route path="/" element={
            <Home
              onPlay={handlePlay}
              currentTrack={currentSong}
              likedSongs={library.likedSongs}
              user={library.user}
              onLogin={library.login}
              onSignup={library.signup}
              toggleLike={library.toggleLike}
              isLiked={library.isLiked}
            />
          } />
          <Route path="/stories" element={<Stories onPlay={handlePlay} />} />
          <Route path="/library" element={<Library onPlay={handlePlay} />} />
        </Routes>
      </div>

      {/* ALWAYS RENDER RIGHT PANEL IF SONG EXISTS (Hide on Mobile) */}
      <div className="right-panel-container" style={{ display: currentSong ? 'block' : 'none' }}>
        <RightPanelPlayer
          track={currentSong}
          onClose={() => setIsRightPanelOpen(false)}
          setPlayer={setPlayer}
          autoPlay={hasUserInteracted}
          onStateChange={handlePlayerStateChange}
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
