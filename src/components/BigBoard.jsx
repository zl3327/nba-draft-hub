import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Avatar,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { getScouts, getRankingStatus } from '../services/draftData';

const BigBoard = ({ players }) => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('avgRanking');
  const scouts = getScouts();

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(filterValue.toLowerCase()) ||
    player.currentTeam.toLowerCase().includes(filterValue.toLowerCase())
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortField === 'avgRanking') {
      if (a.avgRanking === null) return 1;
      if (b.avgRanking === null) return -1;
      return a.avgRanking - b.avgRanking;
    } else {
      const aRank = a.scoutRankings?.[sortField] || 999;
      const bRank = b.scoutRankings?.[sortField] || 999;
      return aRank - bRank;
    }
  });

  const handleSelectPlayer = (playerId) => {
    navigate(`/player/${playerId}`);
  };
  
  const getRankingDisplay = (player, scoutName) => {
    const ranking = player.scoutRankings?.[scoutName];
    if (ranking === null || ranking === undefined) return '-';
    
    const status = getRankingStatus(player.scoutRankings, ranking, scoutName);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          sx={{ 
            color: status === 'high' ? 'success.main' : 
                  status === 'low' ? 'error.main' : 
                  'text.primary'
          }}
        >
          {ranking}
          {status === 'high' && ' (HIGH)'}
          {status === 'low' && ' (LOW)'}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Draft Big Board
      </Typography>

      <Box mb={3} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search Player/School"
          variant="outlined"
          size="small"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            label="Sort By"
            onChange={(e) => setSortField(e.target.value)}
          >
            <MenuItem value="avgRanking">Average Ranking</MenuItem>
            {scouts.map(scout => (
              <MenuItem key={scout} value={scout}>{scout.replace(' Rank', '')}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="prospects table">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Player</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="center">Avg Rank</TableCell>
              {scouts.map(scout => (
                <TableCell key={scout} align="center">
                  {scout.replace(' Rank', '')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow 
                key={player.playerId} 
                hover 
                onClick={() => handleSelectPlayer(player.playerId)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      alt={player.name} 
                      src={player.photoUrl} 
                      sx={{ mr: 2, width: 40, height: 40 }}
                    >
                      {player.firstName[0]}{player.lastName[0]}
                    </Avatar>
                    <Typography>{player.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{player.currentTeam || '-'}</TableCell>
                <TableCell align="center">
                  {player.avgRanking ? player.avgRanking.toFixed(1) : '-'}
                </TableCell>
                {scouts.map(scout => (
                  <TableCell key={`${player.playerId}-${scout}`} align="center">
                    {getRankingDisplay(player, scout)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BigBoard; 