import { useEffect, useRef } from "react";

export default function YouTubePlayer({ videoId, onPlayerReady, autoPlay, onStateChange }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!videoId || !iframeRef.current) return;

        // 1. Define Player Interface
        const player = {
            play() {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), "*");
                }
            },
            pause() {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), "*");
                }
            },
            seekTo(seconds) {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }), "*");
                }
            },
            setVolume(vol) {
                if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }), "*");
                }
            },
            getDuration() { return 0; }
        };

        // 2. Expose Player immediately
        if (onPlayerReady) {
            onPlayerReady(player);
        }

        // 3. Autoplay Logic (Trigger once on mount if autoPlay is authorized)
        if (autoPlay) {
            // Slight delay to ensure connection
            setTimeout(() => {
                console.log("YouTubePlayer: Auto-playing...");
                player.play();
            }, 1000);
        }

        // 4. Listen for State Changes (from Iframe)
        const handleMessage = (event) => {
            // Filter YouTube messages
            if (typeof event.data === 'string') {
                try {
                    const data = JSON.parse(event.data);

                    // State Change Event
                    if (data.event === 'infoDelivery' && data.info && data.info.playerState !== undefined) {
                        const state = data.info.playerState;
                        // -1: Unstarted, 0: Ended, 1: Playing, 2: Paused, 3: Buffering, 5: Video Cued
                        if (onStateChange) onStateChange(state);
                    }
                } catch (e) {
                    // Ignore non-JSON messages
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);

    }, [videoId, onPlayerReady, autoPlay]); // Re-run if videoId or autoPlay status changes

    if (!videoId) return null;

    return (
        <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&rel=0&modestbranding=1&iv_load_policy=3&controls=0&disablekb=1&fs=0`}
            title="YouTube Player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
        />
    );
}
