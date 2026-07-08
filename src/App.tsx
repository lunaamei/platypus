import { AnimatePresence } from 'framer-motion';
import { useSessionStore } from './store/sessionStore';
import { Home } from './pages/Home';
import { Planning } from './pages/Planning';
import { Session } from './pages/Session';
import './index.css';

export default function App() {
  const phase = useSessionStore((s) => s.phase);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #100d1a 100%)' }}>
      <AnimatePresence mode="wait">
        {phase === 'welcome' && <Home key="welcome" />}
        {phase === 'planning' && <Planning key="planning" />}
        {(phase === 'session' || phase === 'complete') && <Session key="session" />}
      </AnimatePresence>
    </div>
  );
}
