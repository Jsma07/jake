import React, { useState, useEffect } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';

const DarkModeButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (isDarkMode) {
        rootElement.classList.add('dark');
      } else {
        rootElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className={`px-4 py-2 rounded-md text-white ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-gray-600 dark:bg-gray-300 dark:text-gray-700 dark:hover:bg-gray-400`}
    >
      {isDarkMode ? (
        <>
          <LightModeIcon sx={{ marginRight: '5px' }} /> Claro
        </>
      ) : (
        <>
          <NightlightIcon sx={{ marginRight: '5px' }} /> Oscuro
        </>
      )}
    </button>
  );
};

export default DarkModeButton;
