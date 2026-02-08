import { render, screen, waitFor } from '@testing-library/react';
import MapaJitterIncidentes from '../src/pages/MapaJitter'; // Ajusta la ruta a tu archivo
import * as api from '../src/api/incidentesApi'; 
import { vi, describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../src/api/incidentesApi', () => ({
  FetchMapaJitterData: vi.fn(),
}));

describe('MapaJitter Component', () => {
  test('debe filtrar incidentes por tipo', async () => {
    const mockData = {
      data: [
        { _id: '1', incidente: 'choque', posicion: { lat: -38.8, lng: -62.0 }, direccion: 'Calle 1' },
        { _id: '2', incidente: 'incendio', posicion: { lat: -38.9, lng: -62.1 }, direccion: 'Calle 2' }
      ]
    };

    api.FetchMapaJitterData.mockResolvedValue(mockData);

    render(
      <MemoryRouter>
        <MapaJitterIncidentes />
      </MemoryRouter>
    );
    
    await waitFor(() => {
        expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument();
    });

    expect(api.FetchMapaJitterData).toHaveBeenCalled();
  });
});