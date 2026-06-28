import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, TrendingUp, Package, Star } from "lucide-react";
import { useListFeaturedProducts, useGetCatalogSummary, useListNewArrivals, useListCategories, useListBestsellers } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// @ts-ignore
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function GeometricDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, hsl(33 95% 55% / 0.25))" }} />
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rotate-45 bg-primary"
            style={{
              width: i === 2 ? "10px" : "5px",
              height: i === 2 ? "10px" : "5px",
              opacity: i === 2 ? 0.9 : 0.35,
            }}
          />
        ))}
      </div>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, hsl(33 95% 55% / 0.25))" }} />
    </div>
  );
}

const TRAILS = [
  {
    name: "Kedarkantha",
    region: "Uttarakhand",
    elevation: "3,810 m",
    description: "A winter summit that rewards with 360° Himalayan panoramas — Swargarohini, Bandarpoonch, and the Gangotri range.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
  {
    name: "Chadar Trek",
    region: "Ladakh",
    elevation: "3,400 m",
    description: "Walk the frozen Zanskar River through vertical gorges. The most dramatic winter journey in the Indian Himalaya.",
    image: "https://images.unsplash.com/photo-1609136572520-85dc6edd4490?w=800&q=80",
  },
  {
    name: "Spiti Circuit",
    region: "Himachal Pradesh",
    elevation: "4,550 m",
    description: "A high-altitude desert beyond the Rohtang Pass — ancient monasteries, moonscapes, and air too thin for the unprepared.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
];

export function Home() {
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useListFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew } = useListNewArrivals();
  const { data: bestsellers, isLoading: isLoadingBestsellers } = useListBestsellers();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: summary } = useGetCatalogSummary();

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[680px] max-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2070&q=80"
            alt="Himalayan mountain landscape"
            className="w-full h-full object-cover"
            width={2070}
            height={1380}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(18,10,4,0.88) 0%, rgba(60,25,5,0.65) 40%, rgba(18,10,4,0.82) 100%)",
            }}
          />
          {/* Subtle warm diag-stripe overlay */}
          <div className="absolute inset-0 pattern-chevron" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.p variants={fadeUp} className="text-primary font-semibold text-sm tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
              <span className="inline-block w-8 h-px bg-primary" />
              India's Premier Outdoor Gear
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-8"
            >
              Where India's
              <br />
              <span style={{ color: "hsl(33 95% 55%)" }}>Mountains</span>
              <br />
              Demand Your Best.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
              Gear forged for Ladakh's passes, Spiti's plateaus, and the snow
              ridges of Kedarkantha. Precision equipment that refuses to fail
              when the altitude starts to bite.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/products">Shop All Gear</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base font-semibold px-8 border-white/30 text-white bg-transparent hover:bg-white/10"
              >
                <Link href="/categories">Explore Disciplines</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      {summary && (
        <section className="bg-muted border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {[
                { icon: Package, value: summary.totalProducts, label: "Pieces of Gear" },
                { icon: MapPin, value: summary.totalCategories, label: "Disciplines" },
                { icon: TrendingUp, value: summary.newArrivalsCount, label: "New Arrivals" },
                { icon: Star, value: (summary.avgRating ?? 0).toFixed(1), label: "Avg Star Rating" },
              ].map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex flex-col items-center justify-center gap-1 py-8 px-4 text-center"
                >
                  <Icon className="h-4 w-4 text-primary mb-1 opacity-70" />
                  <div className="text-3xl font-bold text-primary tabular-nums">{value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED GEAR ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" /> Handpicked
            </motion.p>
            <div className="flex justify-between items-end">
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold">
                Featured Gear
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Link href="/products?sort=rating-desc" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  View Top Rated <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {isLoadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))
              : Array.isArray(featuredProducts) && featuredProducts.map((product, i) => (
                  <motion.div key={product.id} custom={i} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ── INDIA'S ICONIC TRAILS ── */}
      <section className="py-24 bg-muted relative overflow-hidden">
        <div className="absolute inset-0 pattern-chevron opacity-60" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.p variants={fadeUp} className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-3">
              Built for these trails
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold">
              India's Legendary Routes
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mt-4 max-w-xl mx-auto">
              From alpine circuits to frozen river walks — Apex Trail gear is field-tested on India's most demanding terrain.
            </motion.p>
          </motion.div>

          <GeometricDivider />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {TRAILS.map((trail, i) => (
              <motion.div
                key={trail.name}
                custom={i}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={trail.image}
                    alt={trail.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>
                <div className="p-6 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider">{trail.region}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{trail.elevation}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2 text-foreground">{trail.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{trail.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" /> Explore
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold">
              Shop by Discipline
            </motion.h2>
          </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoadingCategories
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
                ))
              : Array.isArray(categories) && categories.slice(0, 3).map((category, i) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg block"
                    >
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-300" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-white font-serif text-2xl font-bold mb-1">{category.name}</h3>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <span>{category.productCount} items</span>
                          <ArrowRight className="h-4 w-4 translate-x-0 group-hover:translate-x-2 transition-transform duration-300 text-primary" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <div
                          className="w-6 h-6 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ borderColor: "hsl(33 95% 55%)" }}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-border hover:border-primary hover:text-primary">
              <Link href="/categories">View All Disciplines <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" /> Top Rated
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold">
              Bestsellers
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mt-2">
              Tested and trusted by Himalayan adventurers.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {isLoadingBestsellers
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))
              : Array.isArray(bestsellers) && bestsellers.slice(0, 4).map((product, i) => (
                  <motion.div key={product.id} custom={i} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" /> Just In
            </motion.p>
            <div className="flex justify-between items-end">
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold">
                New Arrivals
              </motion.h2>
              <motion.div variants={fadeUp}>
                <Link href="/products?sort=newest" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  View All New <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
            <motion.p variants={fadeUp} className="text-muted-foreground mt-2">
              The latest advancements in high-altitude engineering.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {isLoadingNew
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))
              : Array.isArray(newArrivals) && newArrivals.slice(0, 4).map((product, i) => (
                  <motion.div key={product.id} custom={i} variants={fadeUp}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ── BRAND CTA ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2070&q=80"
            alt="Mountain summit"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(18,10,4,0.9) 0%, rgba(40,18,2,0.75) 100%)",
            }}
          />
          <div className="absolute inset-0 pattern-chevron" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <GeometricDivider />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-12"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto">
              The Summit Doesn't Care About Your Excuses.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-lg max-w-xl mx-auto mb-10">
              Outfit yourself with gear that matches your ambition.
              Free shipping on orders above ₹8,300.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold px-10 py-6">
                <Link href="/products">Build Your Kit <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
          </motion.div>
          <div className="mt-12">
            <GeometricDivider />
          </div>
        </div>
      </section>
    </Layout>
  );
}
