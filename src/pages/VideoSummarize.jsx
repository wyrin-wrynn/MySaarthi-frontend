import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import ControlPanel from '../components/summarizeVideo/ControlPanel';
import VideoPlayer from '../components/summarizeVideo/VideoPlayer';
import RightPanel from '../components/summarizeVideo/RightPanel';
import Divider from '@mui/material/Divider';

const VideoSummarizerPage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [editorData, setEditorData] = useState([
    {
      name: 'Source',
      content: 'No content available',
    },
  ]);
  const handleGenerateSummary = (responseData) => {
    // Extract required data from the response
    const title = responseData.content?.title || 'No title available';
    const body = responseData.content?.body || 'No content available';
    const summaries = responseData.content?.summaries || {};

    // Build the source content
    const sourceContent = `Source: **${title}**\n\n${body}`;

    // Clear the editor data and populate with new content
    const newEditorData = [
      { name: 'Source', content: sourceContent },
      ...Object.entries(summaries).map(([summaryType, tones]) => ({
        name: summaryType,
        content: tones,
      })),
    ];

    // Update editor state and reset active tab
    setEditorData(newEditorData);
    setActiveTab(0);
  };

  return (
    <Paper elevation={3} style={{ height: '100%' }}>
      <Grid container spacing={2} style={{ height: '100%', padding: '16px' }}>
        {/* Left Side */}
        <Grid size={4} container direction="column" spacing={2}>
          <Grid>
            <ControlPanel
              youtubeUrl={youtubeUrl}
              setYoutubeUrl={setYoutubeUrl}
              onGenerate={handleGenerateSummary}
            />
          </Grid>
          <Grid>
            <VideoPlayer youtubeUrl={youtubeUrl} />
          </Grid>
        </Grid>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem sx={{ margin: 2 }} />

        {/* Right Side */}
        <Grid size={7}>
          <RightPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            editorData={editorData}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default VideoSummarizerPage;



