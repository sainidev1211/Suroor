import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function useLibrary() {
    const [likedSongs, setLikedSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('spotelly_token'));

    // Configure Axios Defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('spotelly_token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('spotelly_token');
        }
    }, [token]);

    // Load User Profile on Mount (if token exists)
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${BACKEND_URL}/api/user`);
                setUser(res.data);
                if (res.data.likedSongs) {
                    setLikedSongs(res.data.likedSongs);
                }
            } catch (e) {
                console.log("Session expired or invalid token");
                logout();
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/auth/login`, { email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (e) {
            console.error("Login failed", e);
            throw e;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/auth/signup`, { name, email, password });
            setToken(res.data.token);
            setUser(res.data.user);
            return true;
        } catch (e) {
            console.error("Signup failed", e);
            throw e;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setLikedSongs([]);
        localStorage.removeItem('spotelly_token');
    };

    // --- Actions ---

    const toggleLike = async (track) => {
        if (!user) {
            alert("Please Sign In to like songs!");
            return;
        }

        // Optimistic update
        const exists = likedSongs.find(t => t.id === track.id);
        let newLiked;
        if (exists) {
            newLiked = likedSongs.filter(t => t.id !== track.id);
        } else {
            newLiked = [track, ...likedSongs];
        }
        setLikedSongs(newLiked);

        // API Sync
        try {
            await axios.post(`${BACKEND_URL}/api/user/like`, { track });
        } catch (e) {
            console.error("Failed to sync like", e);
        }
    };

    const isLiked = (track) => {
        return track && likedSongs.some(t => t.id === track.id);
    };

    // Playlists Actions
    const createPlaylist = async (name) => {
        if (!user) return alert("Login required");
        try {
            const res = await axios.post(`${BACKEND_URL}/api/playlists`, { name });
            setPlaylists([...playlists, res.data]);
        } catch (e) {
            console.error("Create playlist failed", e);
        }
    };

    const addToPlaylist = async (playlistId, track) => {
        if (!user) return alert("Login required");
        try {
            const res = await axios.post(`${BACKEND_URL}/api/playlists/${playlistId}/add`, { track });
            const updated = playlists.map(pl => pl.id === playlistId ? res.data : pl);
            setPlaylists(updated);
            alert("Added to playlist!");
        } catch (e) {
            console.error("Add to playlist failed", e);
        }
    };

    return {
        user,
        login,
        signup,
        logout,
        likedSongs,
        playlists,
        toggleLike,
        isLiked,
        createPlaylist,
        addToPlaylist
    };
}
