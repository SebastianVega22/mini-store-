// frontend/src/pages/CheckoutConfirmation.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCheckoutStore } from "../store/checkout.Store";

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const lastOrder = useCheckoutStore((s) => s.lastOrder);
  const clearCheckout = useCheckoutStore((s) => s.clearCheckout);

  useEffect(() => {
    if (!lastOrder) navigate("/");
  }, [lastOrder, navigate]);

  if (!lastOrder) return null;

  return (
    <div className="container py-5 text-center">
      <h2 className="mb-3">¡Compra simulada exitosa!</h2>
      <p className="lead">Código de orden:</p>
      <div className="display-6 fw-bold">{lastOrder.code}</div>
      <p className="mt-3">Total pagado: <strong>${lastOrder.total.toLocaleString()}</strong></p>
      <div className="mt-4 d-flex justify-content-center gap-2">
        <Link className="btn btn-primary" to="/" onClick={clearCheckout}>Volver a la tienda</Link>
      </div>
    </div>
  );
}
