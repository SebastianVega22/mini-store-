// frontend/src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { listProducts } from "../services/products.service";
import { resolveImage } from "../utils/resolveImage";

const DEFAULTS = {
  page: "1",
  limit: "12",
  search: "",
  category: "",
  sort: "price",
  order: "asc",
};

export default function Home() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 12 });

  // Valores desde la URL (con fallback)
  const page     = params.get("page")     || DEFAULTS.page;
  const limit    = params.get("limit")    || DEFAULTS.limit;
  const search   = params.get("search")   ?? DEFAULTS.search;
  const category = params.get("category") ?? DEFAULTS.category;
  const sort     = params.get("sort")     || DEFAULTS.sort;
  const order    = params.get("order")    || DEFAULTS.order;

  // Input controlado para la búsqueda
  const [q, setQ] = useState(search);
  useEffect(() => setQ(search), [search]);

  // Query para la API
  const query = useMemo(
    () => ({
      page: Number(page) || 1,
      limit: Number(limit) || 12,
      search: search || undefined,
      category: category || undefined,
      sort,
      order,
    }),
    [page, limit, search, category, sort, order]
  );

  // Cargar catálogo
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await listProducts(query);
        if (!alive) return;
        setItems(data.items || []);
        setMeta({
          total: data.total || 0,
          page: data.page || 1,
          pageSize: data.pageSize || Number(limit),
        });
      } catch {
        toast.show("No se pudo cargar el catálogo", "danger");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [query, toast, limit]);

  // Helpers para actualizar URL
  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    next.set("page", "1"); // reset de paginación al cambiar filtros
    setParams(next, { replace: true });
  };

  const clearAll = () => {
    setParams(DEFAULTS, { replace: true });
    setQ(DEFAULTS.search);
    toast.show("Filtros limpiados", "secondary");
  };

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

  const FALLBACK = "https://picsum.photos/seed/prod/800/600";
  const onImgError = (e) => {
    e.currentTarget.src = FALLBACK;
    e.currentTarget.onerror = null;
  };

  return (
    <div className="container">
      <h1 className="mb-3">Catálogo</h1>

      {/* Filtros */}
      <form className="row gy-3 align-items-end" role="search" aria-label="Filtrar catálogo">
        <div className="col-12 col-md-6">
          <label htmlFor="search" className="form-label">Buscar</label>
          <input
            id="search"
            className="form-control"
            placeholder="Buscar por nombre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                update({ search: q });
              }
            }}
          />
        </div>

        <div className="col-6 col-md-3">
          <label htmlFor="category" className="form-label">Categoría</label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => update({ category: e.target.value })}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todos</option>
            <option value="Audio">Audio</option>
            <option value="Periféricos">Periféricos</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Monitores">Monitores</option>
          </select>
        </div>

        <div className="col-6 col-md-3">
          <label htmlFor="order" className="form-label">Orden</label>
          <div className="input-group">
            <select
              id="order"
              className="form-select"
              value={`${sort}:${order}`}
              onChange={(e) => {
                const [s, o] = e.target.value.split(":");
                update({ sort: s, order: o });
              }}
              aria-label="Ordenar resultados"
            >
              <option value="price:asc">Precio ↑</option>
              <option value="price:desc">Precio ↓</option>
            </select>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => update({ search: q })}
              aria-label="Aplicar búsqueda"
            >
              Buscar
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearAll}
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>

      {/* Estado / resultados */}
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div role="status" aria-live="polite" className="text-muted small">
          {loading ? "Cargando…" : `Resultados: ${meta.total.toLocaleString()}`}
        </div>
        <div className="text-muted small">
          Página {meta.page} de {totalPages}
        </div>
      </div>

      {/* Grid */}
      <div className="row g-3 mt-1" role="list">
        {items.map((p) => (
          <div key={p.sku} className="col-12 col-sm-6 col-lg-4" role="listitem">
            <div className="card h-100">
              {/* Marco fijo para uniformar tamaño de miniaturas */}
              <div className="ratio ratio-4x3 bg-body-tertiary">
                <img
                  src={resolveImage(p.images?.[0])}
                  onError={onImgError}
                  alt={p.name}
                  loading="lazy"
                  className="w-100 h-100 object-fit-cover"
                />
              </div>

              <div className="card-body d-flex flex-column">
                <Link
                  to={`/product/${p.sku}`}
                  className="stretched-link text-decoration-none fw-semibold"
                >
                  {p.name}
                </Link>
                <div className="text-muted small">{p.category}</div>
                <div className="mt-auto fw-bold">
                  ${p.price.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info mb-0">
              No se encontraron productos con esos filtros.
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      <nav
        className="d-flex justify-content-between align-items-center mt-4"
        aria-label="Paginación"
      >
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={meta.page <= 1 || loading}
          onClick={() =>
            setParams(
              { ...Object.fromEntries(params), page: String(meta.page - 1) },
              { replace: true }
            )
          }
        >
          ← Anterior
        </button>

        <span className="text-muted small">
          Página {meta.page} de {totalPages}
        </span>

        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={meta.page >= totalPages || loading}
          onClick={() =>
            setParams(
              { ...Object.fromEntries(params), page: String(meta.page + 1) },
              { replace: true }
            )
          }
        >
          Siguiente →
        </button>
      </nav>
    </div>
  );
}
