import logoImage from "../imagenes/ecolac-logo.jpg";

interface DefaultLayoutProps {
    children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <>
            <header>
                <nav className="navbar navbar-dark bg-be0f30 custom-navbar">
                    <div className="container-fluid" >
                        <div className="navbar-brand d-flex align-items-center">
                            <img
                                src={logoImage}
                                alt="Logo"
                                style={{ width: "250px", height: "100px", marginRight: "15px" }}
                            />
                        </div>
                        <div className="d-flex align-items-center">
                        </div>
                    </div >
                </nav >
            </header>
            <main>{children}</main>
        </>
    );
}