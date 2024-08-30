import React, { useState, useEffect } from 'react';

const DurationComp = () => {
  const [duration, setDuration] = useState(null);
  const phone = localStorage.getItem("accessToken");


  // Replace 'userId' with the actual user ID you want to fetch
  const userId = phone; //|| "6648531588"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://brewiy-back.vercel.app/api/users/${userId}`);
        const userData = await response.json();

        // Fetch the last duration from the data array
        if (userData && userData.data && userData.data.length > 0) {
          const lastData = userData.data[userData.data.length - 1];
          const lastDuration = lastData.duration;
          
          // Only update the duration state if it's different from the previous duration
          if (duration !== lastDuration) {
            setDuration(lastDuration);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch user data initially and set up a repeating fetch with a 1-minute interval
    fetchUserData();
    const interval = setInterval(fetchUserData, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div>
      {duration !== null ? (
        <p>Duration: {(duration/60000).toFixed(2)} minutes</p>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default DurationComp;
