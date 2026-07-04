import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from "react-icons/fi";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const testimonials = [
  { name: "Aditya Verma", role: "Regular Customer", quote: "The tailoring on their blazers is genuinely better than brands twice the price. My go-to for weddings now." },
  { name: "Karan Mehta", role: "Gold Member", quote: "Loyalty points actually add up to real discounts. Ordered a jacket entirely with reward points last month." },
  { name: "Vivek Nair", role: "First-time Buyer", quote: "Fast delivery, true-to-size fit, and the fabric quality on the linen shirt exceeded what I expected online." },
];

const perks = [
  { icon: FiTruck, title: "Fast Delivery", desc: "Pan-India shipping in 3-5 days" },
  { icon: FiShield, title: "Secure Checkout", desc: "100% protected payments" },
  { icon: FiRefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: FiStar, title: "Loyalty Rewards", desc: "₹100 spent = 10 reward points" },
];

export default function Home() {
  const [sections, setSections] = useState(null);

  useEffect(() => {
    api.get("/products/home/sections").then((res) => setSections(res.data)).catch(() => setSections({ featured: [], newArrivals: [], bestSellers: [] }));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="eyebrow mb-4">Autumn / Winter Collection</p>
            <h1 className="font-display text-6xl md:text-7xl leading-[0.95] text-white">
              DRESS LIKE<br /><span className="text-gradient">YOU MEAN IT</span>
            </h1>
            <p className="mt-6 text-gray-400 max-w-md leading-relaxed">
              Tailored shirts, premium denim, and sharp blazers — curated for men who don't settle for off-the-rack ordinary.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">
                Shop Collection <FiArrowRight />
              </Link>
              <Link to="/shop?type=Blazer" className="btn-outline">
                Explore Blazers
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full" />
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=900"
              alt="Model wearing MenStyle Pro premium blazer"
              className="relative rounded-3xl object-cover w-full aspect-[4/5] shadow-glass border border-white/10"
            />
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl px-5 py-4 hidden sm:block">
              <p className="text-2xl font-heading font-bold text-white">12,000+</p>
              <p className="text-xs text-gray-400">Happy Customers</p>
            </div>
          </motion.div>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-white/10 bg-white/[0.02] py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-10 pr-10">
                {["FORMAL SHIRTS", "PREMIUM DENIM", "TAILORED BLAZERS", "STREETWEAR TEES", "WINTER JACKETS", "FESTIVE OFFERS UP TO 40% OFF"].map((t) => (
                  <span key={t} className="font-heading text-sm tracking-widest text-gray-500">
                    {t} <span className="text-accent mx-3">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        {perks.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass rounded-2xl p-5 text-center">
            <Icon className="mx-auto text-accent mb-3" size={22} />
            <p className="font-heading font-semibold text-white text-sm">{title}</p>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </div>
        ))}
      </section>

      {!sections ? (
        <Loader label="Loading collection..." />
      ) : (
        <>
          {/* FEATURED */}
          {sections.featured?.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="eyebrow mb-2">Curated Picks</p>
                  <h2 className="section-title">Featured Products</h2>
                </div>
                <Link to="/shop" className="hidden sm:flex items-center gap-1 text-accent text-sm font-medium hover:gap-2 transition-all">
                  View all <FiArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {sections.featured.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          )}

          {/* NEW ARRIVALS */}
          {sections.newArrivals?.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
              <p className="eyebrow mb-2">Just Landed</p>
              <h2 className="section-title mb-8">New Arrivals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {sections.newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          )}

          {/* OFFERS BANNER */}
          <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
            <div className="relative overflow-hidden rounded-3xl glass p-10 md:p-14 text-center">
              <p className="eyebrow mb-3">Limited Time</p>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-4">FLAT 25% OFF ON FESTIVE PICKS</h2>
              <p className="text-gray-400 mb-6">Use code <span className="text-accent font-semibold">FEST25</span> at checkout · Min order ₹2000</p>
              <Link to="/shop" className="btn-primary inline-flex">Shop the Sale <FiArrowRight /></Link>
            </div>
          </section>

          {/* BEST SELLERS */}
          {sections.bestSellers?.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
              <p className="eyebrow mb-2">Customer Favorites</p>
              <h2 className="section-title mb-8">Best Sellers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {sections.bestSellers.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          )}
        </>
      )}

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <p className="eyebrow mb-2 text-center">Word on the Street</p>
        <h2 className="section-title mb-10 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-1 text-accent mb-3">
                {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" size={14} />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">"{t.quote}"</p>
              <p className="mt-4 font-heading font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAP */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 py-14">
        <div className="glass rounded-2xl overflow-hidden">
          <iframe
            title="Store location"
            src="https://www.google.com/maps?q=Jaipur,Rajasthan,India&output=embed"
            className="w-full h-80 border-0"
            loading="lazy"
          />
        </div>
      </section>
    </div>
  );
}
