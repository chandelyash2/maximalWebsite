// VideoBackground.js
import React from 'react';
import { useLocation } from 'react-router-dom';

// Inline CSS for the video background
const videoBackgroundStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  minWidth: '100%',
  minHeight: '100%',
  width: 'auto',
  height: 'auto',
  background: '#ede8e2',
  transform: 'translate(-50%, -50%)',
  zIndex: '-1', // Ensure the video stays in the background
};

const VideoBackground = () => {
  const location = useLocation();

 
    return (
      <div style={videoBackgroundStyle}>
      </div>
    );
  
};

export default VideoBackground;
