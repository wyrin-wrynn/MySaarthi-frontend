// src/utils/rescaleTimeline.js

import calculateTotalDuration from "./calculateTotalDuration";

const rescaleTimeline = (lanes, newTotalDuration) => {
  const maxDuration = calculateTotalDuration(lanes);
  const scaleFactor = maxDuration > 0 ? newTotalDuration / maxDuration : 1;

  return lanes.map((lane) => ({
    ...lane,
    items: lane.items.map((item) => ({
      ...item,
      start: item.start * scaleFactor,
      duration: item.duration * scaleFactor,
    })),
  }));
};

export default rescaleTimeline;
