// frontend/src/pages/admin/AdminLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken, getAdminToken } from "../../utils/adminToken";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin", { replace: true });
    // Forzar refresh del guard
    window.location.reload();
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-body">
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/admin">Mini Admin</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="adminNav" className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/admin/products" className="nav-link">Productos</Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/products/new" className="nav-link">Crear</Link>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <Link to="/" className="btn btn-sm btn-outline-secondary">← Volver a la tienda</Link>
              </li>
              <li className="nav-item">
                <span className="text-muted small d-none d-md-inline me-2">
                  Token: <code>{getAdminToken() ? "●●●●●●" : "—"}</code>
                </span>
              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                  Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>

      <footer className="border-top py-4 text-center text-muted small">
        Mini Admin · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
