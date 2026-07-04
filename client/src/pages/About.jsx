export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-16">
      <p className="eyebrow mb-3">Our Story</p>
      <h1 className="section-title mb-6">Built for Men Who Dress With Intent</h1>
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800" alt="MenStyle Pro store interior" className="rounded-2xl aspect-video object-cover" />
        <p className="text-gray-400 leading-relaxed">
          MenStyle Pro started as a single storefront with one belief: menswear shouldn't force a choice between quality and price.
          Today we curate shirts, denim, and tailoring from brands that share our obsession with fabric, fit, and finish —
          delivered with the kind of service you'd expect walking into a shop where the owner knows your name.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-16">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-white mb-2">Our Mission</h3>
          <p className="text-sm text-gray-400">Make premium menswear accessible without compromising on craftsmanship.</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-white mb-2">Quality First</h3>
          <p className="text-sm text-gray-400">Every piece is checked for fabric quality, stitching, and true-to-size fit.</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-white mb-2">Customer Obsessed</h3>
          <p className="text-sm text-gray-400">Loyalty rewards, easy returns, and real humans behind every order.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500",
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
        ].map((src, i) => (
          <img key={i} src={src} alt="Store" className="rounded-xl aspect-square object-cover" />
        ))}
      </div>
    </div>
  );
}
