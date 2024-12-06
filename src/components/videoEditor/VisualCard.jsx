import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const VisualCard = ({ image, dialogue, onRegenerate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleOpenDialog = () => {
    setPrompt(dialogue || 'Describe your desired image...');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    onRegenerate(prompt);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 200, margin: 1 }}>
        <CardMedia component="img" height="140" image={image} alt="Visual" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {dialogue || 'No dialogue provided.'}
          </Typography>
        </CardContent>
        <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
          <IconButton color="primary" onClick={handleOpenDialog}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Dialog for Regenerate */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit Prompt</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Edit your prompt here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VisualCard;
