import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_URL = `${BASE_URL}/api/auth`;
    const API_KEY = import.meta.env.VITE_API_KEY;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {

                localStorage.setItem('token', data.token);

                localStorage.setItem('adminName', data.user.username);
                localStorage.setItem('isAdmin', 'true');

                navigate('/administracion', { replace: true });
            } else {
                setError(data.error || "Usuario o contraseña incorrectos");
            }
        } catch (err) {
            console.error("Error conectando con el servidor", err);
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Acceso Administrativo</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor='username' className="form-label">Usuario</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className="form-control"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor='password' className="form-label">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="form-control"
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger text-center p-2" role="alert">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-dark w-100 mt-2">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};