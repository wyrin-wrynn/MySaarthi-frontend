import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SceneCard from './SceneCard';

const ScriptStep = () => {
  const [scenes, setScenes] = useState([
    { title: 'Scene 1', content: 'This is the first scene.' },
    { title: 'Scene 2', content: 'This is the second scene.' },
  ]);

  const handleAddScene = () => {
    const newScene = { title: 'New Scene', content: 'Enter scene details here.' };
    setScenes([...scenes, newScene]);
  };

  const handleEditScene = (index) => {
    const updatedScenes = [...scenes];
    const newContent = prompt('Edit Scene Content', scenes[index].content);
    if (newContent) {
      updatedScenes[index].content = newContent;
      setScenes(updatedScenes);
    }
  };

  const handleDeleteScene = (index) => {
    const updatedScenes = scenes.filter((_, i) => i !== index);
    setScenes(updatedScenes);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {scenes.map((scene, index) => (
        <SceneCard
          key={index}
          scene={scene}
          onEdit={() => handleEditScene(index)}
          onDelete={() => handleDeleteScene(index)}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ marginTop: 2 }}
        onClick={handleAddScene}
      >
        Add New Scene
      </Button>
    </Box>
  );
};

export default ScriptStep;
