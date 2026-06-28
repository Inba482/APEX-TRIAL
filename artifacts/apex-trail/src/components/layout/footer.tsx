import { Link } from "wouter";
import { Mountain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg tracking-wider">APEX TRAIL</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Uncompromising gear for those who live where the air is thin and the trails are steep. 
              Engineered for the edge.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Gear</Link></li>
              <li><Link href="/categories/apparel" className="hover:text-primary transition-colors">Apparel</Link></li>
              <li><Link href="/categories/equipment" className="hover:text-primary transition-colors">Equipment</Link></li>
              <li><Link href="/categories/footwear" className="hover:text-primary transition-colors">Footwear</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} APEX TRAIL. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
