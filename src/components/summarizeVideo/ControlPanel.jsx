import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Tooltip,
} from '@mui/material';

const ControlPanel = ({ youtubeUrl, setYoutubeUrl, onGenerate }) => {
  const [summaryOption, setSummaryOption] = useState('');
  const [explanationOption, setExplanationOption] = useState('');
  const [toast, setToast] = useState({ open: false, severity: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Set an extended timeout for Axios
  const apiClient = axios.create({
    baseURL: 'https://api.mysaarthi.ai',
    timeout: 600000, // 10 minutes
  });

  const handleCloseToast = () => {
    setToast({ open: false, severity: '', message: '' });
  };

  const handleGenerate = async () => {
    if (!youtubeUrl.trim() || !summaryOption || !explanationOption) {
      setToast({
        open: true,
        severity: 'warning',
        message: 'Please enter a valid URL and select both options.',
      });
      return;
    }

    try {
      setLoading(true); // Activate spinner
      const payload = {
        url: youtubeUrl,
        summaryOption,
        explanationOption,
      };

      const response = await apiClient.post('/api/v1/getVideoTranscript', payload);

      if (onGenerate) {
        onGenerate(response.data);
      }

      setToast({
        open: true,
        severity: 'success',
        message: 'Summary generated successfully!',
      });
    } catch (error) {
      console.error('Error:', error);

      // Handle timeout specifically
      const message =
        error.code === 'ECONNABORTED'
          ? 'The request timed out. Please try again later.'
          : 'An error occurred while generating the summary.';

      setToast({
        open: true,
        severity: 'error',
        message,
      });
    } finally {
      setLoading(false); // Deactivate spinner
    }
  };

  return (
    <div>
      {/* URL Input */}
      <TextField
        fullWidth
        label="Enter YouTube URL"
        variant="outlined"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />

      {/* Options Form */}
      <Typography variant="h6" style={{ margin: '16px 0 8px' }}>
        What to Summarize
      </Typography>
      <RadioGroup
        row
        value={summaryOption}
        onChange={(e) => setSummaryOption(e.target.value)}
      >
        <Tooltip title="Highlight the key points of the video." arrow>
          <FormControlLabel value="Key Points" control={<Radio />} label="Key Points" />
        </Tooltip>
        <Tooltip title="Provide a short summary of the video." arrow>
          <FormControlLabel value="Brief Summary" control={<Radio />} label="Brief Summary" />
        </Tooltip>
        <Tooltip title="Explain the video in detail with all key aspects." arrow>
          <FormControlLabel value="Detailed Explanation" control={<Radio />} label="Detailed Explanation" />
        </Tooltip>
        <Tooltip title="Break down instructions or concepts into clear steps." arrow>
          <FormControlLabel value="Step-by-Step Guide" control={<Radio />} label="Step-by-Step Guide" />
        </Tooltip>
        <Tooltip title="Extract and explain terms or concepts in the video." arrow>
          <FormControlLabel value="Definitions or Concepts" control={<Radio />} label="Definitions or Concepts" />
        </Tooltip>
        <Tooltip title="Summarize the pros and cons or arguments in the video." arrow>
          <FormControlLabel value="Pros and Cons" control={<Radio />} label="Pros and Cons" />
        </Tooltip>
        <Tooltip title="Extract questions and their answers discussed in the video." arrow>
          <FormControlLabel value="Questions and Answers" control={<Radio />} label="Questions and Answers" />
        </Tooltip>
        <Tooltip title="Highlight practical advice or actionable insights." arrow>
          <FormControlLabel value="Actionable Takeaways" control={<Radio />} label="Actionable Takeaways" />
        </Tooltip>
        <Tooltip title="List resources or references mentioned in the video." arrow>
          <FormControlLabel value="Resource List" control={<Radio />} label="Resource List" />
        </Tooltip>
        <Tooltip title="Create a fun or creative summary of the video." arrow>
          <FormControlLabel value="Creative Summary" control={<Radio />} label="Creative Summary" />
        </Tooltip>
        <Tooltip title="Highlight data, statistics, or metrics from the video." arrow>
          <FormControlLabel value="Data and Statistics" control={<Radio />} label="Data and Statistics" />
        </Tooltip>
        <Tooltip title="Include all types of summaries for the video." arrow>
          <FormControlLabel value="All" control={<Radio />} label="All" />
        </Tooltip>
      </RadioGroup>

      <Typography variant="h6" style={{ margin: '16px 0 8px' }}>
        How to Explain
      </Typography>
      <RadioGroup
        row
        value={explanationOption}
        onChange={(e) => setExplanationOption(e.target.value)}
      >
        <Tooltip title="Explain in simple terms, as if to a 5-year-old." arrow>
          <FormControlLabel value="ELI5" control={<Radio />} label="ELI5" />
        </Tooltip>
        <Tooltip title="Provide a formal and professional explanation." arrow>
          <FormControlLabel value="Professional" control={<Radio />} label="Professional" />
        </Tooltip>
        <Tooltip title="Give a detailed and technical explanation." arrow>
          <FormControlLabel value="Technical" control={<Radio />} label="Technical" />
        </Tooltip>
        <Tooltip title="Use a casual and conversational tone for the explanation." arrow>
          <FormControlLabel value="Conversational" control={<Radio />} label="Conversational" />
        </Tooltip>
        <Tooltip title="Frame the explanation as an engaging story." arrow>
          <FormControlLabel value="Storytelling" control={<Radio />} label="Storytelling" />
        </Tooltip>
        <Tooltip title="Analyze the video with critical and logical reasoning." arrow>
          <FormControlLabel value="Analytical" control={<Radio />} label="Analytical" />
        </Tooltip>
      </RadioGroup>

      {/* Action Button */}
      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: '16px' }}
        onClick={handleGenerate}
      >
        Generate Summary
      </Button>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Loading Spinner */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ControlPanel;
