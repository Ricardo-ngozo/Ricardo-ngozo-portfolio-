export default function Footer({ topId = 'home' }) {
  return (
    <footer className="site-footer">
      <a className="footer-brand" href={`#${topId}`}>
        Ricardo Ngozo<span>.</span>
      </a>
      <span>Built with curiosity in South Africa.</span>
      <div>
        <a href="https://github.com/Ricardo-ngozo" target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href={`#${topId}`}>Back to top ↑</a>
      </div>
    </footer>
  );
}
