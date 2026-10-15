import { useEffect, useRef, useState } from 'react';

const roles = [
  'Game Developer',
  'Full-stack Developer',
  'Software Engineer',
  'Front-end Developer',
  'Back-end Developer',
  'Creative Technologist',
];

export default function RotatingRole() {
  const [active, setActive] = useState(0);
  const host = useRef(null);

  useEffect(() => {
    let visible = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(host.current);
    const timer = setInterval(() => {
      if (document.hidden || !visible || reduced.matches || window.Workshop?.calm) return;
      setActive(index => (index + 1) % roles.length);
    }, 3800);
    return () => { clearInterval(timer); observer.disconnect(); };
  }, []);

  return <strong ref={host} className="cinematic-roles">
    <span className="sr-only">Game Developer, Full-stack Developer, Software Engineer, Front-end Developer, Back-end Developer or Creative Technologist</span>
    {roles.map((role, index) => <span key={role} className="cinematic-role-option" data-active={index === active} aria-hidden="true">{role}</span>)}
  </strong>;
}
