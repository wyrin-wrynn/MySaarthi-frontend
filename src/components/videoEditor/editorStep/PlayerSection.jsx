// src/components/editor/PlayerSection.jsx

import React from "react";
import { Player } from "@remotion/player";

const PlayerSection = ({ playerRef, Composition, totalDuration }) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "700px",
          height: "400px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Player
          ref={playerRef}
          component={Composition}
          durationInFrames={totalDuration}
          compositionWidth={1920}
          compositionHeight={1080}
          controls
          fps={30}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default PlayerSection;
