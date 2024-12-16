import React, { useState } from 'react';
import { Tabs, Tab, Box, MenuItem, Select } from '@mui/material';
import ReactMarkdown from 'react-markdown';

const TextEditor = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTone, setActiveTone] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (data[newValue]?.content && typeof data[newValue]?.content === 'object') {
      // Automatically set the first tone if available
      const firstTone = Object.keys(data[newValue]?.content)[0];
      setActiveTone(firstTone);
    }
  };

  const handleToneChange = (event) => {
    setActiveTone(event.target.value);
  };

  const currentTab = data[activeTab];
  const content =
    typeof currentTab.content === 'string'
      ? currentTab.content
      : currentTab.content[activeTone] || 'No content available for this tone';

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      {/* Scrollable Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {data.map((item, index) => (
            <Tab key={index} label={item.name} />
          ))}
        </Tabs>
      </Box>

      {/* Tone Dropdown */}
      {typeof currentTab.content === 'object' && (
        <Box sx={{ padding: '4px' }}>
          <Select
            value={activeTone}
            onChange={handleToneChange}
            displayEmpty
            fullWidth
          >
            {Object.keys(currentTab.content).map((tone) => (
              <MenuItem key={tone} value={tone}>
                {tone}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      {/* Markdown Content */}
      <Box
        style={{
          height: 'calc(100% - 48px)',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          backgroundColor: '#fff',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default TextEditor;
