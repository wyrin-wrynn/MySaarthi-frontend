import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SceneCard = ({ scene, onEdit, onDelete }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {scene.title || 'Untitled Scene'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {scene.content}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton color="primary" onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default SceneCard;
