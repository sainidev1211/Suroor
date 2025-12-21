import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { Player } from './components/Player';
import { RightPanelPlayer } from './components/RightPanelPlayer';
import { useLibrary } from './hooks/useLibrary';
import './index.css';

function App() {
  const [view, setView] = useState('music');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  // NEW STATE: Simple Song & Player
  const [currentSong, setCurrentSong] = useState(null);
  const [player, setPlayer] = useState(null);

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

      {/* ALWAYS RENDER RIGHT PANEL IF SONG EXISTS */}
      <div style={{ display: currentSong ? 'block' : 'none', height: '100%', position: 'absolute', right: 0, top: 0, zIndex: 50 }}>
        <RightPanelPlayer
          track={currentSong}
          onClose={() => setIsRightPanelOpen(false)}
          setPlayer={setPlayer}
          onVideoReady={() => {
            // We could hide loader here if we had a precise event. 
            // For now, we rely on the visual overlay fading or App state.
          }}
        />
      </div>

      {/* BOTTOM PLAYER - ALWAYS VISIBLE IF SONG EXISTS */}
      <div style={{ display: currentSong ? 'block' : 'none' }}>
        <Player
          player={player}
          currentTrack={currentSong}
        />
      </div>
    </div>
  );
}

export default App;
