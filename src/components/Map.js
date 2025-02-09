import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db, auth } from './firebase'; // Firebase config
import 'tailwindcss/tailwind.css'; // Tailwind CSS

const ThailandMap = () => {
  const [diaryData, setDiaryData] = useState({}); // Store user's diary data
  const [hoverData, setHoverData] = useState(null); // Store hover data for provinces
  const [showTooltip, setShowTooltip] = useState(false); // Control tooltip visibility
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Tooltip position

  const updateMapWithSavedProvinces = (data) => {
    const savedProvinces = Object.keys(data);
    if (window.simplemaps_countrymap && window.simplemaps_countrymap_mapdata) {
      const mapData = window.simplemaps_countrymap.mapdata;
  
      Object.keys(mapData.state_specific).forEach((provinceCode) => {
        const province = mapData.state_specific[provinceCode];
        const matchedProvinceKey = savedProvinces.find(
          (key) => data[key].stateName === province.name
        );
  
        if (matchedProvinceKey) {
          province.color = '#00FF00'; // Set saved provinces to green
          const provinceData = data[matchedProvinceKey];
  
          province.description = `
            Date: ${provinceData.date}<br>
            Description: ${provinceData.description}
          `;
        } else {
          province.color = mapData.main_settings.state_color; // Reset others
        }
      });
  
      window.simplemaps_countrymap.load(); // Ensure the map reloads after updates
    } else {
      console.error('Map data is missing or corrupted.');
    }
  };
  

  useEffect(() => {
    const user = auth.currentUser; // Get current user
    if (user) {
      const diaryRef = ref(db, `diaries/${user.uid}`);
      onValue(diaryRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setDiaryData(data); // Update state with the latest diary data
          updateMapWithSavedProvinces(data); // Update map display
        } else {
          console.log('No diary data found');
        }
      });
    }
  }, []); //update sent.
  

  // Load map on first render
  useEffect(() => {
    const mapDataScript = document.createElement('script');
    mapDataScript.src = '/mapdata.js';
    mapDataScript.async = false;

    const countryMapScript = document.createElement('script');
    countryMapScript.src = '/countrymap.js';
    countryMapScript.async = false;

    countryMapScript.onload = () => {
      document.body.appendChild(mapDataScript);

      mapDataScript.onload = () => {
        if (window.simplemaps_countrymap && window.simplemaps_countrymap_mapdata) {
          window.simplemaps_countrymap.mapdata = window.simplemaps_countrymap_mapdata;
          window.simplemaps_countrymap.load(); // Load the map
        } else {
          console.error('Map data is missing or corrupted.');
        }
      };
    };

    document.body.appendChild(countryMapScript);

    return () => {
      if (mapDataScript && document.body.contains(mapDataScript)) {
        document.body.removeChild(mapDataScript);
      }
      if (countryMapScript && document.body.contains(countryMapScript)) {
        document.body.removeChild(countryMapScript);
      }
    };
  }, []);

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      {showTooltip && hoverData && (
        <div
          className="absolute bg-gray-800 text-white p-2 rounded shadow-lg"
          style={{ top: `${tooltipPosition.y + 10}px`, left: `${tooltipPosition.x + 10}px` }}
        >
          <h4 className="font-bold">{hoverData.stateName}</h4>
          <p>{hoverData.date}</p>
          <p>{hoverData.description}</p>
          {hoverData.imageUrl && (
            <img
              src={hoverData.imageUrl}
              alt={hoverData.stateName}
              className="w-24 h-24 object-cover mt-2"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ThailandMap;
