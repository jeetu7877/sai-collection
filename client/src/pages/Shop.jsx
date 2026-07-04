import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import Loader from "../components/Loader";
import { FiSliders } from "react-icons/fi";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    search: searchParams.get("search") || "",
  });
  const [sort, setSort] = useState("newest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, sort, page, limit: 12 };
    Object.keys(params).forEach((k) => (!params[k] ? delete params[k] : null));
    api
      .get("/products", { params })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [filters, sort, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10">
      <div className="mb-8">
        <p className="eyebrow mb-2">The Collection</p>
        <h1 className="section-title">Shop All Products</h1>
        {filters.search && <p className="text-gray-500 mt-2 text-sm">Results for "{filters.search}"</p>}
      </div>

      <div className="flex items-center justify-between mb-6 md:hidden">
        <button onClick={() => setShowFilters(!showFilters)} className="btn-outline !py-2 !px-4 text-sm">
          <FiSliders /> Filters
        </button>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !py-2 w-40 text-sm">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        <div className={`${showFilters ? "block" : "hidden"} md:block`}>
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        <div>
          <div className="hidden md:flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{products.length} products</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field !py-2 w-48 text-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <Loader label="Fetching products..." />
          ) : products.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-gray-500">
              No products match your filters. Try clearing some filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`h-9 w-9 rounded-lg text-sm ${
                        page === i + 1 ? "bg-accent text-white" : "glass text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
