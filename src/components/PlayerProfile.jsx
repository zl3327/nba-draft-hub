import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getScouts, getRankingStatus } from '../services/draftData';

const PlayerProfile = ({ players, stats }) => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const scouts = getScouts();
  
  const player = players.find(p => p.playerId === parseInt(playerId));
  if (!player) return <Typography>Player not found</Typography>;
  
  const [scoutReports, setScoutReports] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [newScoutReport, setNewScoutReport] = useState({
    scout: '',
    rating: 3,
    strengths: '',
    weaknesses: '',
    projection: '',
    notes: ''
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleAddScoutReport = (e) => {
    e.preventDefault();
    if (!newScoutReport.scout) return;
    
    const report = {
      ...newScoutReport,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };
    
    setScoutReports([...scoutReports, report]);
    setNewScoutReport({
      scout: '',
      rating: 3,
      strengths: '',
      weaknesses: '',
      projection: '',
      notes: ''
    });
  };
  
  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setNewScoutReport({
      ...newScoutReport,
      [name]: value
    });
  };
  
  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const formatHeight = (inches) => {
    if (!inches) return '-';
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };
  
  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back to Draft Board
      </Button>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar 
              alt={player.name} 
              src={player.photoUrl} 
              sx={{ width: 200, height: 200, fontSize: '4rem' }}
            >
              {player.firstName && player.lastName ? player.firstName[0] + player.lastName[0] : 'N/A'}
            </Avatar>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Typography variant="h4" component="h1" gutterBottom>
              {player.name} 
              {player.avgRanking && (
                <Chip 
                  label={`Avg Rank: ${player.avgRanking.toFixed(1)}`} 
                  color="primary" 
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Team</Typography>
                <Typography variant="body1">{player.currentTeam || '-'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">League</Typography>
                <Typography variant="body1">{player.league || '-'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                <Typography variant="body1">{player.birthDate ? `${calculateAge(player.birthDate)} years` : '-'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Height</Typography>
                <Typography variant="body1">{formatHeight(player.height)} ({player.height ? `${Math.round(player.height * 2.54)} cm` : '-'})</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Weight</Typography>
                <Typography variant="body1">{player.weight ? `${player.weight} lbs (${Math.round(player.weight / 2.205)} kg)` : '-'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Nationality</Typography>
                <Typography variant="body1">{player.nationality || player.homeCountry || '-'}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Scout Rankings" />
          <Tab label="Player Info" />
          <Tab label="Add Scout Report" />
        </Tabs>
        
        <Box p={3}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Scout</TableCell>
                        <TableCell align="center">Rank</TableCell>
                        <TableCell>Assessment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scouts.map(scout => {
                        const ranking = player.scoutRankings?.[scout];
                        const status = ranking !== null && ranking !== undefined 
                          ? getRankingStatus(player.scoutRankings, ranking, scout)
                          : 'neutral';
                        
                        return (
                          <TableRow key={scout}>
                            <TableCell>{scout.replace(' Rank', '')}</TableCell>
                            <TableCell align="center" sx={{ 
                              fontWeight: 'bold',
                              color: status === 'high' ? 'success.main' : 
                                    status === 'low' ? 'error.main' : 
                                    'text.primary'
                            }}>
                              {ranking !== null && ranking !== undefined ? ranking : '-'}
                            </TableCell>
                            <TableCell>
                              {status === 'high' && 'Significantly higher than average rank'}
                              {status === 'low' && 'Significantly lower than average rank'}
                              {status === 'neutral' && 'Close to average rank'}
                              {(ranking === null || ranking === undefined) && 'No ranking provided'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Mavericks Scout Reports
                </Typography>
                
                {scoutReports.length === 0 ? (
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No scout reports yet. Add a new report.
                    </Typography>
                  </Paper>
                ) : (
                  scoutReports.map((report) => (
                    <Card key={report.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6">{report.scout}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={report.rating} readOnly />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {report.date}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Strengths</Typography>
                            <Typography variant="body2">{report.strengths}</Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Weaknesses</Typography>
                            <Typography variant="body2">{report.weaknesses}</Typography>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Career Projection</Typography>
                            <Typography variant="body2">{report.projection}</Typography>
                          </Grid>
                          
                          {report.notes && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary">Additional Notes</Typography>
                              <Typography variant="body2">{report.notes}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                )}
              </Grid>
            </Grid>
          )}
          
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Background</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                      <Typography variant="body2">{player.birthDate || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Hometown</Typography>
                      <Typography variant="body2">
                        {player.homeTown ? `${player.homeTown}${player.homeState ? `, ${player.homeState}` : ''}` : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">High School</Typography>
                      <Typography variant="body2">
                        {player.highSchool ? `${player.highSchool}${player.highSchoolState ? ` (${player.highSchoolState})` : ''}` : '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Nationality</Typography>
                      <Typography variant="body2">{player.nationality || '-'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Physical Profile</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Height</Typography>
                      <Typography variant="body2">{formatHeight(player.height)} ({player.height ? `${Math.round(player.height * 2.54)} cm` : '-'})</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Weight</Typography>
                      <Typography variant="body2">{player.weight ? `${player.weight} lbs (${Math.round(player.weight / 2.205)} kg)` : '-'}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
          
          {tabValue === 2 && (
            <form onSubmit={handleAddScoutReport}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Scout Name</InputLabel>
                    <Select
                      name="scout"
                      value={newScoutReport.scout}
                      label="Scout Name"
                      onChange={handleReportChange}
                    >
                      <MenuItem value="Mark Cuban">Mark Cuban</MenuItem>
                      <MenuItem value="Dirk Nowitzki">Dirk Nowitzki</MenuItem>
                      <MenuItem value="Jason Kidd">Jason Kidd</MenuItem>
                      <MenuItem value="Luka Doncic">Luka Doncic</MenuItem>
                      <MenuItem value="Kyrie Irving">Kyrie Irving</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      Overall Rating:
                    </Typography>
                    <Rating
                      name="rating"
                      value={newScoutReport.rating}
                      onChange={(event, newValue) => {
                        setNewScoutReport({
                          ...newScoutReport,
                          rating: newValue
                        });
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Strengths"
                    name="strengths"
                    value={newScoutReport.strengths}
                    onChange={handleReportChange}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Weaknesses"
                    name="weaknesses"
                    value={newScoutReport.weaknesses}
                    onChange={handleReportChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Career Projection"
                    name="projection"
                    value={newScoutReport.projection}
                    onChange={handleReportChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Notes"
                    name="notes"
                    value={newScoutReport.notes}
                    onChange={handleReportChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    fullWidth
                  >
                    Add Scout Report
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default PlayerProfile; 