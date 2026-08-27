import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, IconButton,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Alert, CardActionArea
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const COLORS = [
  '#ffffff', // White
  '#f28b82', // Red
  '#fbbc04', // Orange
  '#fff475', // Yellow
  '#ccff90', // Green
  '#a7ffeb', // Teal
  '#cbf0f8', // Blue
  '#aecbfa', // Dark Blue
  '#d7aefb', // Purple
  '#fdcfe8', // Pink
  '#e6c9a8', // Brown
  '#e8eaed', // Gray
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog State
  const [open, setOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '', content: '', color: '#ffffff'
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notes');
      setNotes(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpen = (note = null) => {
    if (note) {
      setCurrentNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        color: note.color || '#ffffff'
      });
    } else {
      setCurrentNote(null);
      setFormData({ title: '', content: '', color: '#ffffff' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentNote(null);
  };

  const handleSave = async () => {
    try {
      if (currentNote) {
        await api.put(`/notes/${currentNote._id}`, formData);
      } else {
        await api.post('/notes', formData);
      }
      handleClose();
      fetchNotes(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        fetchNotes(); // Refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete note');
      }
    }
  };

  if (loading && notes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Notes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Take a Note
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {notes.length === 0 && !loading && !error ? (
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            Your notes will appear here. Click 'Take a Note' to begin.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  bgcolor: note.color || 'background.paper',
                  boxShadow: 2,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardActionArea onClick={() => handleOpen(note)} sx={{ flexGrow: 1 }}>
                  <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.87)' }}>
                      {note.title}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'rgba(0, 0, 0, 0.7)' }}>
                      {note.content}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ justifyContent: 'flex-end', opacity: 0.8 }}>
                  <IconButton size="small" onClick={() => handleOpen(note)} sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(note._id)} sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{currentNote ? 'Edit Note' : 'Take a Note'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense" label="Title" fullWidth required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense" label="Content" fullWidth multiline rows={15} required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Note Color</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {COLORS.map((c) => (
              <Box 
                key={c}
                onClick={() => setFormData({ ...formData, color: c })}
                sx={{
                  width: 32, height: 32, borderRadius: '50%', bgcolor: c,
                  cursor: 'pointer', border: formData.color === c ? '2px solid #000' : '1px solid #ccc'
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.title || !formData.content}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;
