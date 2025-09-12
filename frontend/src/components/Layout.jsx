import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

export default function Layout() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="min-vh-100 d-flex flex-column bg-body">
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">MiniStore</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="mainNav" className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              {/* Botón modo claro/oscuro */}
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                  title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
                >
                  <i className={`bi ${theme === "dark" ? "bi-sun" : "bi-moon-stars"}`} />
                </button>
              </li>

              {/* Botón Admin */}
              <li className="nav-item">
                <Link
                  to="/admin"
                  className="btn btn-outline-primary"
                  aria-label="Abrir panel de administración"
                  title="Admin"
                >
                  <i className="bi bi-gear me-1" /> Admin
                </Link>
              </li>

              {/* Carrito */}
              <li className="nav-item d-flex">
                <CartButton />
              </li>

              {/* GitHub */}
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://github.com/SebastianVega22/mini-store-"
                  target="_blank"
                  rel="noreferrer"
                >
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
