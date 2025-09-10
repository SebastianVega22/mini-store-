export default function SkeletonCard() {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-img-top fit-cover bg-secondary-subtle"></div>
      <div className="card-body placeholder-glow">
        <span className="placeholder col-8"></span>
        <span className="placeholder col-4 d-block mt-2"></span>
        <span className="placeholder col-6 d-block mt-3"></span>
      </div>
    </div>
  );
}
