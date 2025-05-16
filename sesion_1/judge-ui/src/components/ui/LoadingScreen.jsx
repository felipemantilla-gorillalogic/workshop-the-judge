// LoadingScreen.jsx - Pantalla de carga
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-icon">
          <div className="loading-circle"></div>
          <div className="loading-pulse"></div>
          <div className="sphere-container">
            <div className="loading-sphere">
              <div className="sphere-highlight"></div>
              <div className="sphere-highlight secondary"></div>
            </div>
          </div>
        </div>
        <h2>Conectando con The Judge</h2>
        <p>Estableciendo comunicación con los nodos...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;