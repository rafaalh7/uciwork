// AdvancedMap.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

// Carga diferida de componentes pesados
const MapContainer = dynamic(() => import('./components/MapContainer'), { 
  ssr: false,
  loading: () => <div>Cargando mapa...</div>
});

const LayerController = dynamic(() => import('./components/LayerController'));
const MarkerCluster = dynamic(() => import('./components/MarkerCluster'));
const DrawingTools = dynamic(() => import('./components/DrawingTools'));
const GeoSearch = dynamic(() => import('./components/GeoSearch'));

const AdvancedMap = ({
  initialPosition = [51.505, -0.09],
  initialZoom = 13,
  markers = [],
  apiKeys = {},
  onMapExport,
  onReverseGeocode,
  onFeatureCreated
}) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    traffic: false,
    satellite: false,
    terrain: false
  });
  const [drawingMode, setDrawingMode] = useState(null);
  const mapRef = useRef(null);

  // Efecto para inicializar el mapa una vez montado
  useEffect(() => {
    if (mapInstance) {
      // Configuración inicial del mapa
      console.log('Mapa inicializado', mapInstance);
    }
  }, [mapInstance]);

  return (
    <div className="advanced-map-container" style={{ height: '100%', width: '100%' }}>
      <MapContainer 
        ref={mapRef}
        initialPosition={initialPosition}
        initialZoom={initialZoom}
        onMapInit={setMapInstance}
      />
      
      {mapInstance && (
        <>
          <LayerController 
            map={mapInstance}
            activeLayers={activeLayers}
            onLayerChange={setActiveLayers}
            apiKeys={apiKeys}
          />
          
          <MarkerCluster 
            map={mapInstance}
            markers={markers}
          />
          
          <DrawingTools 
            map={mapInstance}
            mode={drawingMode}
            onModeChange={setDrawingMode}
            onFeatureCreated={onFeatureCreated}
          />
          
          <GeoSearch 
            map={mapInstance}
            onReverseGeocode={onReverseGeocode}
          />
        </>
      )}
    </div>
  );
};

AdvancedMap.propTypes = {
  initialPosition: PropTypes.arrayOf(PropTypes.number),
  initialZoom: PropTypes.number,
  markers: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
  })),
  apiKeys: PropTypes.shape({
    mapbox: PropTypes.string,
    googleMaps: PropTypes.string,
    here: PropTypes.string,
  }),
  onMapExport: PropTypes.func,
  onReverseGeocode: PropTypes.func,
  onFeatureCreated: PropTypes.func,
};

export default AdvancedMap;
