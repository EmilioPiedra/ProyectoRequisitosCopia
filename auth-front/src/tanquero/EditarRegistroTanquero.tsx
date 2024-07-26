import { useAuth } from '../auth/AuthProvider';
import TanqueroLayout from '../layout/TanqueroLayout';
import { Outlet } from 'react-router-dom';


export default function EditarRegistroTanquero() {
    const auth = useAuth();

    return (
        <TanqueroLayout>
            <h1>Editar registro tanquero</h1>
            <Outlet />
        </TanqueroLayout>
    );
}
