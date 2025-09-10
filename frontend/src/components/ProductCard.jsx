import { memo } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

// Helpers locales para resolver imagen y fallback
const resolveImage = (p, size = "400/300") => {
  const first = p?.images?.[0];
  if (!first) {
    return `https://picsum.photos/seed/${encodeURIComponent(p?.sku || "product")}/${size}`;
  }
  // Si el backend devuelve '/img/...', Vite lo sirve desde /public; si es http, úsalo tal cual
  return first.startsWith("http") ? first : first;
};

const onImgError = (p, size = "400/300") => (e) => {
  e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(p?.sku || "product")}/${size}`;
};

function Card({ p }) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={resolveImage(p)}
        onError={onImgError(p)}
        alt={p.name}
        width="400"
        height="300"
        loading="lazy"
        decoding="async"
        className="card-img-top fit-cover"
      />
      <div className="card-body">
        <h5 className="card-title mb-1">
          <Link to={`/product/${p.sku}`} className="stretched-link">
            {p.name}
          </Link>
        </h5>
        <div className="text-body-secondary small">{p.category}</div>
        <div className="fw-bold fs-5 mt-2">{formatPrice(p.price)}</div>
      </div>
    </div>
  );
}
export default memo(Card);
