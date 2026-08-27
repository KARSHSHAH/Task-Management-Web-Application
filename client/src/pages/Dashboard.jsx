import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { Grid, Typography, CircularProgress, Box, Alert } from '@mui/material';
import {
  Assignment as TotalIcon,
  CheckCircle as CompletedIcon,
  PendingActions as PendingIcon,
  Warning as OverdueIcon,
  ErrorOutlined as HighPriorityIcon,
  Autorenew as InProgressIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">No data available.</Alert>;
  }

  const statConfig = [
    { title: 'Total Tasks', value: stats.totalTasks, icon: <TotalIcon />, color: 'primary', path: '/tasks' },
    { title: 'Completed', value: stats.completedTasks, icon: <CompletedIcon />, color: 'success', path: '/tasks?status=Completed' },
    { title: 'In Progress', value: stats.inProgressTasks, icon: <InProgressIcon />, color: 'info', path: '/tasks?status=In Progress' },
    { title: 'Pending', value: stats.pendingTasks, icon: <PendingIcon />, color: 'warning', path: '/tasks?status=Todo' },
    { title: 'Overdue', value: stats.overdueTasks, icon: <OverdueIcon />, color: 'error', path: '/tasks' },
    { title: 'High/Urgent Priority', value: stats.highPriorityTasks, icon: <HighPriorityIcon />, color: 'error', path: '/tasks' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {statConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard 
              title={stat.title} 
              value={stat.value} 
              icon={stat.icon} 
              color={stat.color} 
              onClick={() => navigate(stat.path)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
