import React from 'react';
import { MainView } from '../components/MainView'; // Reuse existing MainView logic for now as Home

export const Home = (props) => {
    // We pass props through to MainView to maintain existing music grid
    return <MainView view="music" {...props} />;
};
