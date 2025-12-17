import { useState, useEffect, useRef } from 'react';

export function useAudio() {
    // We now control a ReactPlayer instance via state
    const playerRef = useRef(null); // Ref forwarded to ReactPlayer in App.jsx


    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

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

        if (newQueue) {
            setQueue(newQueue);
            const idx = newQueue.findIndex(t => t.id === track.id);
            setCurrentIndex(idx !== -1 ? idx : 0);
        } else {
            setQueue([track]);
            setCurrentIndex(0);
        }

        // Just set the track, ReactPlayer will pick up the URL change and auto-play
        setCurrentTrack(track);
        setIsPlaying(true);
        setDuration(track.durationSec || 0);
    };

    const playIndex = (index) => {
        const q = queueRef.current;
        if (index >= 0 && index < q.length) {
            setCurrentIndex(index);
            setPrefetched(false);
            setIsBuffering(true);
            setCurrentTrack(q[index]);
            setIsPlaying(true);
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

    const onBuffer = () => setIsBuffering(true);
    const onBufferEnd = () => setIsBuffering(false);

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
        handleBuffer: onBuffer,
        handleBufferEnd: onBufferEnd
    };
}
const [isPlaying, setIsPlaying] = useState(false);
const [currentTrack, setCurrentTrack] = useState(null);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(1);
const [seekOffset, setSeekOffset] = useState(0);

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

// Initialize Events
useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
        const cTime = audio.currentTime + seekOffset;
        setCurrentTime(cTime);

        // Prefetch Logic: Trigger 15s before end if not already prefetched
        const q = queueRef.current;
        const idx = currentIndexRef.current;

        if (audio.duration > 0 && audio.duration - cTime < 15 && !prefetched && idx === q.length - 1) {
            if (onApproachingEndRef.current) {
                console.log("Approaching end, triggering prefetch...");
                setPrefetched(true);
                onApproachingEndRef.current(currentTrack);
            }
        }
    };
    const updateDuration = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
        }
    };

    const onEnded = () => {
        const q = queueRef.current;
        const idx = currentIndexRef.current;
        console.log("Audio Ended. Index:", idx, "QueueLen:", q.length);

        setIsPlaying(false);

        // Auto-Play Logic
        if (idx < q.length - 1) {
            console.log("Playing next in queue");
            playIndex(idx + 1);
        } else if (onQueueEndRef.current) {
            console.log("Queue ended, triggering callback (Fallback)");
            onQueueEndRef.current(currentTrack);
        } else {
            console.log("Queue ended, no callback");
        }
    };

    const onWaiting = () => {
        console.log("Audio Buffering...");
        setIsBuffering(true);
    };

    const onPlaying = () => {
        console.log("Audio Playing...");
        setIsBuffering(false);
        setIsPlaying(true);
    };

    const onError = (e) => {
        console.error("Audio Error:", e);
        setIsBuffering(false);
        setIsPlaying(false);
    };

    // 'canplay' fires when there is enough data to start
    const onCanPlay = () => {
        console.log("Audio Can Play");
        if (audio.paused && isPlaying) { // If implementation thinks we should be playing
            audio.play().catch(e => console.error("Resume play failed", e));
        }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('waiting', onWaiting);
        audio.removeEventListener('playing', onPlaying);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('canplay', onCanPlay);
    };
}, [seekOffset, currentTrack, prefetched]);

// Helper to clear HLS
const destroyHls = () => {
    if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
    }
};

const playInternal = async (track) => {
    console.log("useAudio: playInternal called for", track?.title);
    const audio = audioRef.current;
    setCurrentTrack(track);

    // Reset
    destroyHls();
    setIsBuffering(true);
    setIsPlaying(false); // Validating state...

    if (track.durationSec) {
        setDuration(track.durationSec);
    }

    // VIDEO TRACK HANDLING (NEWS)
    if (track.isVideo) {
        audio.pause();
        audio.src = "";
        setIsPlaying(true);
        setIsBuffering(false);
        return;
    } else {
        audio.muted = false;
    }

    try {
        // 1. RESOLVE STREAM URL
        // We need the ACTUAL URL to detect if it is HLS (.m3u8) or not.
        // Current source is like: http://localhost:3001/stream?query=...
        // We append &json=true to get the real URL
        let streamUrl = track.source;

        // If the source is our backend API, fetch the real URL first
        if (track.source.includes("/stream?")) {
            const res = await fetch(`${track.source}&json=true`);
            const data = await res.json();
            if (data.url) streamUrl = data.url;
        }

        console.log("Resolved Stream URL:", streamUrl);

        // 2. CHECK HLS SUPPORT
        if (Hls.isSupported() && streamUrl.includes('.m3u8')) {
            console.log("HLS detected, initializing hls.js...");
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(audio);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS Manifest Parsed, playing...");
                audio.play().catch(e => console.error("HLS play failed", e));
                setIsPlaying(true);
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("fatal network error encountered, try to recover");
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("fatal media error encountered, try to recover");
                            hls.recoverMediaError();
                            break;
                        default:
                            destroyHls();
                            break;
                    }
                }
            });

        } else if (audio.canPlayType('application/vnd.apple.mpegurl') && streamUrl.includes('.m3u8')) {
            // Native HLS (Safari)
            console.log("Native HLS detected");
            audio.src = streamUrl;
            audio.addEventListener('loadedmetadata', function () {
                audio.play();
            });
        } else {
            // Standard Playback (MP3/MP4/WebM)
            console.log("Standard playback");
            audio.src = streamUrl;
            await audio.play();
            setIsPlaying(true);
        }
        setIsBuffering(false);

    } catch (e) {
        console.error("Playback failed", e);
        setIsPlaying(false);
        setIsBuffering(false);
    }
};

const playTrack = async (track, newQueue = null) => {
    setSeekOffset(0);
    setPrefetched(false);

    if (newQueue) {
        setQueue(newQueue);
        const idx = newQueue.findIndex(t => t.id === track.id);
        setCurrentIndex(idx !== -1 ? idx : 0);
    } else {
        setQueue([track]);
        setCurrentIndex(0);
    }

    playInternal(track);
};

const playIndex = async (index) => {
    const q = queueRef.current;
    if (index >= 0 && index < q.length) {
        setCurrentIndex(index);
        setPrefetched(false);
        setSeekOffset(0);
        playInternal(q[index]);
    }
};

const appendAndPlay = async (track) => {
    const q = queueRef.current;
    const newIndex = q.length;

    setQueue(prev => [...prev, track]);
    setCurrentIndex(newIndex);
    setPrefetched(false);
    setSeekOffset(0);

    playInternal(track);
};

const addToQueue = (tracks) => {
    setQueue(prev => [...prev, ...tracks]);
};

const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
    } else {
        audio.play().catch(e => console.error(e));
        setIsPlaying(true);
    }
};

const seek = (time) => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.currentTime = time;
    if (audio.paused) {
        audio.play().catch(e => console.error("Play after seek failed", e));
    }
};

const changeVolume = (vol) => {
    const audio = audioRef.current;
    audio.volume = vol;
    setVolume(vol);
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

const playPrevious = () => {
    if (currentIndex > 0) {
        playIndex(currentIndex - 1);
    }
};

return {
    audioRef,
    currentTrack,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    queue,
    playTrack,
    playIndex,
    playNext,
    playPrevious,
    appendAndPlay,
    addToQueue,
    setOnQueueEnd: (cb) => { onQueueEndRef.current = cb; },
    setOnApproachingEnd: (cb) => { onApproachingEndRef.current = cb; },
    togglePlay,
    seek,
    changeVolume,
    setIsPlaying // Exposure for FullScreenPlayer to force state if needed
};
}
