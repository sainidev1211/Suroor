import { useEffect, useRef } from "react";

export default function YouTubePlayer({ videoId, onPlayerReady }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!videoId || !iframeRef.current) return;

        const player = {
            play() {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    console.log("YouTubePlayer: Sending play command");
                    iframeRef.current.contentWindow.postMessage(
                        '{"event":"command","func":"playVideo","args":""}',
                        "*"
                    );
                }
            },
            pause() {
                if (iframeRef.current && iframeRef.current.contentWindow) {
                    console.log("YouTubePlayer: Sending pause command");
                    iframeRef.current.contentWindow.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        "*"
                    );
                }
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
