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
        setPrefetched(false);
        setIsBuffering(true); // Assume buffering on track switch

        // DIRECT YOUTUBE PLAYBACK - NO PROXY
        const directUrl = `https://www.youtube.com/watch?v=${track.id}`;

        const tempTrack = { ...track, streamUrl: directUrl };
        setCurrentTrack(tempTrack);
        setIsPlaying(true); // Show player immediately

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

    const handleError = (e) => {
        console.error("Audio Error:", e);
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
        handleError // EXPORTED
    };
}
