import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminCreate,
  adminGetOne,
  adminUpdate,
} from "../../services/admin.products.service";

const CATEGORIES = ["Audio", "Periféricos", "Accesorios", "Monitores"];

export default function AdminProductForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { sku } = useParams();

  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    stock: 0,
    tags: "",
  });
  const [file, setFile] = useState(null); // 👈 archivo seleccionado
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        setLoading(true);
        const p = await adminGetOne(sku);
        setForm({
          sku: p.sku,
          name: p.name || "",
          description: p.description || "",
          price: p.price || 0,
          category: p.category || "",
          rating: p.rating || 0,
          stock: p.stock || 0,
          tags: (p.tags || []).join(", "),
        });
      } catch (e) {
        setError(e.message || "No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEdit, sku]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();

    // Armamos FormData SIEMPRE (así soporta imagen + campos)
    const fd = new FormData();
    fd.append("sku", form.sku.trim());
    fd.append("name", form.name.trim());
    fd.append("description", form.description.trim());
    fd.append("price", String(Math.max(0, Number(form.price) || 0)));
    fd.append("category", form.category || "");
    fd.append("rating", String(Math.max(0, Number(form.rating) || 0)));
    fd.append("stock", String(Math.max(0, Number(form.stock) || 0)));
    if (form.tags) fd.append("tags", form.tags);

    // 👇 IMPORTANTE: el nombre del campo debe ser "image"
    if (file) fd.append("image", file);

    try {
      setError("");
      if (isEdit) {
        await adminUpdate(form.sku, fd); // PUT con FormData
      } else {
        await adminCreate(fd); // POST con FormData
      }
      navigate("/admin/products", { replace: true });
    } catch (e) {
      setError(e.message || "No se pudo guardar");
    }
  };

  if (loading) return <div className="text-muted">Cargando…</div>;

  return (
    <div className="d-grid gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-0">{isEdit ? "Editar producto" : "Crear producto"}</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3" onSubmit={onSubmit}>
        <div className="col-md-3">
          <label className="form-label">SKU</label>
          <input
            className="form-control"
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
            required
            disabled={isEdit}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
            min={0}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        {/* CAMPO DE ARCHIVO */}
        <div className="col-md-6">
          <label className="form-label">Imagen (archivo)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="form-text">
            Se guardará en <code>/public/productos</code> y en la BD como{" "}
            <code>/public/productos/&lt;sku&gt;.&lt;ext&gt;</code>.
          </div>
        </div>

        <div className="col-md-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">—</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-1">
          <label className="form-label">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            className="form-control"
            value={form.rating}
            onChange={(e) => set("rating", e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Stock</label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Tags (separadas por coma)</label>
          <input
            className="form-control"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="gamer, rgb"
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => navigate("/admin/products")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
