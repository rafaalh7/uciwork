import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import L from 'leaflet'

// Solucionar problema de iconos en producción
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const initialLocations = [
  { name: "Madrid", coordinates: [40.4165, -3.70256] },
  { name: "Barcelona", coordinates: [41.3851, 2.1734] },
  { name: "Valencia", coordinates: [39.4699, -0.3763] }
]

const MapEvents = ({ addMarker }) => {
  useMapEvents({
    click: (e) => {
      addMarker(e.latlng)
    },
  })
  return null
}

export default function Mapa() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [locations, setLocations] = useState(initialLocations)

  const addMarker = (coords) => {
    const newLocation = {
      name: `Marcador ${locations.length + 1}`,
      coordinates: [coords.lat, coords.lng]
    }
    setLocations([...locations, newLocation])
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[400px] w-full'}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
      >
        {isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
      </button>

      <MapContainer
        center={[40.4165, -3.70256]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
        whenReady={() => setIsLoading(false)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents addMarker={addMarker} />

        {locations.map((location, index) => (
          <Marker key={index} position={location.coordinates}>
            <Popup>{location.name}</Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
              {location.name}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
