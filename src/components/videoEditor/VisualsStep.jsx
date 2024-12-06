import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import VisualCard from './VisualCard';

const VisualsStep = () => {
  const [scenes, setScenes] = useState([
    {
      title: 'Scene 1',
      visuals: [
        { image: 'https://via.placeholder.com/200', dialogue: 'This is the first visual.' },
        { image: 'https://via.placeholder.com/200', dialogue: 'This is the second visual.' },
      ],
    },
    {
      title: 'Scene 2',
      visuals: [
        { image: 'https://via.placeholder.com/200', dialogue: 'This is another visual.' },
      ],
    },
  ]);

  const handleRegenerateVisual = (sceneIndex, visualIndex, newPrompt) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].visuals[visualIndex] = {
      ...updatedScenes[sceneIndex].visuals[visualIndex],
      image: `https://via.placeholder.com/200?text=${encodeURIComponent(newPrompt)}`, // Simulate new image
      dialogue: newPrompt,
    };
    setScenes(updatedScenes);
  };

  const handleAddVisual = (sceneIndex) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].visuals.push({
      image: 'https://via.placeholder.com/200',
      dialogue: 'New visual.',
    });
    setScenes(updatedScenes);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {scenes.map((scene, sceneIndex) => (
        <Box key={sceneIndex} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" gutterBottom>
            {scene.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {scene.visuals.map((visual, visualIndex) => (
              <VisualCard
                key={visualIndex}
                image={visual.image}
                dialogue={visual.dialogue}
                onRegenerate={(newPrompt) =>
                  handleRegenerateVisual(sceneIndex, visualIndex, newPrompt)
                }
              />
            ))}
          </Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={() => handleAddVisual(sceneIndex)}
          >
            Add Visual
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default VisualsStep;
