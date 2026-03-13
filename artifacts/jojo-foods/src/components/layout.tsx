import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "./ui-elements";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const { itemCount, cartTotal } = useCart();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </Button>
            
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-md">
                <span className="text-white font-display text-xl leading-none pt-1">JJ</span>
              </div>
              <span className="font-display text-2xl tracking-wide text-foreground">
                JoJo <span className="text-primary">Foods</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={cn(
                "font-display text-lg tracking-wide transition-colors hover:text-primary",
                location === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Menu
            </Link>
          </nav>

          <div className="flex items-center">
            <Link href="/checkout">
              <Button variant="secondary" className="gap-3 shadow-md">
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline">Tray</span>
                {itemCount > 0 && (
                  <div className="bg-primary text-white text-sm px-2 py-0.5 rounded-full font-body font-bold leading-tight">
                    {itemCount}
                  </div>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-background z-50 border-r-2 border-border shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-display text-2xl">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  className="font-display text-xl p-4 rounded-xl hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Full Menu
                </Link>
                <Link 
                  href="/checkout" 
                  className="font-display text-xl p-4 rounded-xl hover:bg-muted transition-colors text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Tray ({itemCount})
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-foreground text-background py-12 mt-auto border-t-8 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-90">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-foreground font-display pt-1">JJ</div>
             <span className="font-display text-xl">JoJo Foods</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl select-none" title="Our mascot, Mr. Whiskers, quality-tests every dish">🐱</div>
            <p className="text-xs text-muted-foreground font-body opacity-70">Mr. Whiskers, Chief Taste Tester</p>
          </div>
          <p className="font-body text-muted-foreground text-sm font-semibold">
            © {new Date().getFullYear()} JoJo Foods. All cravings satisfied.
          </p>
        </div>
      </footer>
    </div>
  );
}
