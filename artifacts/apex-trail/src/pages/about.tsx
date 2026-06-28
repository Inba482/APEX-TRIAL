import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const VALUES = [
  { title: "Zero Compromise", body: "We never select a material based on cost. Every component is chosen for performance under the hardest conditions India's mountains can deliver." },
  { title: "Field Tested", body: "Every product endures a minimum of 1,000 hours of field testing — from Kedarkantha in winter to Spiti at 4,550m — before production begins." },
  { title: "Repairability First", body: "Gear that cannot be repaired in the field is gear that will eventually fail you. We design for repairability as a core safety feature, not an afterthought." },
];

export function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=2003&q=80"
            alt="Trekker at high altitude in the Himalayas"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(18,10,4,0.85) 0%, rgba(60,25,5,0.65) 50%, rgba(18,10,4,0.82) 100%)" }}
          />
          <div className="absolute inset-0 pattern-chevron" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-primary text-xs tracking-[0.3em] uppercase font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-primary" /> Our Story
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Forged in the
              <br />
              <span style={{ color: "hsl(33 95% 55%)" }}>Himalayas.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/70 max-w-xl leading-relaxed">
              We don't build gear for the weekend enthusiast. We build precision
              equipment for those who push into India's wildest places.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-20">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="prose prose-lg dark:prose-invert"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground">The Origin</h2>
            <p className="text-muted-foreground leading-relaxed">
              Apex Trail was born from failure. In 2019, our founder's pack tore
              apart during a winter summit attempt on Kedarkantha. The zipper
              housing shattered in -22°C, sending two days of food, insulation,
              and navigation equipment cascading down a couloir. That single
              point of failure forced an immediate descent — the summit had to wait.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The realization was stark: when you operate at India's altitude
              extremes, your gear is your lifeline. It cannot fail. We returned
              to the workshop in Manali and began engineering equipment from the
              ground up — discarding every industry assumption, testing on every
              route from Spiti to the Sahyadris.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-lg border border-border">
              <img
                src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=800&q=80"
                alt="Gear craftsmanship detail"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold text-foreground">Uncompromising Craft</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in reduction. A complicated product is a product with
                more points of failure. Our design philosophy strips away the
                unnecessary until only the essential remains — and then makes
                the essential stronger than anyone thought necessary.
              </p>
              <ul className="space-y-5">
                {VALUES.map(({ title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="font-bold text-primary mt-0.5 flex-shrink-0">—</span>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      <strong className="text-foreground font-semibold">{title}:</strong> {body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative rounded-lg overflow-hidden border border-primary/20 bg-card p-10 text-center"
          >
            <div className="absolute inset-0 pattern-chevron opacity-50" />
            <div className="relative z-10">
              <p className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-snug mb-2">
                "The mountain doesn't reward <span className="text-primary">average</span> gear."
              </p>
              <p className="text-muted-foreground text-sm mt-4">— Apex Trail founding philosophy</p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="prose prose-lg dark:prose-invert"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground">Where We're Headed</h2>
            <p className="text-muted-foreground leading-relaxed">
              India's mountain culture is growing — 20,000 new trekkers register
              permits in Uttarakhand every season. We exist to make sure their
              gear never becomes the reason they don't reach the summit. Every
              Apex Trail product is manufactured in India, tested in India, and
              designed for India's unique combination of altitude, monsoon, and
              temperature extremes.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products">Explore All Gear</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Reach Out</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
