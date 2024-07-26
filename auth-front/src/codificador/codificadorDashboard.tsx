import { useAuth } from '../auth/AuthProvider';
import CodificadorLayout from '../layout/CodificadorLayout';
import PortalLayout from '../layout/PortalLayout';
import { Outlet } from 'react-router-dom';

export default function codificadorDashboard() {
    const auth = useAuth();


    // Renderizar contenido del dashboard si el rol es 'admin'
    return (
        <CodificadorLayout>
            <h1>Codificador</h1>
        </CodificadorLayout>
    );
}
