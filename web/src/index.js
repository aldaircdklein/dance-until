import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/styles/index.css';
import Navigation from './shared/routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>
);
