// src/utils/calculateTotalDuration.js

const calculateTotalDuration = (lanes) => {
    return Math.max(
      ...lanes.flatMap((lane) =>
        lane.items.map((item) => item.start + item.duration)
      ),
      1
    );
  };
  
  export default calculateTotalDuration;
  