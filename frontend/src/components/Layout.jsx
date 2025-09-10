import { Link, Outlet } from "react-router-dom";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-body">
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">MiniStore</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="mainNav" className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item d-flex">
                <CartButton />
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://github.com/SebastianVega22/mini-store-" target="_blank" rel="noreferrer">
                  <i className="bi bi-github me-1" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>

      <footer className="border-top py-4 text-center text-muted small">
        © {new Date().getFullYear()} MiniStore
      </footer>

      {/* Offcanvas de carrito */}
      <CartDrawer />
    </div>
  );
}
