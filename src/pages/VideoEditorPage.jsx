import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, Button, Typography, Toolbar } from '@mui/material';
import axios from 'axios';
import SourceStep from '../components/videoEditor/SourceStep';
import ScriptStep from '../components/videoEditor/ScriptStep';
import VisualsStep from '../components/videoEditor/VisualsStep';
import AudioStep from '../components/videoEditor/AudioStep';
import EditVideoStep from '../components/videoEditor/EditVideoStep';

// Step titles
const steps = ['Source', 'Script', 'Visuals', 'Audio', 'Edit Video', 'Finalize'];

// Placeholder component for the Finalize step
const FinalizeStep = () => <Typography>Step 6: Finalize and save your video...</Typography>;

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const VideoEditorPage = () => {
  const location = useLocation(); // Access the state passed via navigate
  const { id, currentStep } = location.state || {}; // Extract `id` and `currentStep` from state
  console.log(id, currentStep)
  const [activeStep, setActiveStep] = useState(currentStep ? currentStep - 1 : 0); // Convert to zero-based index
  const [stepData, setStepData] = useState(null); // Data fetched for the current step
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch data for the current step from the API
    const fetchStepData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_BASE_URL}/getDraftProject`, { id });
        console.log(response.data)
        setStepData(response.data); // Store the API response in state
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching step data:', err);
        setError(err.message || 'Failed to load step data.');
      } finally {
        setLoading(false);
      }
    };

    if (id && currentStep) {
      fetchStepData();
    } else {
      setError('Invalid project data. Please return to the drafts page.');
      setLoading(false);
    }
  }, [id, currentStep]); // Re-fetch if `id` or `currentStep` changes

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSaveDraft = () => {
    console.log('Draft saved');
  };

  // Dynamically render the step content
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <SourceStep stepData={stepData} />;
      case 1:
        return <ScriptStep stepData={stepData} />;
      case 2:
        return <VisualsStep stepData={stepData} />;
      case 3:
        return <AudioStep stepData={stepData} />;
      case 4:
        return <EditVideoStep stepData={stepData} />;
      case 5:
        return <FinalizeStep />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Stepper at the top */}
      <Box sx={{ padding: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Toolbar (Footer) below the stepper */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderTop: '1px solid #e0e0e0',
          padding: 2,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{
                textTransform: 'none',
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginLeft: 2, marginRight: 2, textTransform: 'none' }}
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={{
                textTransform: 'none',
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Toolbar>
      </Box>

      {/* Step Content below the toolbar */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        {renderStepContent(activeStep)}
      </Box>
    </Box>
  );
};

export default VideoEditorPage;
