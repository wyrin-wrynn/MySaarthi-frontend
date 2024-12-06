import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Toolbar } from '@mui/material';
import SourceStep from '../components/videoEditor/SourceStep';
import ScriptStep from '../components/videoEditor/ScriptStep';
import VisualsStep from '../components/videoEditor/VisualsStep';
import AudioStep from '../components/videoEditor/AudioStep';
import EditVideoStep from '../components/videoEditor/EditVideoStep';

// Step titles
const steps = ['Source', 'Script', 'Visuals', 'Audio', 'Edit Video', 'Finalize'];

// Placeholder components for each step
const FinalizeStep = () => <Typography>Step 6: Finalize and save your video...</Typography>;

const VideoEditorPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSaveDraft = () => {
    console.log('Draft saved');
  };

  // Dynamically render the step content
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <SourceStep />;
      case 1:
        return <ScriptStep />;
      case 2:
        return <VisualsStep />;
      case 3:
        return <AudioStep />;
      case 4:
        return <EditVideoStep />;
      case 5:
        return <FinalizeStep />;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Ensures it fills the parent container
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
              justifyContent: 'flex-end', // Align items to the right
              width: '100%', // Make the Box 100% wide
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
          flexGrow: 1, // Ensures the content takes up remaining space
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
