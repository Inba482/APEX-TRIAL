import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function About() {
  return (
    <Layout>
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2003&auto=format&fit=crop" 
            alt="Climber on steep rock face" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            FORGED AT ELEVATION.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We don't build gear for the weekend warrior. We build precision equipment for those who push boundaries.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="prose prose-lg dark:prose-invert">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">The Origin</h2>
            <p className="text-muted-foreground leading-relaxed">
              APEX TRAIL was born from failure. In 2018, our founder's pack tore during a winter summit attempt on Denali. That single point of failure forced an immediate descent. The realization was stark: when you operate at the edge of human capability, your gear is your lifeline. It cannot fail.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We returned to the workshop and began engineering equipment from the ground up, discarding industry assumptions. We utilized military-grade materials, reinforced stress points that others ignored, and tested our prototypes in the harshest environments on Earth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] bg-muted overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=2036&auto=format&fit=crop" 
                alt="Craftsmanship detail" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="prose prose-lg dark:prose-invert">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Uncompromising Craft</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe in reduction. A complicated product is a product with more points of failure. Our design philosophy centers on removing the unnecessary until only the essential remains.
              </p>
              <ul className="space-y-4 text-muted-foreground mt-6 list-none pl-0">
                <li className="flex gap-4">
                  <span className="font-bold text-primary">—</span>
                  <span><strong>Zero Compromise:</strong> We never choose a material based on cost. We choose based on performance metrics.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">—</span>
                  <span><strong>Field Tested:</strong> Every product spends a minimum of 1,000 hours in field testing before production.</span>
                </li>
                <li className="flex gap-4">
                  <span className="font-bold text-primary">—</span>
                  <span><strong>Lifetime Guarantee:</strong> If our gear fails you, we replace it. No questions asked.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-12 text-center border border-border">
            <h2 className="text-2xl font-bold mb-4">Ready to push further?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Equip yourself with gear that won't hold you back when you need it most.
            </p>
            <Button asChild size="lg" className="px-8 font-semibold">
              <Link href="/products">Explore the Catalog</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
