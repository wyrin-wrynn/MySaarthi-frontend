import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

const SimpleTextEditor = ({ title, value, onChange, onSave, onCancel, saveDisabled }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <Typography variant="h6" fontWeight="bold">
        {title || 'Text Editor'}
      </Typography>

      {/* Simple Text Box */}
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your content here..."
          multiline
          fullWidth
          rows={10}
          variant="outlined"
        />
      </Box>

      {/* Save and Cancel Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSave}
          disabled={saveDisabled}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default SimpleTextEditor;
