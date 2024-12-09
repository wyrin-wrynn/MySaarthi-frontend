// components/imageEditor/utils/filters.js
import Konva from 'konva';

// Custom Brightness Filter
Konva.Filters.Brightness = function (imageData) {
  const brightness = this.brightness || 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] += brightness;
    imageData.data[i + 1] += brightness;
    imageData.data[i + 2] += brightness;
  }
};

export default Konva.Filters;
