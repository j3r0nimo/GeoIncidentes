import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- AGREGAR ESTO ---
// Mock para matchMedia (Requerido por React-Bootstrap Offcanvas)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver (Necesario para Chart.js)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Tus otros mocks (Leaflet, API_KEY, etc)...
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: ({ children }) => <div>{children}</div>,
  useMapEvents: () => ({}),
  CircleMarker: ({ children }) => <div>{children}</div>,
}));

vi.stubEnv('VITE_API_KEY', 'test-api-key');
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');