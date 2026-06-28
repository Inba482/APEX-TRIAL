import { Link } from "wouter";
import { Mountain, MapPin, Mail, Phone } from "lucide-react";

const TRAILS = ["Kedarkantha", "Chadar Trek", "Spiti Circuit", "Hampta Pass", "Roopkund", "Valley of Flowers"];

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border relative overflow-hidden">
      {/* Decorative saffron top accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 pattern-chevron opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-widest uppercase">Apex Trail</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              India's premier outdoor gear brand — precision-engineered for those
              who push their limits on the subcontinent's greatest mountains.
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a href="mailto:expedition@apextrail.in" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary/60" />
                expedition@apextrail.in
              </a>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary/60" />
                +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/60" />
                Manali, Himachal Pradesh
              </span>
            </div>
          </div>

          {/* Shop links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-5 text-foreground text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Gear</Link></li>
              <li><Link href="/categories/backpacks" className="hover:text-primary transition-colors">Backpacks</Link></li>
              <li><Link href="/categories/tents" className="hover:text-primary transition-colors">Tents & Shelter</Link></li>
              <li><Link href="/categories/jackets" className="hover:text-primary transition-colors">Jackets</Link></li>
              <li><Link href="/categories/footwear" className="hover:text-primary transition-colors">Footwear</Link></li>
              <li><Link href="/categories/sleeping" className="hover:text-primary transition-colors">Sleeping Systems</Link></li>
            </ul>
          </div>

          {/* India's Greatest Trails */}
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-5 text-foreground text-sm uppercase tracking-wider">
              India's Trails
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {TRAILS.map((trail) => (
                <li key={trail} className="flex items-center gap-2 group">
                  <span
                    className="w-1.5 h-1.5 rotate-45 bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0"
                  />
                  <span className="group-hover:text-foreground transition-colors">{trail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-5 text-foreground text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            </ul>

            <div className="mt-8 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs text-primary font-semibold mb-1">Free Shipping</p>
              <p className="text-xs text-muted-foreground">On all orders above ₹8,300 across India</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Apex Trail India Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rotate-45"
                style={{
                  backgroundColor: `hsl(33 95% 55% / ${0.15 + i * 0.12})`,
                }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground/50 italic">
            Engineered for the edge. From the Himalayas to your next summit.
          </p>
        </div>
      </div>
    </footer>
  );
}
