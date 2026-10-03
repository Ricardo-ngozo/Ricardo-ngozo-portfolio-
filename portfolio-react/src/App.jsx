import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import PersonalPage from './pages/PersonalPage.jsx';
import PythonLogPage from './pages/PythonLogPage.jsx';
import ArchiveCaseStudy from './pages/ArchiveCaseStudy.jsx';
import CaseStudyPage from './pages/CaseStudyPage.jsx';
import Cursor from './components/Cursor.jsx';
import { createPageScope } from './runtime/pageScope.js';
import { mountWorkshop } from './scripts/workshop-core.js';

function LegacyCaseStudy() {
  const location = useLocation();
  return <Navigate replace to={location.pathname.replace(/\.html$/, '') + location.search + location.hash} />;
}

export default function App() {
  const location = useLocation();
  useLayoutEffect(() => {
    const scope = createPageScope();
    mountWorkshop(scope);
    return () => scope.dispose();
  }, []);

  useLayoutEffect(() => {
    const personal = location.pathname === '/personal';
    const lab = location.pathname === '/python-learning-log';
    const archive = location.pathname === '/case-studies/archive';
    const pageClass = personal ? 'personal-body' : lab ? 'python-log-body' : archive ? 'archive-case-body' : '';
    document.body.dataset.page = location.pathname === '/' ? 'tech' : personal ? 'personal' : lab ? 'lab' : 'case-study';
    if (pageClass) document.body.classList.add(pageClass);
    document.title = personal ? 'The Personal Side | Ricardo Ngozo' : lab ? 'Python Learning Lab | Ricardo Ngozo' : 'Ricardo Ngozo | Developer & Creative Technologist';
    return () => {
      if (pageClass) document.body.classList.remove(pageClass);
      document.body.removeAttribute('data-page');
      document.body.classList.remove('is-loading', 'loader-complete', 'dialog-open');
      document.querySelectorAll('.workshop-dialog').forEach(dialog => { if (dialog.open) dialog.close(); });
    };
  }, [location.pathname]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      const id = location.hash.slice(1);
      let target;
      try { target = document.getElementById(decodeURIComponent(id)); } catch { /* Invalid URL escape. */ }
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return <>
    <Cursor />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/personal" element={<PersonalPage />} />
      <Route path="/python-learning-log" element={<PythonLogPage />} />
      <Route path="/case-studies/archive" element={<ArchiveCaseStudy />} />
      <Route path="/case-studies/:slug" element={location.pathname.endsWith('.html') ? <LegacyCaseStudy /> : <CaseStudyPage />} />
      <Route path="/personal.html" element={<Navigate replace to="/personal" />} />
      <Route path="/python-learning-log.html" element={<Navigate replace to="/python-learning-log" />} />
      <Route path="/index.html" element={<Navigate replace to="/" />} />
      <Route path="*" element={<main className="route-not-found"><h1>That page has moved.</h1><a href="/">Return to the portfolio</a></main>} />
    </Routes>
  </>;
}
