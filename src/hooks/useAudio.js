import { useState, useEffect, useRef } from 'react';

export function useAudio() {
    // We now control a ReactPlayer instance via state
    const playerRef = useRef(null); // Ref forwarded to ReactPlayer in App.jsx


    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Queue System
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [prefetched, setPrefetched] = useState(false);

    // Refs for stable access in callbacks
    const queueRef = useRef(queue);
    const currentIndexRef = useRef(currentIndex);

    // Loading/Buffering State
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {
        queueRef.current = queue;
        currentIndexRef.current = currentIndex;
    }, [queue, currentIndex]);

    // External Callback for AI Fetch
    const onQueueEndRef = useRef(null);
    const onApproachingEndRef = useRef(null);

    // --- Actions ---

    const playTrack = async (track, newQueue = null) => {
        console.log("[useAudio] playTrack called for:", track.title);
        setPrefetched(false);
        setIsBuffering(true); // Assume buffering

        // DIRECT YOUTUBE PLAYBACK
        const directUrl = `https://www.youtube.com/watch?v=${track.id}`;
        console.log("[useAudio] Stream URL:", directUrl);

        const tempTrack = { ...track, streamUrl: directUrl };
        setCurrentTrack(tempTrack);
        setIsPlaying(true); // Trigger ReactPlayer

        // Check Ref immediately and after delay
        console.log("[useAudio] playerRef immediately:", playerRef.current);
        setTimeout(() => {
            console.log("[useAudio] playerRef after 1s:", playerRef.current);
            if (playerRef.current && playerRef.current.getInternalPlayer()) {
                console.log("[useAudio] Internal Player found. Attempting force play.");
                // playerRef.current.getInternalPlayer().playVideo(); // ReactPlayer manages this via 'playing' prop usually
            } else {
                console.warn("[useAudio] Player Ref is NULL or Internal Player missing!");
            }
        }, 1000);

        if (newQueue) {
            setQueue(newQueue);
            const idx = newQueue.findIndex(t => t.id === track.id);
            setCurrentIndex(idx !== -1 ? idx : 0);
        } else {
            setQueue([track]);
            setCurrentIndex(0);
        }

        setDuration(track.durationSec || 0);
    };

    const playIndex = async (index) => {
        const q = queueRef.current;
        if (index >= 0 && index < q.length) {
            setCurrentIndex(index);
            // Reuse playTrack logic for the specific track
            await playTrack(q[index], null); // Pass null queue to preserve current queue
        }
    };

    const playNext = () => {
        const q = queueRef.current;
        if (currentIndex < q.length - 1) {
            playIndex(currentIndex + 1);
        } else {
            console.log("End of queue");
            if (onQueueEndRef.current && currentTrack) {
                onQueueEndRef.current(currentTrack);
            }
        }
    };

    const playPrev = () => {
        if (currentIndex > 0) {
            playIndex(currentIndex - 1);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const seek = (time) => {
        if (playerRef.current) {
            playerRef.current.seekTo(time);
            setCurrentTime(time); // Instant feedback
        }
    };

    const changeVolume = (vol) => {
        setVolume(vol);
    };

    const appendAndPlay = (track) => {
        const q = queueRef.current;
        setQueue([...q, track]);
        setCurrentIndex(q.length);
        setIsBuffering(true);
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    // --- ReactPlayer Callbacks (Called from App.jsx) ---
    const onProgress = (state) => {
        if (isBuffering) setIsBuffering(false); // Failsafe: if playing, not buffering
        setCurrentTime(state.playedSeconds);
        // Prefetch Logic
        const remaining = duration - state.playedSeconds;
        if (remaining < 15 && remaining > 0 && !prefetched) {
            const q = queueRef.current;
            const idx = currentIndexRef.current;
            if (idx === q.length - 1 && onApproachingEndRef.current) {
                console.log("Approaching end, triggering prefetch...");
                setPrefetched(true);
                onApproachingEndRef.current(currentTrack);
            }
        }
    };

    const onDuration = (d) => {
        setDuration(d);
    };

    const onEnded = () => {
        const q = queueRef.current;
        const idx = currentIndexRef.current;
        console.log("Track Ended via ReactPlayer");

        if (idx < q.length - 1) {
            playIndex(idx + 1);
        } else if (onQueueEndRef.current) {
            onQueueEndRef.current(currentTrack);
        }
    };

    const handleBuffer = () => setIsBuffering(true);
    const handleBufferEnd = () => setIsBuffering(false);
    const handleReady = () => {
        console.log("Player Ready");
        setIsBuffering(false);
    };
    const handleStart = () => {
        console.log("Player Started");
        setIsBuffering(false);
        setIsPlaying(true);
    };

    const handleError = (e) => {
        console.error("[useAudio] PLAYER ERROR:", e);
        setIsBuffering(false);
        setIsPlaying(false);
        // Optional: Auto-skip or retry logic could go here
    };

    return {
        playerRef, // EXPOSED REF
        currentTrack,
        isPlaying,
        setIsPlaying, // Exposed for external control
        isBuffering,
        currentTime,
        duration,
        volume,
        queue,
        playTrack,
        playIndex,
        playNext,
        playPrev, // Was 'playPrevious' in old code? Checking usage... 'playPrev' used in FullScreenPlayer params.
        playPrevious: playPrev, // Alias for compatibility if needed
        appendAndPlay,
        addToQueue: (tracks) => setQueue(prev => [...prev, ...tracks]),
        setOnQueueEnd: (cb) => { onQueueEndRef.current = cb; },
        setOnApproachingEnd: (cb) => { onApproachingEndRef.current = cb; },
        togglePlay,
        seek,
        changeVolume,
        // Handlers for App.jsx
        handleProgress: onProgress,
        handleDuration: onDuration,
        handleEnded: onEnded,
        handleBuffer: handleBuffer,
        handleBufferEnd: handleBufferEnd,
        handleReady,
        handleStart,
        handleError // EXPORTED
    };
}
