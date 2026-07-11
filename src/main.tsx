import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { FleetProvider } from './app/context/FleetContext.tsx';
import 'leaflet/dist/leaflet.css';
import './styles/design-system.css';
import './styles/index.css';
import './styles/globals.css';

creatRoot(document.getElementById('root')!).render(
  <FleetProvider>
    <App />
  </FleetProvider>
);
