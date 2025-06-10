import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Reinicia el estado de transición después de cada cambio
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-xl">
      {/* Contenedor principal del carrusel */}
      <div className="relative h-80 md:h-[500px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Slide ${index}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <Button 
        auto 
        flat 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 text-white"
        onClick={goToPrevious}
        icon={<ChevronLeftIcon />}
      />
      
      <Button 
        auto 
        flat 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 text-white"
        onClick={goToNext}
        icon={<ChevronRightIcon />}
      />

      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index 
                ? 'bg-white w-6' 
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Iconos SVG para los botones
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Ejemplo de uso del componente
const App = () => {
  const demoImages = [
    'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
    'https://images.unsplash.com/photo-1706463629335-d92264bbfd6f',
    'https://images.unsplash.com/photo-1682687220198-88e9bdea9931',
    'https://images.unsplash.com/photo-1682687220067-dced9a881b56',
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Carrusel de Imágenes</h1>
      <ImageCarousel images={demoImages} />
    </div>
  );
};

export default App;
