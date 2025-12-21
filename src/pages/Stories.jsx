import React from 'react';

const STORIES_DATA = [
    { id: 's1', title: "The Midnight Caller", genre: "Horror", author: "Arijit S.", cover: "https://placehold.co/300x450/330000/FFF?text=Horror" },
    { id: 's2', title: "Mumbai Crime Files", genre: "Crime", author: "Deepak K.", cover: "https://placehold.co/300x450/003366/FFF?text=Crime" },
    { id: 's3', title: "Love in Delhi", genre: "Romance", author: "Sneha R.", cover: "https://placehold.co/300x450/660033/FFF?text=Love" },
    { id: 's4', title: "Haunted Highway", genre: "Horror", author: "Team Suroor", cover: "https://placehold.co/300x450/222/FFF?text=Haunted" },
];

export const Stories = ({ onPlay }) => {
    const handlePlayStory = (story) => {
        // Mock playing a story as a track
        onPlay({
            id: story.id,
            title: story.title,
            artist: story.author,
            cover: story.cover,
            youtubeId: 'jfKfPfyJRdk' // Placeholder LoFi stream for now
        });
    };

    return (
        <div className="main-view">
            <div className="view-header" style={{ backgroundImage: 'linear-gradient(to bottom, #4a00e0, #121212)' }}>
                <h1>Suroor Originals</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Immersive Audio Stories</p>
            </div>

            <div className="grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {STORIES_DATA.map(story => (
                    <div key={story.id} className="card story-card" onClick={() => handlePlayStory(story)}>
                        <div className="card-image-wrapper" style={{ aspectRatio: '2/3' }}>
                            <img src={story.cover} alt={story.title} className="card-image" />
                            <div className="play-button-overlay">▶</div>
                        </div>
                        <div className="card-title">{story.title}</div>
                        <div className="card-subtitle">{story.genre} • {story.author}</div>
                    </div>
                ))}
            </div>

            <style>{`
                .story-card .card-image-wrapper {
                    border-radius: 8px; /* More like book covers */
                }
            `}</style>
        </div>
    );
};
