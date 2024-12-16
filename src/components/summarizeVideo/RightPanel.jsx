import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import TextEditor from './TextEditor';
import Chat from './Chat';

const RightPanel = ({ activeTab, setActiveTab, editorData, setEditorData }) => {
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box style={{ height: '100%' }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Text Editor and Chat Tabs">
          <Tab label="Text Editor" />
          <Tab label="Chat" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box style={{ height: 'calc(100% - 48px)', padding: '16px', overflowY: 'auto' }}>
        {activeTab === 0 && (
          <TextEditor data={editorData} setData={setEditorData} />
        )}
        {activeTab === 1 && <Chat />}
      </Box>
    </Box>
  );
};

export default RightPanel;
