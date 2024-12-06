import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Slider,
  Button,
  Divider,
  Paper,
} from '@mui/material';


const SourceStepForm = ({
  sourceOption,
  setSourceOption,
  urlOrTopic,
  setUrlOrTopic,
  aspectRatio,
  setAspectRatio,
  duration,
  setDuration,
  handleGetSource,
  loading,
}) => {
  return (
    <Paper sx={{ padding: 3 }} elevation={3}>
      <Typography variant="h6" fontWeight="bold">
        Create New Project
      </Typography>

      {/* Source Option Selector */}
      <Typography>Select the source type:</Typography>
      <RadioGroup
        value={sourceOption}
        onChange={(e) => setSourceOption(e.target.value)}
      >
        <FormControlLabel value="Reddit URL" control={<Radio />} label="Reddit URL" />
        <FormControlLabel value="News Article URL" control={<Radio />} label="News Article URL" />
        <FormControlLabel value="Wikipedia URL" control={<Radio />} label="Wikipedia URL" />
        <FormControlLabel value="YouTube URL" control={<Radio />} label="YouTube URL" />
        <FormControlLabel value="Generate Random Topic" control={<Radio />} label="Generate Random Topic" />
        <FormControlLabel value="Perplexity" control={<Radio />} label="Perplexity" />
      </RadioGroup>

      {/* URL or Topic Input */}
      <TextField
        fullWidth
        label={`Enter the ${sourceOption.includes('URL') ? 'URL' : 'topic'}`}
        value={urlOrTopic}
        onChange={(e) => setUrlOrTopic(e.target.value)}
        disabled={!sourceOption}
      />

      {/* Aspect Ratio Selector */}
      <Typography>Select the aspect ratio:</Typography>
      <RadioGroup
        value={aspectRatio}
        onChange={(e) => setAspectRatio(e.target.value)}
      >
        <FormControlLabel value="Portrait" control={<Radio />} label="Portrait" />
        <FormControlLabel value="Landscape" control={<Radio />} label="Landscape" />
      </RadioGroup>

      {/* Duration Slider */}
      <Typography>Video duration (in minutes):</Typography>
      <Slider
        value={duration}
        onChange={(e, newValue) => setDuration(newValue)}
        min={1}
        max={10}
        step={1}
        valueLabelDisplay="auto"
      />

      {/* Get Source Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetSource}
        disabled={!sourceOption || loading}
      >
        {loading ? 'Fetching...' : 'Get Source'}
      </Button>
    </Paper>
  );
};
export default SourceStepForm