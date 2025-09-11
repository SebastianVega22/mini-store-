// frontend/src/components/CartDrawer.jsx
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { formatPrice } from "../utils/formatPrice";
import { resolveImage } from "../utils/resolveImage";

const fallbackThumb = (sku) =>
  `https://picsum.photos/seed/${encodeURIComponent(sku || "product")}/64/48`;

export default function CartDrawer() {
  const navigate = useNavigate();

  const items  = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear  = useCartStore((s) => s.clear);

  const list = useMemo(() => Object.values(items), [items]);
  const total = useMemo(() => list.reduce((a, i) => a + i.qty * i.price, 0), [list]);

  const goCheckout = (e) => {
    e.preventDefault();
    if (!list.length) return;

    const el = document.getElementById("cartDrawer");
    const hasBS = !!window.bootstrap?.Offcanvas;

    if (el && hasBS) {
      const off = window.bootstrap.Offcanvas.getOrCreateInstance(el);
      const onHidden = () => {
        el.removeEventListener("hidden.bs.offcanvas", onHidden);
        navigate("/checkout");
      };
      el.addEventListener("hidden.bs.offcanvas", onHidden, { once: true });
      off.hide();
      return;
    }

    if (el?.classList.contains("show")) {
      el.classList.remove("show");
      document.querySelector(".offcanvas-backdrop")?.remove();
      document.body.classList.remove("offcanvas-backdrop", "modal-open");
    }
    navigate("/checkout");
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartDrawer"
      aria-labelledby="cartDrawerLabel"
    >
      <div className="offcanvas-header">
        <h5 id="cartDrawerLabel" className="mb-0">Tu carrito</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Cerrar"
        />
      </div>

      <div className="offcanvas-body d-flex flex-column">
        {list.length === 0 ? (
          <p className="text-body-secondary">Aún no has agregado productos.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {list.map((i) => (
              <li key={i.sku} className="list-group-item d-flex gap-3 align-items-center">
                <img
                  src={resolveImage(i.image)}
                  onError={(e) => { e.currentTarget.src = fallbackThumb(i.sku); }}
                  alt={i.name}
                  width="64"
                  height="48"
                  className="rounded border object-fit-cover"
                  loading="lazy"
                  decoding="async"
                />

                <div className="flex-grow-1">
                  <div className="fw-semibold small text-truncate" title={i.name}>{i.name}</div>
                  <div className="text-body-secondary small">{formatPrice(i.price)}</div>
                </div>

                <input
                  type="number"
                  min={1}
                  className="form-control form-control-sm"
                  style={{ width: 80 }}
                  value={i.qty}
                  onChange={(e) => setQty(i.sku, Math.max(1, Number(e.target.value) || 1))}
                />

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => remove(i.sku)}
                  aria-label="Quitar"
                >
                  <i className="bi bi-trash" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between">
            <span className="fw-semibold">Total</span>
            <span className="fw-bold">{formatPrice(total)}</span>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-50"
              onClick={clear}
              disabled={list.length === 0}
            >
              Vaciar
            </button>

            <button
              type="button"
              className="btn btn-primary w-50"
              onClick={goCheckout}
              disabled={list.length === 0}
            >
              Finalizar
            </button>
          </div>

          <div className="text-center mt-2">
            <Link to="/" data-bs-dismiss="offcanvas">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
