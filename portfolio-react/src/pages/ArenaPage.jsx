import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FloatingActions from '../components/FloatingActions.jsx';
import Footer from '../components/Footer.jsx';
import { createPageScope } from '../runtime/pageScope.js';
import { usePageFeatures } from '../runtime/usePageFeatures.js';

const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const player = board.filter(Boolean).length % 2 ? 'O' : 'X';
  const win = wins.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  const finished = win || board.every(Boolean);
  return <div className="arena-tic">
    <p className="tic-status" role="status">{win ? `${board[win[0]]} wins!` : finished ? 'A draw. One more round?' : `${player}'s turn`}</p>
    <div className="tic-board" role="group" aria-label="Tic-Tac-Toe board">
      {board.map((cell, i) => <button key={i} type="button" disabled={Boolean(finished || cell)}
        className={win?.includes(i) ? 'is-winning' : ''} aria-label={`Cell ${i+1}${cell ? `: ${cell}` : ': empty'}`}
        onClick={() => setBoard(previous => previous.map((value, index) => index === i ? player : value))}>{cell}</button>)}
    </div>
    <button className="workshop-button" type="button" onClick={() => setBoard(Array(9).fill(''))}>Reset board ↻</button>
  </div>;
}

function Pong() {
  const host = useRef(null);
  useEffect(() => {
    const scope = createPageScope();
    window.Workshop.mountRally(host.current, scope);
    return () => scope.dispose();
  }, []);
  return <div className="arena-rally" ref={host} />;
}

function Runner() {
  const [playing, setPlaying] = useState(false);
  return <>
    {playing ? <iframe className="arena-runner" src="/mini-quest-runner/index.html" title="Mini Quest Runner" /> :
      <div className="arena-runner-cover"><span aria-hidden="true">✦</span><p>One more jump.<br />One more crystal.</p>
        <button className="button button-primary" type="button" onClick={() => setPlaying(true)}>Play Mini Quest Runner →</button></div>}
    {playing && <button className="workshop-button" type="button" onClick={() => setPlaying(false)}>Close game</button>}
    <p className="arena-controls">Space, ↑ or W to jump · Click the stage or tap Jump on mobile</p>
  </>;
}

export default function ArenaPage() {
  usePageFeatures('arena');
  return <>
    <a className="skip-link" href="#arena-games">Skip to games</a>
    <header id="arena-top" className="arena-nav"><Link to="/">← Back to portfolio</Link><span>THE PLAYGROUND / 03 GAMES</span></header>
    <main className="arena-main">
      <section className="arena-hero">
        <p className="section-kicker">BUILT TO BE PLAYED</p>
        <h1>Enter the <em>Arena.</em></h1>
        <p>Small games. Real code. A little friendly competition.</p>
        <nav className="arena-jump-links" aria-label="Choose a game"><a href="#runner">Mini Quest ↗</a><a href="#tic-tac-toe">Tic-Tac-Toe ↗</a><a href="#pong">Pong rally ↗</a></nav>
      </section>
      <div className="arena-games" id="arena-games">
        <section className="arena-game arena-game-featured" id="runner">
          <div className="arena-game-heading"><span>01 / ADVENTURE</span><h2>Mini Quest Runner</h2><p>Jump, collect crystals, and find your rhythm.</p></div><Runner />
        </section>
        <section className="arena-game" id="tic-tac-toe">
          <div className="arena-game-heading"><span>02 / TWO PLAYERS</span><h2>Tic-Tac-Toe</h2><p>Share the board. Three in a row takes it.</p></div><TicTacToe />
          <Link className="arena-story" to="/case-studies/tic-tac-toe">Read the build story ↗</Link>
        </section>
        <section className="arena-game" id="pong">
          <div className="arena-game-heading"><span>03 / REFLEXES</span><h2>The five-shot rally</h2><p>You control the coral paddle. Return five shots.</p></div><Pong />
        </section>
      </div>
    </main>
    <Footer topId="arena-top" /><FloatingActions />
  </>;
}
