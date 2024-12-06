import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const AudioCard = ({ audio, text, voiceModels, onTextChange, onRegenerate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(voiceModels[0]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    onRegenerate(selectedModel);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 300, margin: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Audio
          </Typography>

          {/* Audio Player */}
          <audio controls style={{ width: '100%' }}>
            <source src={audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {/* Editable Text */}
          <Box sx={{ marginTop: 2 }}>
            <TextField
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              multiline
              rows={2}
              fullWidth
              placeholder="Enter text for audio..."
              variant="outlined"
            />
          </Box>
        </CardContent>

        {/* Regenerate Button */}
        <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
          <IconButton color="primary" onClick={handleOpenDialog}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Card>

      {/* Dialog for Regenerate */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select Voice Model</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Voice Model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            fullWidth
          >
            {voiceModels.map((model, index) => (
              <MenuItem key={index} value={model}>
                {model}
              </MenuItem>
            ))}
          </TextField>
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

export default AudioCard;
