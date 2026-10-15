import { useCallback, useState } from 'react';
import PongLoader from './PongLoader.jsx';

export default function PageEntrance({ children, label }) {
  const [revealed, setRevealed] = useState(false);
  const reveal = useCallback(() => setRevealed(true), []);
  return <div className="page-entrance" data-revealed={revealed}>
    <div className="route-content">{children}</div>
    <PongLoader label={label} onReveal={reveal} />
  </div>;
}
