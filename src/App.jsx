import React, { useState } from 'react';
import axios from 'axios';
import { Sidebar } from './components/Sidebar';
import { MainView } from './components/MainView';
import { Player } from './components/Player';
import { useAudio } from './hooks/useAudio';
import { useLibrary } from './hooks/useLibrary';
import './index.css';

import { FullScreenPlayer } from './components/FullScreenPlayer';
import { RightPanelPlayer } from './components/RightPanelPlayer';

import ReactPlayer from 'react-player';

function App() {
  // Check URL for admin access (e.g., /?admin=true)
  const initialView = new URLSearchParams(window.location.search).get('admin') ? 'admin' : 'music';
  const [view, setView] = useState(initialView);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true); // Default open

  const audio = useAudio();
  const library = useLibrary();

  const [isLoadingNext, setIsLoadingNext] = useState(false);

  // Reusable Fetch Logic
  const fetchRecommendation = async (lastTrack) => {
    console.log("Fetching AI recommendation for:", lastTrack.artist);
    try {
      // Fetch "Mix [Artist]" to get similar vibe
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await axios.get(`${BACKEND_URL}/search?query=Mix ${lastTrack.artist} official audio`);
      const candidates = res.data;

      // Pick one that isn't the last track
      const nextUp = candidates.find(t => t.id !== lastTrack.id) || candidates[0];

      if (nextUp) {
        return nextUp; // Return direct track object, ReactPlayer handles the ID
      }
    } catch (e) {
      console.error("AI Fetch failed", e);
    }
    return null;
  };

  // AI Auto-Play Logic
  React.useEffect(() => {
    // 1. Prefetch Handler (Triggered 15s before end)
    audio.setOnApproachingEnd(async (currentTrack) => {
      if (!currentTrack) return;
      const nextTrack = await fetchRecommendation(currentTrack);
      if (nextTrack) {
        console.log("Prefetched track:", nextTrack.title);
        audio.addToQueue([nextTrack]);
      }
    });

    // 2. Queue End Fallback (Triggered if prefetch failed or user skipped to end)
    audio.setOnQueueEnd(async (lastTrack) => {
      if (!lastTrack) return;
      setIsLoadingNext(true); // Show UI because we are now stalled

      const nextTrack = await fetchRecommendation(lastTrack);

      if (nextTrack) {
        console.log("Fallback Auto-Playing:", nextTrack.title);
        // Use appendAndPlay to preserve queue history and play immediately
        audio.appendAndPlay(nextTrack);
      }
      setIsLoadingNext(false);
    });
  }, []);

  // Auto-Expand for Video Tracks (News)
  React.useEffect(() => {
    if (audio.currentTrack?.isVideo) {
      setIsPlayerExpanded(true);
    }
    // Auto-Open Right Panel for any track
    if (audio.currentTrack) {
      setIsRightPanelOpen(true);
    }
  }, [audio.currentTrack]);

  return (
    <div className="app-container">
      {/* 
         HIDDEN AUDIO ENGINE 
         We use ReactPlayer to stream YouTube audio directly on frontend.
         This is 10x faster than backend streaming and removes sync issues.
         For Video tracks (News), we mute/hide this and let FullScreenPlayer handle it.
         For Audio tracks, this plays the audio.
      */}
      {/* Hidden Audio Engine Removed - Moved to RightPanelPlayer */}

      {/* Expose setVolume needed for ReactPlayer above? 
          We use audio.volume in the hook.
      */}

      <Sidebar
        setView={setView}
      />

      {/* Pass view prop to MainView to detect news mode */}
      <MainView
        setView={setView}
        view={view}
        onPlay={(track) => {
          console.log("App: onPlay triggered for", track?.title);
          audio.playTrack(track, null);
        }}
        currentTrack={audio.currentTrack}
        likedSongs={library.likedSongs}
        user={library.user}
        onLogin={library.login}
        onSignup={library.signup}
        toggleLike={library.toggleLike}
        isLiked={library.isLiked}
      />

      {/* 
         CENTRALIZED MEDIA PLAYER (In Right Panel)
         We pass the `audio` object to RightPanelPlayer so it renders the real ReactPlayer.
         We keep RightPanelPlayer MOUNTED even if closed, so audio keeps playing.
         We use `display: none` when closed.
      */}
      <div style={{ display: isRightPanelOpen || (audio.currentTrack && audio.isPlaying) ? 'block' : 'none', height: '100%', position: 'absolute', right: 0, top: 0, zIndex: 50 }}>
        <RightPanelPlayer
          track={audio.currentTrack}
          onClose={() => setIsRightPanelOpen(false)}
          isOpen={isRightPanelOpen}
          toggleLike={library.toggleLike}
          isLiked={library.isLiked}
          isPlaying={audio.isPlaying}
          currentTime={audio.currentTime}
          addToPlaylist={library.addToPlaylist}
          playlists={library.playlists}
          createPlaylist={library.createPlaylist}
          audioState={audio} // PASS FULL AUDIO STATE
        />
      </div>

      {/* Bottom Player: Hide if News is playing */}
      <div style={{ display: audio.currentTrack?.isVideo ? 'none' : 'block' }}>
        <Player
          {...audio}
          toggleLike={library.toggleLike}
          isLiked={library.isLiked}
          isLoadingNext={isLoadingNext}
          onExpand={() => setIsPlayerExpanded(true)}
        />
      </div>

      {isPlayerExpanded && (
        <FullScreenPlayer
          track={audio.currentTrack}
          onClose={() => setIsPlayerExpanded(false)}
          isPlaying={audio.isPlaying}
          togglePlay={() => audio.setIsPlaying(!audio.isPlaying)}
          playNext={audio.playNext}
          playPrev={audio.playPrev}
          toggleLike={library.toggleLike}
          isLiked={library.isLiked}
          onPlay={audio.playTrack}
        />
      )}
    </div>
  );
}

export default App;
