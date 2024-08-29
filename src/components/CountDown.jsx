import React from 'react';
import Countdown from 'react-countdown';

// Random component
const Completionist = () => <span>Brewing Finished!</span>;

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <span>{hours}:{minutes}:{seconds}</span>;
  }
};

const MyCountdown = ({ countdownDate }) => {
  return (
    <Countdown
      date={countdownDate}
      renderer={renderer}
    />
  );
};

export default MyCountdown;