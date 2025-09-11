// frontend/src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../services/http";
import { formatPrice } from "../utils/formatPrice";
import { useCartStore } from "../store/cart.store";
import { resolveImage } from "../utils/resolveImage"; // 👈 Usa el util que ya prefija el backend

const FALLBACK = (seed) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed || "product")}/800/600`;

export default function ProductDetail() {
  const { sku } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [qty, setQty] = useState(1);

  const add = useCartStore((s) => s.add);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await http.get(`/products/${sku}`);
        if (alive) {
          setP(data);
          setQty(1);
        }
      } catch (e) {
        console.error(e);
        if (alive) setErr("No se pudo cargar el producto.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [sku]);

  if (loading) return <div className="py-5 text-center">Cargando…</div>;

  if (err || !p) {
    return (
      <div className="py-5 text-center">
        <p className="text-danger">{err || "Producto no encontrado."}</p>
        <Link to="/" className="btn btn-outline-secondary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const maxStock = typeof p.stock === "number" && p.stock > 0 ? p.stock : 0;

  const clamp = (n) => {
    const v = Math.max(1, Math.floor(n || 1));
    return maxStock ? Math.min(maxStock, v) : v;
  };

  const handleAddQty = () => {
    if (maxStock === 0) return;
    add(p, clamp(qty));
  };

  const handleAddOne = () => {
    if (maxStock === 0) return;
    add(p, 1);
  };

  const imgSrc = resolveImage(p.images?.[0]); // 👈 Esto soporta http(s) y rutas relativas
  const onImgError = (e) => {
    e.currentTarget.src = FALLBACK(p?.sku);
    e.currentTarget.onerror = null;
  };

  return (
    <div className="row g-4">
      <div className="col-md-6">
        {/* Marco con proporción fija para consistencia visual */}
        <div className="ratio ratio-4x3 rounded-3 border overflow-hidden">
          <img
            src={imgSrc}
            onError={onImgError}
            alt={p.name}
            loading="lazy"
            decoding="async"
            className="w-100 h-100 object-fit-cover"
          />
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <Link to="/" className="small text-decoration-underline">
              ← Volver
            </Link>

            <h1 className="h3 fw-bold mt-2">{p.name}</h1>
            {p.category && <div className="text-body-secondary">{p.category}</div>}

            <div className="fs-3 fw-bold mt-3">{formatPrice(p.price)}</div>

            {p.description && <p className="mt-3">{p.description}</p>}

            <dl className="row small text-body-secondary mt-2 mb-3">
              <dt className="col-sm-3">SKU</dt>
              <dd className="col-sm-9">{p.sku}</dd>

              <dt className="col-sm-3">Stock</dt>
              <dd className="col-sm-9">
                {maxStock > 0 ? maxStock : <span className="text-danger">Sin stock</span>}
              </dd>
            </dl>

            {/* Controles de cantidad + acciones */}
            <div className="d-flex align-items-center gap-2">
              <div className="input-group" style={{ maxWidth: 180 }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQty((n) => clamp(n - 1))}
                  aria-label="Disminuir"
                  disabled={maxStock === 0}
                >
                  <i className="bi bi-dash-lg"></i>
                </button>
                <input
                  className="form-control text-center"
                  type="number"
                  min={1}
                  max={maxStock || undefined}
                  value={qty}
                  onChange={(e) => setQty(clamp(Number(e.target.value)))}
                  disabled={maxStock === 0}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQty((n) => clamp(n + 1))}
                  aria-label="Aumentar"
                  disabled={maxStock === 0}
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>

              <button
                onClick={handleAddOne}
                className="btn btn-outline-primary"
                title="Agregar +1 al carrito"
                disabled={maxStock === 0}
              >
                <i className="bi bi-plus-lg me-1" />
                1
              </button>
            </div>

            <button
              onClick={handleAddQty}
              className="btn btn-primary w-100 mt-3"
              disabled={maxStock === 0}
            >
              <i className="bi bi-cart-plus me-2" />
              {maxStock === 0 ? "Sin stock" : `Agregar ${qty} al carrito`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
