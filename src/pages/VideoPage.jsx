import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import ProjectCard from "../components/videoEditor/ProjectCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Placeholder drafts data for fallback
const draftVideos = [
  { id: 1, name: "Draft 1", image: "" },
  { id: 2, name: "Draft 2", image: "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg" },
  { id: 3, name: "Draft 3", image: "https://via.placeholder.com/250?text=Project+Image" },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const VideoPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true); // For showing loading state
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getDraft`);
        console.log("API Response:", response.data); // Debugging API response

        if (response.data && Array.isArray(response.data.content)) {
          setDrafts(
            response.data.content.map((draft) => ({
              id: draft.id,
              name: draft.title,
              image: draft.imageUrl || "https://via.placeholder.com/250?text=No+Image",
              currentStep: draft.currentStep,
            }))
          );
        } else {
          console.warn("Unexpected API response structure, falling back to placeholder data.");
          setDrafts(draftVideos); // Fallback to placeholder drafts
        }
      } catch (err) {
        console.error("Error fetching drafts:", err);
        setError(err.message || "Failed to load drafts");
        setDrafts(draftVideos); // Fallback to placeholder drafts
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  const handleRename = (id) => {
    console.log(`Rename Draft with ID: ${id}`);
    // Navigate to step 1 of the stepper
  };

  const handleEdit = (id, currentStep) => {
    console.log(`Edit Draft with ID: ${id} and Current Step: ${currentStep}`);
    navigate(`/video-editor/${id}`, { state: { id, currentStep } });
  };

  const handleDelete = (id) => {
    setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== id));
    console.log(`Delete Draft with ID: ${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Grid2 container spacing={3}>
      {/* New Video Card */}
      <Grid2 xs={12} sm={6} md={4} lg={3}>
        <ProjectCard
          image={""}
          name={"New Video"}
          onRename={() => handleRename(0)}
          onEdit={() => handleEdit(0,1)}
          onDelete={() => handleDelete(0)}
        />
      </Grid2>

      {/* Existing Drafts */}
      {drafts.map((draft) => (
        <Grid2 key={draft.id} xs={12} sm={6} md={4} lg={3}>
          <ProjectCard
            image={draft.image}
            name={draft.name}
            onRename={() => handleRename(draft.id)}
            onEdit={() => handleEdit(draft.id, draft.currentStep)}
            onDelete={() => handleDelete(draft.id)}
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default VideoPage;
