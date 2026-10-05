import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageScope } from './pageScope.js';
import { initHomePage } from '../scripts/init-home.js';
import { initPortfolioUX } from '../scripts/portfolio-ux.js';
import { initExplorer } from '../scripts/workshop-explorer.js';
import { initGlobe } from '../scripts/workshop-globe.js';



export function usePageFeatures(page, identity = '') {
  const navigate = useNavigate();
  useEffect(() => {
    const scope = createPageScope();
    scope.navigate = navigate;
    const features = [
      ...(page === 'home' ? [initHomePage, initGlobe] : []),
      initPortfolioUX, initExplorer,
    ];
    features.forEach(init => {
      try { init(scope); }
      catch (error) { console.error(`Could not initialize ${init.name}`, error); }
    });
    // Decorative effects should not compete with the first render or character download.
    let cancelled = false;
    const startDecorations = () => {
      Promise.allSettled([
        import('../scripts/workshop-pets.js'),
        import('../scripts/studio-motion.js'),
      ]).then(results => {
        if (cancelled) return;
        results.forEach((result, index) => {
          if (result.status !== 'fulfilled') return;
          const init = index === 0 ? result.value.initPets : result.value.initStudioMotion;
          try { init(scope); } catch (error) { console.error('Decoration unavailable', error); }
        });
      });
    };
    let idle;
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) idle = requestIdleCallback(startDecorations, { timeout: 1500 });
      else startDecorations();
    }, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (idle !== undefined) cancelIdleCallback(idle);
      scope.dispose();
    };
  }, [page, identity, navigate]);
}
