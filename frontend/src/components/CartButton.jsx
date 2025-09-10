import { useCartStore, selectCount } from "../store/cart";

export default function CartButton() {
  const count = useCartStore(selectCount);
  return (
    <button
      className="btn btn-outline-secondary position-relative"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#cartDrawer"
      aria-controls="cartDrawer"
    >
      <i className="bi bi-cart3 me-1" />
      Carrito
      {count > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {count}
        </span>
      )}
    </button>
  );
}
