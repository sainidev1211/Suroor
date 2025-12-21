import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [library, setLibrary] = useState({ likedSongs: [], savedPlaylists: [] });

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('suroor_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedLib = localStorage.getItem('suroor_library');
        if (storedLib) {
            setLibrary(JSON.parse(storedLib));
        }
    }, []);

    const login = (email) => {
        const newUser = {
            id: 'u1',
            name: email.split('@')[0],
            email,
            avatar: `https://ui-avatars.com/api/?name=${email}&background=random`
        };
        setUser(newUser);
        localStorage.setItem('suroor_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('suroor_user');
    };

    const toggleLike = (song) => {
        setLibrary(prev => {
            const exists = prev.likedSongs.find(s => s.id === song.id);
            let newSongs;
            if (exists) {
                newSongs = prev.likedSongs.filter(s => s.id !== song.id);
            } else {
                newSongs = [...prev.likedSongs, song];
            }
            const newLib = { ...prev, likedSongs: newSongs };
            localStorage.setItem('suroor_library', JSON.stringify(newLib));
            return newLib;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, library, toggleLike }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
