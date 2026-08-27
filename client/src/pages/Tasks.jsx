import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, CircularProgress, Alert, Chip,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Checkbox, Grid, InputAdornment, FormControl, InputLabel, Select
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);

  // Dialog State
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const location = useLocation();

  // Parse query params for initial filters
  const getInitialParam = (param) => new URLSearchParams(location.search).get(param) || '';
  
  // Filter State
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState(getInitialParam('status'));
  const [priorityFilter, setPriorityFilter] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: ''
  });

  const fetchTasks = async (currentPage, limit, searchKw = appliedKeyword, fStatus = statusFilter, fPriority = priorityFilter) => {
    setLoading(true);
    try {
      let queryUrl = `/tasks?page=${currentPage + 1}&limit=${limit}`;
      if (searchKw) queryUrl += `&keyword=${searchKw}`;
      if (fStatus) queryUrl += `&status=${fStatus}`;
      if (fPriority) queryUrl += `&priority=${fPriority}`;
      const response = await api.get(queryUrl);
      setTasks(response.data.data);
      setTotalTasks(response.data.pagination.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page, rowsPerPage, appliedKeyword, statusFilter, priorityFilter);
  }, [page, rowsPerPage, appliedKeyword, statusFilter, priorityFilter]);

  const handleSearch = () => {
    setPage(0);
    setAppliedKeyword(keyword);
  };

  const handleFilterChange = () => {
    setPage(0);
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      fetchTasks(page, rowsPerPage, appliedKeyword, statusFilter, priorityFilter); // Refresh table
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleOpen = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setCurrentTask(null);
      setFormData({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
  };

  const handleSave = async () => {
    try {
      if (currentTask) {
        await api.put(`/tasks/${currentTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      handleClose();
      fetchTasks(page, rowsPerPage); // Refresh table
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks(page, rowsPerPage); // Refresh table
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    if(status === 'Completed') return 'success';
    if(status === 'In Progress') return 'info';
    return 'warning';
  };

  const getPriorityColor = (priority) => {
    if(priority === 'Urgent' || priority === 'High') return 'error';
    if(priority === 'Medium') return 'warning';
    return 'success';
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return 'None';
    return new Date(dateString).toLocaleDateString();
  };
  
  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'Completed') return false;
    return new Date(dateString) < new Date();
  };

  if (loading && tasks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Tasks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Create Task
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Search Tasks"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleSearch}><SearchIcon /></IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Todo">Todo</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => { setPriorityFilter(e.target.value); handleFilterChange(); }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden', boxShadow: 2 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          {tasks.length === 0 && !loading && !error ? (
            <Box p={4} textAlign="center"><Typography variant="h6" color="textSecondary">No tasks found.</Typography></Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow hover key={task._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="success"
                        checked={task.status === 'Completed'}
                        onChange={() => handleToggleComplete(task)}
                      />
                    </TableCell>
                    <TableCell sx={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none', color: task.status === 'Completed' ? 'text.disabled' : 'text.primary' }}>
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ color: isOverdue(task.dueDate, task.status) ? 'error.main' : 'inherit', fontWeight: isOverdue(task.dueDate, task.status) ? 'bold' : 'normal' }}>
                      {formatDueDate(task.dueDate)}
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(task)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(task._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalTasks}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense" label="Title" fullWidth required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense" label="Description" fullWidth multiline rows={3} required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            select margin="dense" label="Status" fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            {['Todo', 'In Progress', 'Completed'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField
            select margin="dense" label="Priority" fullWidth
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            {['Low', 'Medium', 'High', 'Urgent'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
          <TextField
            margin="dense" label="Due Date" type="date" fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.title || !formData.description}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;
