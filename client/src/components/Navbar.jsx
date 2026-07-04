import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-3xl tracking-wide text-white">
            MenStyle<span className="text-accent">Pro</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="font-heading text-sm font-medium text-gray-300 hover:text-accent transition-colors">
              {l.label}
            </Link>
          ))}
          {(user?.role === "admin" || user?.role === "staff") && (
            <Link to="/admin" className="font-heading text-sm font-medium text-accent hover:text-accent-light transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        <form onSubmit={submitSearch} className="hidden md:flex items-center relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shirts, jeans..."
            className="input-field pl-9 py-2"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative text-gray-300 hover:text-accent transition-colors">
            <FiHeart size={20} />
            {wishlist.products?.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {wishlist.products.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-gray-300 hover:text-accent transition-colors">
            <FiShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-300 hover:text-accent">
                <FiUser /> {user.name?.split(" ")[0]}
              </Link>
              <button onClick={logout} className="text-sm text-gray-500 hover:text-accent">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex btn-primary !py-2 !px-5 text-sm">
              Login
            </Link>
          )}

          <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-base-950/95"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              <form onSubmit={submitSearch} className="relative mb-3">
                <FiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="input-field pl-9"
                />
              </form>
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-gray-300 hover:text-accent">
                  {l.label}
                </Link>
              ))}
              {(user?.role === "admin" || user?.role === "staff") && (
                <Link to="/admin" onClick={() => setOpen(false)} className="py-2 text-accent">
                  Dashboard
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="py-2 text-gray-300">
                    Profile
                  </Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="py-2 text-left text-gray-500">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
