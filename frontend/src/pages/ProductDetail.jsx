import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../services/http";
import { formatPrice } from "../utils/formatPrice";

// Helpers locales para imagen (con placeholder si falla/no existe)
const resolveImage = (p, size = "800/600") => {
  const first = p?.images?.[0];
  if (!first) return `https://picsum.photos/seed/${encodeURIComponent(p?.sku || "product")}/${size}`;
  return first.startsWith("http") ? first : first; // si viene como "/img/..." lo dejamos
};
const onImgError = (p, size = "800/600") => (e) => {
  e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(p?.sku || "product")}/${size}`;
};

export default function ProductDetail() {
  const { sku } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await http.get(`/products/${sku}`);
        if (alive) setP(data);
      } catch (e) {
        console.error(e);
        if (alive) setErr("No se pudo cargar el producto.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [sku]);

  if (loading) {
    return <div className="py-5 text-center">Cargando…</div>;
  }

  if (err || !p) {
    return (
      <div className="py-5 text-center">
        <p className="text-danger">{err || "Producto no encontrado."}</p>
        <Link to="/" className="btn btn-outline-secondary">Volver al catálogo</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    // TODO: Integrar con el store de carrito en v0.5.0
    alert(`Añadido al carrito: ${p.name}`);
  };

  return (
    <div className="row g-4">
      <div className="col-md-6">
        <img
          className="img-fluid rounded-3 border"
          src={resolveImage(p)}
          onError={onImgError(p)}
          alt={p.name}
          width="800"
          height="600"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <Link to="/" className="small text-decoration-underline">← Volver</Link>

            <h1 className="h3 fw-bold mt-2">{p.name}</h1>
            {p.category && <div className="text-body-secondary">{p.category}</div>}

            <div className="fs-3 fw-bold mt-3">{formatPrice(p.price)}</div>

            {p.description && <p className="mt-3">{p.description}</p>}

            <dl className="row small text-body-secondary mt-2 mb-0">
              <dt className="col-sm-3">SKU</dt>
              <dd className="col-sm-9">{p.sku}</dd>
              {typeof p.stock === "number" && (
                <>
                  <dt className="col-sm-3">Stock</dt>
                  <dd className="col-sm-9">{p.stock}</dd>
                </>
              )}
            </dl>

            <button onClick={handleAddToCart} className="btn btn-primary w-100 mt-4">
              <i className="bi bi-cart-plus me-2" />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
