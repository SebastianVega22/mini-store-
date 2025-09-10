import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "../services/products.service";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import FiltersBar from "../components/FiltersBar";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ items: [], page: 1, total: 0, pageSize: 12 });
  const [loading, setLoading] = useState(true);

  const page = Number(params.get("page") || 1);
  const q = params.get("q") || "";
  const cat = params.get("cat") || null;
  const sort = params.get("sort") || "price";
  const order = params.get("order") || "asc";

  const req = useMemo(() => ({
    search: q || undefined, category: cat || undefined,
    sort, order, page, limit: 12
  }), [q, cat, sort, order, page]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await listProducts(req);
        if (alive) setData(res);
      } catch {
        if (alive) setData({ items: [], page: 1, total: 0, pageSize: 12 });
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [req]);

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / (data.pageSize || 12)));
  const go = (d) => {
    const p = new URLSearchParams(params);
    p.set("page", String(Math.min(totalPages, Math.max(1, page + d))));
    setParams(p);
  };

  return (
    <>
      <h1 className="h3 fw-bold mb-3">Catálogo</h1>

      <FiltersBar itemsSample={data.items} />

      <div className="mt-3 row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col"><SkeletonCard /></div>
            ))
          : data.items.map((p) => (
              <div key={p.sku} className="col"><ProductCard p={p} /></div>
            ))
        }
      </div>

      {!loading && (
        <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
          <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => go(-1)}>
            ← Anterior
          </button>
          <span className="text-body-secondary small">Página {page} de {totalPages}</span>
          <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => go(1)}>
            Siguiente →
          </button>
        </div>
      )}
    </>
  );
}
