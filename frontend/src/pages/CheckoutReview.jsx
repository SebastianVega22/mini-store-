// frontend/src/pages/CheckoutReview.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { useCheckoutStore } from "../store/checkout.store";
import { createOrder } from "../services/orders.service";
import { formatPrice } from "../utils/formatPrice";

export default function CheckoutReview() {
  const navigate = useNavigate();

  // 1) Suscripción estable: solo al OBJETO items del store
  const itemsObj = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  // 2) Derivar datos con useMemo (NO en el selector del store)
  const list = useMemo(() => Object.values(itemsObj), [itemsObj]);
  const hasItems = useMemo(() => Object.keys(itemsObj).length > 0, [itemsObj]);

  // 3) Shipping: leemos el objeto, pero derivamos booleano estable
  const shipping = useCheckoutStore((s) => s.shipping);
  const resetCheckout = useCheckoutStore((s) => s.reset);
  const hasShipping = useMemo(
    () =>
      Boolean(
        shipping?.fullName &&
        shipping?.address &&
        shipping?.city
      ),
    [shipping]
  );

  // 4) Guards de navegación: dependen SOLO de booleanos/valores primitivos
  useEffect(() => {
    if (!hasItems) navigate("/");
  }, [hasItems, navigate]);

  useEffect(() => {
    if (hasItems && !hasShipping) navigate("/checkout");
  }, [hasItems, hasShipping, navigate]);

  // 5) Totales
  const taxRate = Number(import.meta.env.VITE_TAX_RATE || 0);
  const subtotal = useMemo(
    () => list.reduce((a, i) => a + i.price * i.qty, 0),
    [list]
  );
  const taxes = useMemo(
    () => Math.round(subtotal * taxRate * 100) / 100,
    [subtotal, taxRate]
  );
  const total = useMemo(
    () => Math.round((subtotal + taxes) * 100) / 100,
    [subtotal, taxes]
  );

  // 6) Confirmar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        items: list.map(({ sku, name, price, qty, image }) => ({
          sku,
          name,
          price,
          qty,
          image,
        })),
        shipping,
      };

      const res = await createOrder(payload);

      clearCart();
      resetCheckout();

      navigate("/checkout/confirmation", { state: res });
    } catch (e) {
      setError(e?.message || "Error al confirmar el pedido");
    } finally {
      setLoading(false);
    }
  }, [list, shipping, clearCart, resetCheckout, navigate]);

  if (!hasItems || !hasShipping) return null;

  return (
    <div className="container py-4">
      <h2 className="mb-3">Revisión de pedido</h2>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">Artículos</div>
            <ul className="list-group list-group-flush">
              {list.map((it) => (
                <li key={it.sku} className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src={it.image || `https://picsum.photos/seed/${encodeURIComponent(it.sku)}/56/56`}
                    width={56}
                    height={56}
                    alt={it.name}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{it.name}</div>
                    <div className="text-muted small">SKU: {it.sku}</div>
                  </div>
                  <div className="text-nowrap">
                    {it.qty} × {formatPrice(it.price)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card mb-3">
            <div className="card-header">Envío</div>
            <div className="card-body">
              <div>{shipping.fullName}</div>
              <div className="text-muted small">
                {shipping.email} · {shipping.phone}
              </div>
              <div className="text-muted small">
                {shipping.address}, {shipping.city}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Totales</div>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span>Subtotal</span><strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Impuestos ({(taxRate * 100).toFixed(0)}%)</span><strong>{formatPrice(taxes)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5">
                <span>Total</span><strong>{formatPrice(total)}</strong>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-light" onClick={() => navigate("/checkout")}>
              Volver
            </button>
            <button className="btn btn-primary" onClick={confirm} disabled={loading}>
              {loading ? "Confirmando..." : "Confirmar pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
