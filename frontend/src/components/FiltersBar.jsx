import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

export default function FiltersBar({ itemsSample = [] }) {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const debouncedQ = useDebounce(q, 350);

  const categories = useMemo(() => {
    const set = new Set(itemsSample.map(i => i.category).filter(Boolean));
    return ["Todos", ...Array.from(set)];
  }, [itemsSample]);

  const cat = params.get("cat") || "Todos";
  const sort = params.get("sort") || "price";
  const order = params.get("order") || "asc";

  useEffect(() => {
    const p = new URLSearchParams(params);
    if (debouncedQ) p.set("q", debouncedQ); else p.delete("q");
    p.set("page", "1");
    setParams(p, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  function onChangeCat(e) {
    const p = new URLSearchParams(params);
    const v = e.target.value;
    if (v && v !== "Todos") p.set("cat", v); else p.delete("cat");
    p.set("page", "1");
    setParams(p);
  }

  function onChangeSort(e) {
    const p = new URLSearchParams(params);
    const [s, o] = e.target.value.split(":");
    p.set("sort", s); p.set("order", o); p.set("page", "1");
    setParams(p);
  }

  function clearAll() {
    setQ("");
    setParams(new URLSearchParams());
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label">Buscar</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre…"
              className="form-control"
              inputMode="search"
              aria-label="Buscar productos"
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">Categoría</label>
            <select value={cat} onChange={onChangeCat} className="form-select">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label">Orden</label>
            <select
              value={`${sort}:${order}`}
              onChange={onChangeSort}
              className="form-select"
            >
              <option value="price:asc">Precio ↑</option>
              <option value="price:desc">Precio ↓</option>
              <option value="name:asc">Nombre A–Z</option>
              <option value="name:desc">Nombre Z–A</option>
            </select>
          </div>
          <div className="col-12 text-end">
            <button onClick={clearAll} className="btn btn-outline-secondary">
              <i className="bi bi-x-circle me-1" /> Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
