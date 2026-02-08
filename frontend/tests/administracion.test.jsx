// administracion.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Administracion from '../src/pages/administracion';
import { vi, describe, test, expect, beforeEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Administracion Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('debe redirigir a /acceso-interno si no es admin', async () => {
    localStorage.removeItem('isAdmin');

    render(<MemoryRouter><Administracion /></MemoryRouter>);
    
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/acceso-interno', expect.objectContaining({ replace: true }));
    });
  });

  test('debe cargar la lista de incidentes al montar', async () => {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('token', 'fake-token');

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [{ _id: '1', incidente: 'choque', direccion: 'Calle Falsa 123' }] }),
      })
    );

    render(<MemoryRouter><Administracion /></MemoryRouter>);

    expect(await screen.findByText('Calle Falsa 123')).toBeInTheDocument();
  });
});