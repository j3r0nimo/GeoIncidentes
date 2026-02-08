import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginAdmin from '../src/pages/login'; 

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn();

describe('LoginAdmin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('Renderiza el formulario de login correctamente', () => {
    render(<BrowserRouter><LoginAdmin /></BrowserRouter>);
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  it('Realiza el login exitoso y redirecciona', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, token: 'fake-token', user: { username: 'admin' } }),
    });

    render(<BrowserRouter><LoginAdmin /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('isAdmin')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/administracion', { replace: true });
    });
  });

  it('Muestra error si las credenciales son incorrectas', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: 'Credenciales inválidas' }),
    });

    render(<BrowserRouter><LoginAdmin /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});