import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminList, adminRemove } from "../../services/admin.products.service";
import BulkUploadModal from "./BulkUploadModal";

export default function AdminProductsList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await adminList({ page: 1, limit: 100, sort: "createdAt", order: "desc" });
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || "Error en la solicitud");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (sku) => {
    if (!confirm(`¿Borrar el producto ${sku}?`)) return;
    try {
      await adminRemove(sku);
      await load();
    } catch (e) {
      alert(e.message || "No se pudo borrar");
    }
  };

  return (
    <div className="d-grid gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0">Productos</h2>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#bulkUploadModal"
            title="Cargar productos desde CSV"
          >
            Cargar masivamente
          </button>
          <Link to="/admin/products/new" className="btn btn-primary">+ Nuevo</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-muted">Cargando…</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Stock</th>
                <th>Categoría</th>
                <th style={{width: 160}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.sku}>
                  <td><Link to={`/product/${p.sku}`}>{p.sku}</Link></td>
                  <td>{p.name}</td>
                  <td className="text-end">${p.price?.toLocaleString?.()}</td>
                  <td className="text-end">{p.stock}</td>
                  <td>{p.category}</td>
                  <td className="d-flex gap-2">
                    <Link className="btn btn-sm btn-outline-secondary" to={`/admin/products/${p.sku}/edit`}>Editar</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(p.sku)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL de carga masiva */}
      <BulkUploadModal />
    </div>
  );
}
