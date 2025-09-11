import { createContext, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const api = useMemo(() => ({
    show: (message, type = "success", ms = 3000) => {
      const id = crypto.randomUUID();
      setToasts(t => [...t, { id, message, type }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ms);
    }
  }), []);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1080 }}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(t => (
          <div key={t.id} className={`toast align-items-center text-bg-${t.type} show mb-2`} role="status">
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto"
                      aria-label="Cerrar"
                      onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
