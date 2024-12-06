import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AudioCard from './AudioCard';

const AudioStep = () => {
  const [scenes, setScenes] = useState([
    {
      title: 'Scene 1',
      audios: [
        {
          audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          text: 'This is the first audio.',
        },
        {
          audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          text: 'This is the second audio.',
        },
      ],
    },
    {
      title: 'Scene 2',
      audios: [
        {
          audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          text: 'Another audio for the second scene.',
        },
      ],
    },
  ]);

  const voiceModels = ['Model A', 'Model B', 'Model C'];

  const handleTextChange = (sceneIndex, audioIndex, newText) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].audios[audioIndex].text = newText;
    setScenes(updatedScenes);
  };

  const handleRegenerateAudio = (sceneIndex, audioIndex, selectedModel) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].audios[audioIndex].audio = `https://via.placeholder.com/200?text=${encodeURIComponent(
      selectedModel
    )}`; // Simulating new audio generation
    setScenes(updatedScenes);
  };

  const handleAddAudio = (sceneIndex) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex].audios.push({
      audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      text: 'New audio text.',
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
            {scene.audios.map((audio, audioIndex) => (
              <AudioCard
                key={audioIndex}
                audio={audio.audio}
                text={audio.text}
                voiceModels={voiceModels}
                onTextChange={(newText) =>
                  handleTextChange(sceneIndex, audioIndex, newText)
                }
                onRegenerate={(selectedModel) =>
                  handleRegenerateAudio(sceneIndex, audioIndex, selectedModel)
                }
              />
            ))}
          </Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={() => handleAddAudio(sceneIndex)}
          >
            Add Audio
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default AudioStep;
