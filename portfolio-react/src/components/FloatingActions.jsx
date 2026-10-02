import { Link } from 'react-router-dom';

export default function FloatingActions() {
  return (
    <div className="floating-actions" aria-label="Quick links">
      <Link className="floating-action" to="/personal">
        Personal <span aria-hidden="true">↗</span>
      </Link>
      <Link className="floating-action" to="/python-learning-log">
        Python log <span aria-hidden="true">↗</span>
      </Link>
      <a
        className="floating-action floating-action-primary"
        href="/docs/Ricardo_Ngozo_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        View CV <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
