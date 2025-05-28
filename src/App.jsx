import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import './App.css';

import AppHeader from './components/AppHeader';
import BigBoard from './components/BigBoard';
import PlayerProfile from './components/PlayerProfile';
import { processData } from './services/draftData';

function App() {
  const [draftData, setDraftData] = useState({ players: [], stats: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = processData();
        setDraftData(data);
      } catch (error) {
        console.error("Error loading draft data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<BigBoard players={draftData.players} />} />
          <Route path="/player/:playerId" element={<PlayerProfile players={draftData.players} stats={draftData.stats} />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
