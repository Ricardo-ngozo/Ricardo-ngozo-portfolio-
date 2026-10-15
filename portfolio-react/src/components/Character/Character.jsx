import { lazy, Suspense, useEffect } from 'react';
import { loadCharacterBytes } from './characterAsset.js';
import './character.css';

const CharacterScene = lazy(() => import('./CharacterScene.jsx'));

export function CharacterPoster() {
  return <img className="character-poster" src="/images/character-poster.webp"
    width="600" height="490" fetchPriority="high" decoding="sync" alt="" aria-hidden="true" />;
}

export default function Character() {
  useEffect(() => { loadCharacterBytes().catch(() => {}); }, []);
  return <Suspense fallback={<div className="character-wrap" data-state="loading" aria-label="Ricardo's character"><CharacterPoster /></div>}>
    <CharacterScene />
  </Suspense>;
}
