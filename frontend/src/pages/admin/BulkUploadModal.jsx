import { useRef, useState } from "react";
import { adminBulkTemplate, adminBulkUpload } from "../../services/admin.products.service";

export default function BulkUploadModal() {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // {inserted,updated,errorsCount,errors:[{row,message}]}
  const [error, setError] = useState("");

  const downloadTemplate = async () => {
    try {
      setError("");
      const blob = await adminBulkTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products-template.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || "No se pudo descargar la plantilla");
    }
  };

  const onUpload = async () => {
    try {
      setError("");
      setResult(null);
      const file = fileRef.current?.files?.[0];
      if (!file) {
        setError("Selecciona un archivo CSV primero.");
        return;
      }
      setBusy(true);
      const summary = await adminBulkUpload(file);
      setResult(summary);
    } catch (e) {
      setError(e.message || "No se pudo cargar el CSV");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal fade" id="bulkUploadModal" tabIndex="-1" aria-labelledby="bulkUploadLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="bulkUploadLabel">Cargar productos masivamente (CSV)</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>

          <div className="modal-body d-grid gap-3">
            <div className="d-flex gap-2">
              <button type="button" onClick={downloadTemplate} className="btn btn-outline-secondary">
                Descargar plantilla CSV
              </button>
            </div>

            <div>
              <label className="form-label">Archivo CSV</label>
              <input ref={fileRef} type="file" className="form-control" accept=".csv" />
              <div className="form-text">
                Cabeceras esperadas: <code>sku,name,description,price,image,category,rating,stock,tags</code>
              </div>
            </div>

            {error && <div className="alert alert-danger mb-0">{error}</div>}

            {busy && (
              <div className="alert alert-info mb-0">
                Cargando… por favor espera.
              </div>
            )}

            {result && (
              <div className="alert alert-success mb-0">
                <div className="fw-semibold mb-1">Carga finalizada ✅</div>
                <div>Insertados: {result.inserted}</div>
                <div>Actualizados: {result.updated}</div>
                <div>Errores: {result.errorsCount}</div>
                {result.errorsCount > 0 && (
                  <details className="mt-2">
                    <summary>Ver detalles</summary>
                    <ul className="mb-0">
                      {result.errors?.map((e, i) => (
                        <li key={i}>Fila {e.row}: {e.message}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={onUpload} disabled={busy}>
              Subir CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
