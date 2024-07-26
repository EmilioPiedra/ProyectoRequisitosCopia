import { useAuth } from '../auth/AuthProvider';
import TanqueroLayout from '../layout/TanqueroLayout';
import { Outlet, useNavigate, Link } from 'react-router-dom';


export default function TanqueroDashboard() {
    const auth = useAuth();
    const user = auth.getUser();
    const navigate = useNavigate(); // Hook para navegar a otras rutas


    return (
        <TanqueroLayout>
            <div className="dashboard-container">
                <h1>Tanquero</h1>
                <div className="welcome-message">
                    <strong>Bienvenido @</strong> {user?.userName}
                </div>
                <div className="button-container">
                    <Link to="/nuevoRegistroTanquero">
                        <button className="btn btn-primary">Nuevo Registro</button>
                    </Link>
                    <Link to="/historialRegistroTanquero">
                        <button className="btn btn-secondary">Historial</button>
                    </Link>
                </div>
            </div>
            <Outlet />
        </TanqueroLayout>
    );
}

