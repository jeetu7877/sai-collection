import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { FiPlus, FiTrash2, FiUploadCloud, FiX, FiPackage } from "react-icons/fi";

const TYPES = ["Shirt", "Jeans", "T-Shirt", "Trouser", "Jacket", "Blazer"];
const FITS = ["Slim", "Regular", "Relaxed", "Oversized"];
const SLEEVES = ["Full", "Half", "Sleeveless", "N/A"];
const OCCASIONS = ["Casual", "Formal", "Office", "Party", "Wedding"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

const emptyForm = {
  name: "",
  type: "Shirt",
  category: "",
  brand: "",
  price: "",
  mrp: "",
  discountPercent: "",
  material: "",
  fitType: "Regular",
  sleeve: "N/A",
  occasion: [],
  washInstructions: "",
  description: "",
  tags: "",
  isFeatured: false,
  isBestSeller: false,
};

export default function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [variants, setVariants] = useState([{ size: "M", color: "", stock: 0 }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [catRes, brandRes, prodRes] = await Promise.all([
        api.get("/catalog/categories"),
        api.get("/catalog/brands"),
        api.get("/products?limit=100&sort=-createdAt"),
      ]);
      setCategories(catRes.data);
      setBrands(brandRes.data);
      setProducts(prodRes.data.products);
    } catch (err) {
      toast.error("Couldn't load products. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleOccasion = (o) =>
    setForm((f) => ({
      ...f,
      occasion: f.occasion.includes(o) ? f.occasion.filter((x) => x !== o) : [...f.occasion, o],
    }));

  const updateVariant = (i, key, value) =>
    setVariants((v) => v.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

  const addVariantRow = () => setVariants((v) => [...v, { size: "M", color: "", stock: 0 }]);
  const removeVariantRow = (i) => setVariants((v) => v.filter((_, idx) => idx !== i));

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 6);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setVariants([{ size: "M", color: "", stock: 0 }]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price || !form.mrp) {
      toast.error("Name, category, price and MRP are required.");
      return;
    }
    if (variants.some((v) => !v.color)) {
      toast.error("Every size/color row needs a color.");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload images first (if any selected)
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const fd = new FormData();
        imageFiles.forEach((f) => fd.append("images", f));
        const uploadRes = await api.post("/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrls = uploadRes.data.urls;
      }

      // 2. Create the product
      const payload = {
        name: form.name,
        type: form.type,
        category: form.category,
        brand: form.brand || undefined,
        price: Number(form.price),
        mrp: Number(form.mrp),
        discountPercent: Number(form.discountPercent) || 0,
        material: form.material,
        fitType: form.fitType,
        sleeve: form.sleeve,
        occasion: form.occasion,
        washInstructions: form.washInstructions,
        description:
          form.description ||
          `${form.name} crafted from ${form.material || "premium fabric"}. ${form.fitType} fit.`,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        images: imageUrls,
        isFeatured: form.isFeatured,
        isBestSeller: form.isBestSeller,
        variants: variants.map((v) => ({ ...v, stock: Number(v.stock) || 0 })),
      };

      await api.post("/products", payload);
      toast.success("Product added!");
      resetForm();
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't add product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this product from the store?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product removed.");
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch {
      toast.error("Couldn't remove product.");
    }
  };

  if (loading) return <Loader label="Loading products..." />;

  return (
    <div>
      <h1 className="section-title mb-1">Products</h1>
      <p className="text-gray-500 text-sm mb-8">Add new items and manage what's live in the shop.</p>

      {/* ---------- Add Product form ---------- */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-10 space-y-6">
        <h3 className="font-heading font-semibold text-white flex items-center gap-2">
          <FiPlus className="text-accent" /> Add New Product
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Product Name *</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Slim Fit Casual Shirt"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type *</label>
            <select className="input-field" value={form.type} onChange={(e) => updateField("type", e.target.value)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category *</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Brand</label>
            <select className="input-field" value={form.brand} onChange={(e) => updateField("brand", e.target.value)}>
              <option value="">No brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Selling Price (₹) *</label>
            <input type="number" className="input-field" value={form.price} onChange={(e) => updateField("price", e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">MRP (₹) *</label>
            <input type="number" className="input-field" value={form.mrp} onChange={(e) => updateField("mrp", e.target.value)} required />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Discount %</label>
            <input type="number" className="input-field" value={form.discountPercent} onChange={(e) => updateField("discountPercent", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Material</label>
            <input className="input-field" value={form.material} onChange={(e) => updateField("material", e.target.value)} placeholder="e.g. 100% Cotton" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fit Type</label>
            <select className="input-field" value={form.fitType} onChange={(e) => updateField("fitType", e.target.value)}>
              {FITS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sleeve</label>
            <select className="input-field" value={form.sleeve} onChange={(e) => updateField("sleeve", e.target.value)}>
              {SLEEVES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-2 block">Occasion</label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                type="button"
                key={o}
                onClick={() => toggleOccasion(o)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  form.occasion.includes(o)
                    ? "bg-accent/15 border-accent text-accent"
                    : "border-white/15 text-gray-400 hover:border-white/30"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Description</label>
          <textarea
            className="input-field min-h-[80px]"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Leave blank to auto-generate from material & fit"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Wash Instructions</label>
            <input className="input-field" value={form.washInstructions} onChange={(e) => updateField("washInstructions", e.target.value)} placeholder="e.g. Machine wash cold" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags (comma separated)</label>
            <input className="input-field" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} placeholder="formal, office, cotton" />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField("isFeatured", e.target.checked)} className="accent-accent" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.isBestSeller} onChange={(e) => updateField("isBestSeller", e.target.checked)} className="accent-accent" />
            Best Seller
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Product Images</label>
          <label className="glass glass-hover rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer w-fit text-sm text-gray-300">
            <FiUploadCloud className="text-accent" />
            Choose images (up to 6)
            <input type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />
          </label>
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500 block">Sizes, Colors & Stock *</label>
            <button type="button" onClick={addVariantRow} className="text-xs text-accent flex items-center gap-1 hover:text-accent-light">
              <FiPlus size={14} /> Add row
            </button>
          </div>
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select className="input-field !py-2 w-24" value={v.size} onChange={(e) => updateVariant(i, "size", e.target.value)}>
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  className="input-field !py-2"
                  placeholder="Color, e.g. Navy"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                />
                <input
                  type="number"
                  className="input-field !py-2 w-28"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => updateVariant(i, "stock", e.target.value)}
                />
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariantRow(i)} className="text-gray-500 hover:text-red-400 p-2">
                    <FiX />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* ---------- Product list ---------- */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
          <FiPackage className="text-accent" /> Live Products ({products.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-white/10">
                <th className="pb-2 pr-4">Image</th>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">Price</th>
                <th className="pb-2 pr-4">Stock</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-white/5">
                  <td className="py-2 pr-4">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5" />
                    )}
                  </td>
                  <td className="py-2 pr-4 text-gray-200">{p.name}</td>
                  <td className="py-2 pr-4 text-gray-400">{p.category?.name || "—"}</td>
                  <td className="py-2 pr-4 text-accent font-medium">₹{p.price}</td>
                  <td className="py-2 pr-4 text-gray-400">
                    {p.totalStock <= (p.lowStockThreshold ?? 5) ? (
                      <span className="badge bg-red-500/15 text-red-400">{p.totalStock} left</span>
                    ) : (
                      p.totalStock
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {p.isFeatured && <span className="badge bg-accent/15 text-accent mr-1">Featured</span>}
                    {p.isBestSeller && <span className="badge bg-white/10 text-gray-300">Best Seller</span>}
                  </td>
                  <td className="py-2 text-right">
                    <button onClick={() => handleDelete(p._id)} className="text-gray-500 hover:text-red-400 p-1.5">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No products yet — add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
