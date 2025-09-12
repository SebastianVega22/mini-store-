// frontend/src/components/AdminGuard.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { getAdminToken, setAdminToken } from "../utils/adminToken";

export default function AdminGuard() {
  const [token, setToken] = useState(getAdminToken());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    setAdminToken(token.trim());
    // al guardar, solo re-renderizamos este componente
    window.location.reload();
  };

  if (!getAdminToken()) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header">Mini Admin</div>
              <div className="card-body">
                <p className="text-muted small">
                  Ingresa el <code>ADMIN_TOKEN</code> para continuar.
                </p>
                <form onSubmit={handleSubmit} className="d-grid gap-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="dev-123"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <button className="btn btn-primary" type="submit">
                    Acceder
                  </button>
                </form>
                <div className="text-muted small mt-3">
                  El backend validará el token en el header
                  <code> x-admin-token</code>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
