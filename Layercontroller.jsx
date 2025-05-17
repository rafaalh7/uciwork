// components/LayerController.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyLoading } from '../hooks/useLazyLoading';

const LayerController = ({ map, activeLayers, onLayerChange, apiKeys }) => {
  const [loadedLayers, setLoadedLayers] = useState({});
  const { loadScript, loadStyle } = useLazyLoading();

  // Carga diferida de capas
  useEffect(() => {
    const loadLayer = async (layerName) => {
      if (activeLayers[layerName] && !loadedLayers[layerName]) {
        try {
          switch (layerName) {
            case 'traffic':
              await loadScript('https://unpkg.com/leaflet.traffic@1.0.0/dist/leaflet.traffic.min.js');
              const trafficLayer = new L.TrafficLayer().addTo(map);
              setLoadedLayers(prev => ({ ...prev, traffic: trafficLayer }));
              break;
              
            case 'satellite':
              await loadScript('https://unpkg.com/leaflet-providers@1.13.0/leaflet-providers.js');
              const satelliteLayer = L.tileLayer.provider('Esri.WorldImagery').addTo(map);
              setLoadedLayers(prev => ({ ...prev, satellite: satelliteLayer }));
              break;
              
            // Más capas pueden ser añadidas aquí
          }
        } catch (error) {
          console.error(`Error loading ${layerName} layer:`, error);
        }
      } else if (!activeLayers[layerName] && loadedLayers[layerName]) {
        map.removeLayer(loadedLayers[layerName]);
        setLoadedLayers(prev => ({ ...prev, [layerName]: null }));
      }
    };

    Object.keys(activeLayers).forEach(layerName => loadLayer(layerName));
  }, [activeLayers, map, loadedLayers, loadScript]);

  return (
    <div className="layer-controls">
      <button onClick={() => onLayerChange({ ...activeLayers, traffic: !activeLayers.traffic })}>
        {activeLayers.traffic ? 'Ocultar Tráfico' : 'Mostrar Tráfico'}
      </button>
      <button onClick={() => onLayerChange({ ...activeLayers, satellite: !activeLayers.satellite })}>
        {activeLayers.satellite ? 'Vista Mapa' : 'Vista Satélite'}
      </button>
    </div>
  );
};

LayerController.propTypes = {
  map: PropTypes.object,
  activeLayers: PropTypes.object,
  onLayerChange: PropTypes.func,
  apiKeys: PropTypes.object,
};

export default LayerController;
