import React, { createContext, useState } from 'react';

export const DurationContext = createContext();

export const DurationProvider = ({ children }) => {
  const [duration, setDuration] = useState(null);

  return (
    <DurationContext.Provider value={{ duration, setDuration }}>
      {children}
    </DurationContext.Provider>
  );
};
