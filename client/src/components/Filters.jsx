const TYPES = ["Shirt", "Jeans", "T-Shirt", "Trouser", "Jacket", "Blazer"];
const COLORS = ["White", "Black", "Navy", "Grey", "Maroon", "Olive"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function Filters({ filters, setFilters }) {
  const toggleArrayValue = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] ? prev[key].split(",") : [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: next.join(",") };
    });
  };

  const isChecked = (key, value) => (filters[key] || "").split(",").includes(value);

  return (
    <div className="glass rounded-2xl p-5 space-y-6 sticky top-24">
      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Category</h4>
        <div className="space-y-2">
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={isChecked("type", t)}
                onChange={() => toggleArrayValue("type", t)}
                className="accent-accent"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Color</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => toggleArrayValue("color", c)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                isChecked("color", c) ? "border-accent text-accent bg-accent/10" : "border-white/15 text-gray-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleArrayValue("size", s)}
              className={`h-9 w-9 rounded-lg border text-xs transition-colors ${
                isChecked("size", s) ? "border-accent text-accent bg-accent/10" : "border-white/15 text-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading font-semibold text-white mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
            className="input-field !py-2 text-sm"
          />
          <span className="text-gray-500">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
            className="input-field !py-2 text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => setFilters({})}
        className="w-full text-sm text-gray-500 hover:text-accent transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
