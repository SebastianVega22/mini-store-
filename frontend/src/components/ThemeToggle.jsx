import { useEffect, useState } from "react";
import { getInitialTheme, setTheme, applyTheme } from "../theme";

export default function ThemeToggle() {
  const [theme, setState] = useState(getInitialTheme());

  useEffect(() => { applyTheme(theme); }, [theme]);

  const next = () => {
    const order = ["light", "dark", "system"];
    const i = order.indexOf(theme);
    const v = order[(i + 1) % order.length];
    setState(v);
    setTheme(v);
  };

  const label = theme === "light" ? "Claro" : theme === "dark" ? "Oscuro" : "Sistema";
  const icon = theme === "light" ? "bi-sun" : theme === "dark" ? "bi-moon-stars" : "bi-laptop";

  return (
    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={next} title={`Tema: ${label}`}>
      <i className={`bi ${icon} me-2`} />
      {label}
    </button>
  );
}
