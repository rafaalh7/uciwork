// components/MarkerCluster.jsx
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLazyLoading } from '../../hooks/useLazyLoading';

const MarkerCluster = ({ map, markers }) => {
  const { loadScript, loadStyle } = useLazyLoading();
  const markerClusterGroup = useRef(null);

  // Carga diferida de la librería de clustering
  useEffect(() => {
    const initCluster = async () => {
      if (!window.MarkerClusterGroup) {
        await loadScript('https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js');
        await loadStyle('https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css');
        await loadStyle('https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css');
      }
      
      if (map && markers?.length) {
        if (markerClusterGroup.current) {
          map.removeLayer(markerClusterGroup.current);
        }
        
        markerClusterGroup.current = new L.MarkerClusterGroup({
          maxClusterRadius: 80,
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true
        });
        
        markers.forEach(markerData => {
          const marker = L.marker(markerData.position, {
            title: markerData.title,
            icon: markerData.icon ? L.icon({ iconUrl: markerData.icon }) : null
          });
          
          if (markerData.popup) {
            marker.bindPopup(markerData.popup);
          }
          
          markerClusterGroup.current.addLayer(marker);
        });
        
        map.addLayer(markerClusterGroup.current);
      }
    };
    
    initCluster();
    
    return () => {
      if (markerClusterGroup.current) {
        map.removeLayer(markerClusterGroup.current);
      }
    };
  }, [map, markers, loadScript, loadStyle]);

  return null;
};

MarkerCluster.propTypes = {
  map: PropTypes.object,
  markers: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    popup: PropTypes.string,
  })),
};

export default MarkerCluster;
