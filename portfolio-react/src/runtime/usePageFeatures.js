import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageScope } from './pageScope.js';
import { initHomePage } from '../scripts/init-home.js';
import { initPortfolioUX } from '../scripts/portfolio-ux.js';
import { initExplorer } from '../scripts/workshop-explorer.js';
import { initGlobe } from '../scripts/workshop-globe.js';
import { initPets } from '../scripts/workshop-pets.js';
import { initStudioMotion } from '../scripts/studio-motion.js';

export function usePageFeatures(page, identity = '') {
  const navigate = useNavigate();
  useEffect(() => {
    const scope = createPageScope();
    scope.navigate = navigate;
    const features = [
      ...(page === 'home' ? [initHomePage, initGlobe] : []),
      initPortfolioUX, initExplorer, initPets, initStudioMotion,
    ];
    features.forEach(init => {
      try { init(scope); }
      catch (error) { console.error(`Could not initialize ${init.name}`, error); }
    });
    return () => scope.dispose();
  }, [page, identity, navigate]);
}
