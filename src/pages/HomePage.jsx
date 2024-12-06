import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import VidCard from "../components/home/VidCard";

// Placeholder video data
const placeholderVideos = [
  {
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Sample Video 1",
  },
  {
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    title: "Sample Video 2",
  },
  {
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Sample Video 3",
  },
  {
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    title: "Sample Video 4",
  },
];

const HomePage = () => {
  const [videos] = useState(placeholderVideos);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {videos.map((video, index) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={index}>
            <VidCard videoUrl={video.videoUrl} title={video.title} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;
