import { useState } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from '../auth/constants';
import { AuthResponse, AuthResponseError } from '../types/types';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";

export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const goTo = useNavigate();
    const auth = useAuth();

    async function handleSubnit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName,
                    password,
                })
            });

            if (response.ok) {
                console.log("Usuario autenticado correctamente");
                setErrorResponse("");
                const json = (await response.json()) as AuthResponse;

                if (json.body.accessToken && json.body.refreshToken) {
                    auth.saveUser(json);
                    console.log(auth.saveUser(json));
                    // Redirigir basado en el rol del usuario
                    const userRole = json.body.user.role;
                    if (userRole === "Jefe Planta") {
                        goTo("/JefePlantadashboard");
                    } else if (userRole === "Tanquero") {
                        goTo("/TanqueroDashboard");
                    } else if (userRole === "Codificador") {
                        goTo("/CodificadorDashboard");
                    } else {
                        goTo("/login");
                    }
                }

            } else {
                console.log("Algo salió mal");
                const json = await response.json() as AuthResponseError;
                setErrorResponse(json.body.error);
            }

        } catch (error) {
            console.log(error);
        }
    }

    if (auth.isAuthenticated) {
        // Ya está autenticado, entonces redirigimos según el rol
        const userRole = auth.getUser()?.role;
        console.log("Rol del usuario:", userRole);

        if (userRole === 'Jefe Planta') {
            return <Navigate to="/JefePlanta" />;
        } else if (userRole === 'Tanquero') {
            return <Navigate to="/TanqueroDashboard" />;
        } else if (userRole === 'Codificador') {
            return <Navigate to="/CodificadorDashboard" />;
        } else if (userRole === 'ro3') {
            return <Navigate to="/ro3" />;
        } else {
            return <Navigate to="/login" />;
        }
    }

    return (
        <DefaultLayout>
            <h1 className="login">Iniciar Sesión</h1>
            <div className="login-container" style={{ color: 'black' }}>
                {!!errorResponse && <div className='errorMessage'>{errorResponse}</div>}
                <form className="login-form" onSubmit={handleSubnit}>
                    <h5>Usuario</h5>
                    <input type="text" id="username" name="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <h5>Contraseña</h5>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Iniciar</button>
                </form>
            </div>
        </DefaultLayout>
    );
}
