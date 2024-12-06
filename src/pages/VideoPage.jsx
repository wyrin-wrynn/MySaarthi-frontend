import React from 'react';
import Grid2 from '@mui/material/Grid2';
import ProjectCard from '../components/videoEditor/ProjectCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// Placeholder drafts data
const draftVideos = [
    { id: 1, name: 'Draft 1', image: '' },
    { id: 2, name: 'Draft 2', image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg' },
    { id: 3, name: 'Draft 3', image: 'https://via.placeholder.com/250?text=Project+Image' },

  ];


const VideoPage = () => {
  const [drafts, setDrafts] = useState(draftVideos);
  const navigate = useNavigate()

  const handleRename = (id) => {
    console.log(`Rename Draft with ID: ${id}`);
    // Navigate to step 1 of the stepper
  };

  const handleEdit = (id) => {
    console.log(`Edit Draft with ID: ${id}`);
    navigate(`/video-editor/${id}`)
    // Fetch data from backend and navigate to stepper with preloaded steps
  };

  const handleDelete = (id) => {
    setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== id));
    console.log(`Delete Draft with ID: ${id}`);
  };

  return (
    <Grid2 container spacing={3}>
      {/* New Video Card */}
      <Grid2 xs={12} sm={6} md={4} lg={3}>
      <ProjectCard
            image={""}
            name={"New Video"}
            onRename={()=> handleRename(0)}
            onEdit={() => handleEdit(0)}
            onDelete={() => handleDelete(0)}
          />
      </Grid2>

      {/* Existing Drafts */}
      {drafts.map((draft) => (
        <Grid2 key={draft.id} xs={12} sm={6} md={4} lg={3}>
          <ProjectCard
            image={draft.image}
            name={draft.name}
            onRename={()=> handleRename(draft.id)}
            onEdit={() => handleEdit(draft.id)}
            onDelete={() => handleDelete(draft.id)}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}

export default VideoPage;
