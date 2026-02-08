import { render, screen, fireEvent } from '@testing-library/react';
import IncidentesLista from '../src/pages/IncidentesList';
import * as api from '../src/api/incidentesApi';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../src/api/incidentesApi');

test('debe buscar incidentes al escribir en el buscador', async () => {
  api.FetchIncidentes.mockResolvedValue({ data: [{ _id: '1', incidente: 'choque', patente: 'patente123' }], meta: { pages: 1 } });

  render(<MemoryRouter><IncidentesLista /></MemoryRouter>);

  const input = await screen.findByPlaceholderText(/Buscar por/i);
  const btn = screen.getByRole('button', { name: /Buscar/i });

  fireEvent.change(input, { target: { value: 'patente123' } });
  fireEvent.click(btn);

  expect(api.FetchIncidentes).toHaveBeenCalledWith(1, 'patente123');
});