// components/CartButton.jsx
import { useCartStore } from "../store/cart.store";
import { selectCount } from "../store/cart.store"; // o s => Object.values(s.items).reduce...

export default function CartButton() {
  const count = useCartStore(selectCount);

  return (
    <button
      type="button"
      className="btn btn-outline-secondary position-relative"
      data-bs-toggle="offcanvas"
      data-bs-target="#cartDrawer"
      aria-controls="cartDrawer"
    >
      <i className="bi bi-cart me-1" />
      Carrito
      {count > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {count}
        </span>
      )}
    </button>
  );
}
