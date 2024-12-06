import React, { useState } from 'react';
import { Divider } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import SourceStepForm from './SourceStepForm';
import SimpleTextEditor from './SimpleTextEditor';
import Box from '@mui/material/Box';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";


const SourceStep = ({ onNext }) => {
  const [sourceOption, setSourceOption] = useState('');
  const [urlOrTopic, setUrlOrTopic] = useState('');
  const [aspectRatio, setAspectRatio] = useState('Portrait');
  const [duration, setDuration] = useState(3);
  const [sourceContent, setSourceContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetSource = async () => {
    if (!urlOrTopic || !sourceOption) {
      alert('Please select a source option and enter a valid URL or topic.');
      return;
    }

    setLoading(true);
    try {
      // API call
      const response = await fetch(`${API_BASE_URL}/getSource`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: sourceOption,
          url: urlOrTopic,
          aspect: aspectRatio,
          duration: duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch source content');
      }

      const data = await response.json();
      console.log(data)
      setSourceContent(
        data.content[1]
          ? `${data.content[1].title}\n\n${data.content[1].body}`
          : 'No content returned from API'
      );
    } catch (error) {
      console.error('Error fetching source:', error);
      alert('Failed to fetch source content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSource = () => {
    console.log('Source content saved:', sourceContent);
    onNext(sourceContent); // Pass the content to the next step
  };

  const handleCancel = () => {
    setSourceContent('');
    console.log('Editing canceled');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={1} sx={{ height: '100%', padding: 2 }}>
        {/* Left Side: Form */}
        <Grid2 size={5}>
          <SourceStepForm
            sourceOption={sourceOption}
            setSourceOption={setSourceOption}
            urlOrTopic={urlOrTopic}
            setUrlOrTopic={setUrlOrTopic}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            duration={duration}
            setDuration={setDuration}
            handleGetSource={handleGetSource}
            loading={loading}
          />
        </Grid2>
        {/* Divider */}
        <Grid2 size={1}>
          <Divider orientation="vertical" flexItem sx={{ margin: 2 }} />
        </Grid2>
        <Grid2 size={5}>
          {/* Right Side: Quill Editor */}
          <SimpleTextEditor
            title="Source Content"
            value={sourceContent}
            onChange={setSourceContent}
            onSave={handleSaveSource}
            onCancel={handleCancel}
            saveDisabled={!sourceContent}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default SourceStep;
