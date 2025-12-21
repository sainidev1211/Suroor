import { useEffect, useRef } from "react";

export default function YouTubePlayer({ videoId, onPlayerReady }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!videoId || !iframeRef.current) return;

        const player = {
            play() {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), "*");
                }
            },
            pause() {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), "*");
                }
            },
            seekTo(seconds) {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }), "*");
                }
            },
            setVolume(vol) {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [vol] }), "*");
                }
            },
            getDuration() {
                return 0;
            }
        };

        if (onPlayerReady) {
            console.log("YouTubePlayer: Player Ready Object Created");
            onPlayerReady(player);
        }
    }, [videoId, onPlayerReady]);

    if (!videoId) return null;

    return (
        <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&rel=0&modestbranding=1&iv_load_policy=3`}
            title="YouTube Player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
        />
    );
}
