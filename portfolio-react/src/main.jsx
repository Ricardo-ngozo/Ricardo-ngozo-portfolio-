import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

// All CSS — same load order as the original HTML
import './styles.css';
import './portfolio-ux.css';
import './atelier-theme.css';
import './workshop.css';
import './studio-theme.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
