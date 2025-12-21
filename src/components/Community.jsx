import React, { useState } from 'react';

const DUMMY_COMMENTS = [
    { id: 1, user: 'Riya S.', text: 'This beat drops so hard! 🔥', time: '2m ago', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, user: 'Arjun K.', text: 'Best version I have heard.', time: '5m ago', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, user: 'Suroor Fan', text: 'Waiting for the next episode!', time: '1h ago', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const Community = ({ trackId }) => {
    const [comments, setComments] = useState(DUMMY_COMMENTS);
    const [input, setInput] = useState('');

    const handlePost = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newComment = {
            id: Date.now(),
            user: 'You',
            text: input,
            time: 'Just now',
            avatar: 'https://i.pravatar.cc/150?u=me' // Mock self avatar
        };
        setComments([newComment, ...comments]);
        setInput('');
    };

    return (
        <div className="community-section" style={{ padding: 20, color: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10, marginBottom: 15 }}>
                Community Discussion
            </h3>

            <div className="comments-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 15 }}>
                {comments.map(c => (
                    <div key={c.id} className="comment" style={{ display: 'flex', gap: 12 }}>
                        <img src={c.avatar} alt={c.user} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#ccc' }}>
                                {c.user} <span style={{ fontWeight: 'normal', color: '#666', fontSize: 11 }}>• {c.time}</span>
                            </div>
                            <div style={{ fontSize: 14, marginTop: 2 }}>{c.text}</div>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handlePost} style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Join the conversation..."
                    style={{
                        flex: 1, background: '#333', border: 'none', borderRadius: 20,
                        padding: '10px 15px', color: 'white'
                    }}
                />
                <button type="submit" style={{
                    background: 'var(--brand-gold, #ffbe0b)', color: 'black', border: 'none',
                    borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontWeight: 'bold'
                }}>
                    ➤
                </button>
            </form>
        </div>
    );
};
