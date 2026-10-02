import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import PersonalPage from './pages/PersonalPage.jsx';
import PythonLogPage from './pages/PythonLogPage.jsx';
import ArchiveCaseStudy from './pages/ArchiveCaseStudy.jsx';
import CaseStudyPage from './pages/CaseStudyPage.jsx';
import Cursor from './components/Cursor.jsx';

// Run workshop-core (the global Workshop object) once at app level
import './scripts/workshop-core.js';

export default function App() {
  const location = useLocation();

  // Scroll to top on route change and reset body classes
  useEffect(() => {
    window.scrollTo(0, 0);
    // Remove page-specific body classes from prior route
    document.body.classList.remove(
      'personal-body',
      'python-log-body',
      'archive-case-body',
      'is-loading',
      'loader-complete'
    );
  }, [location.pathname]);

  return (
    <>
      <Cursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/personal" element={<PersonalPage />} />
        <Route path="/python-learning-log" element={<PythonLogPage />} />
        <Route path="/case-studies/archive" element={<ArchiveCaseStudy />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
      </Routes>
    </>
  );
}
