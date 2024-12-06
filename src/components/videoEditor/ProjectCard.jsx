import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

function ProjectCard({ image, name, onRename, onEdit, onDelete }) {
  return (
    <div
      style={{
        cursor: 'pointer', // Make the card clickable
      }}
      onClick={onEdit} // Trigger edit when clicking the card
    >
      <Card
        sx={{
          width: 250,
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* Image Section */}
        <CardMedia
          component="img"
          src={image || 'https://via.placeholder.com/250?text=No+Image'}
          alt={name}
          sx={{
            height: 150,
            width: '100%',
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
          }}
        />

        {/* Content Section */}
        <CardContent
          sx={{
            padding: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={(e) => e.stopPropagation()} // Prevent card click from firing here
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            sx={{
              flexGrow: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{ display: 'flex', gap: 1 }}
            onClick={(e) => e.stopPropagation()} // Prevent button clicks from triggering card click
          >
            <IconButton size="small" color="primary" onClick={onRename}>
              <DriveFileRenameOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="primary" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProjectCard;
