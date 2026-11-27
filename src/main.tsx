import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

const launchEl = document.getElementById('v4-launch');
if (launchEl) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(
    () => {
      launchEl.classList.add('is-done');
      window.setTimeout(() => launchEl.remove(), reduced ? 20 : 250);
    },
    reduced ? 20 : 860,
  );
}
