import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMenuItems } from "@workspace/api-client-react";
import type { MenuItem } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { Button, Badge, Card } from "@/components/ui-elements";
import { Flame, Star, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// Fallback data so the app looks stunning even if the DB is empty
const MOCK_MENU: MenuItem[] = [
  { id: 1, name: "The Classic Smash", description: "Two crispy smashed beef patties, melty American cheese, house sauce, pickles on a buttered potato bun.", price: 9.99, category: "burgers", popular: true, spicy: false, imageUrl: `${import.meta.env.BASE_URL}images/burger-mock.png` },
  { id: 2, name: "Inferno Burger", description: "Spicy pepper jack, charred jalapeños, habanero aioli, and crispy fried onions.", price: 11.49, category: "burgers", popular: false, spicy: true, imageUrl: `${import.meta.env.BASE_URL}images/burger-mock.png` },
  { id: 3, name: "Truffle Mushroom Swiss", description: "Roasted wild mushrooms, swiss cheese, truffle mayo, baby arugula.", price: 12.99, category: "burgers", popular: false, spicy: false, imageUrl: `${import.meta.env.BASE_URL}images/burger-mock.png` },
  { id: 4, name: "Pepperoni Paradise", description: "Double layered pepperoni, rich mozzarella, robust tomato sauce on a hand-tossed garlic crust.", price: 16.99, category: "pizza", popular: true, spicy: false, imageUrl: `${import.meta.env.BASE_URL}images/pizza-mock.png` },
  { id: 5, name: "Spicy Honey BBQ Chicken", description: "Crispy chicken, red onions, mozzarella, spicy honey BBQ drizzle.", price: 18.49, category: "pizza", popular: false, spicy: true, imageUrl: `${import.meta.env.BASE_URL}images/pizza-mock.png` },
  { id: 6, name: "Spicy Dragon Roll", description: "Spicy minced tuna, crisp cucumber, topped with sliced avocado and sriracha mayo.", price: 14.99, category: "sushi", popular: true, spicy: true, imageUrl: `${import.meta.env.BASE_URL}images/sushi-mock.png` },
  { id: 7, name: "Crunchy Tempura Roll", description: "Crispy shrimp tempura, avocado, eel sauce drizzle, coated in crunchy tempura flakes.", price: 13.99, category: "sushi", popular: false, spicy: false, imageUrl: `${import.meta.env.BASE_URL}images/sushi-mock.png` },
];

const CATEGORIES = [
  { id: "all", label: "All Menu" },
  { id: "burgers", label: "🍔 Burgers" },
  { id: "pizza", label: "🍕 Pizza" },
  { id: "sushi", label: "🍣 Sushi" },
  { id: "shawarma", label: "🌯 Shawarma" },
];

export default function Home() {
  const { data: apiMenu, isLoading } = useGetMenuItems();
  const [activeCategory, setActiveCategory] = useState("all");
  const { addToCart } = useCart();

  // Use API data if available and not empty, otherwise fallback to mock data
  const menuItems = apiMenu && apiMenu.length > 0 ? apiMenu : MOCK_MENU;

  const filteredItems = menuItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-secondary min-h-[85vh] flex items-center">
        {/* Abstract decorative shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <Badge variant="outline" className="mb-6 border-2 border-foreground/20 text-foreground/80 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm">
              🚨 New Menu Items Added
            </Badge>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display text-foreground leading-[0.9] mb-6 drop-shadow-sm">
              Burgers.<br/>
              <span className="text-white drop-shadow-md">Pizza.</span><br/>
              Sushi.
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/80 font-body font-bold mb-10 max-w-lg mx-auto lg:mx-0">
              Why compromise? Get all your favorite cravings delivered hot, fresh, and stupidly fast.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={scrollToMenu} className="w-full sm:w-auto text-xl shadow-xl">
                Order Now <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl transform scale-110" />
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-spread.png`} 
              alt="Feast of burgers, pizza, and sushi" 
              className="relative w-full max-w-2xl mx-auto drop-shadow-2xl rounded-3xl -rotate-2 hover:rotate-0 transition-transform duration-500 border-8 border-white/50"
            />
          </motion.div>
        </div>
        
        {/* Custom wavy divider at bottom using SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-background">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,191.24,103.9Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu-section" className="py-24 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display mb-4">Explore the Menu</h2>
            <p className="text-muted-foreground font-body font-bold text-lg max-w-2xl mx-auto">
              Hand-crafted from fresh ingredients daily.
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-6 py-3 rounded-2xl font-display text-xl transition-colors ${
                  activeCategory === cat.id ? "text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-2xl shadow-md border-2 border-primary-dark"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 pt-1 block leading-none tracking-wide">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-8 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      <div className="relative h-56 bg-muted overflow-hidden border-b-2 border-border p-4 flex items-center justify-center bg-gradient-to-br from-white to-muted">
                        <img 
                          src={item.imageUrl || `${import.meta.env.BASE_URL}images/${item.category}-mock.png`} 
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {item.popular && (
                            <Badge className="bg-secondary text-secondary-foreground">
                              <Star className="w-3 h-3 mr-1 fill-current" /> Popular
                            </Badge>
                          )}
                          {item.spicy && (
                            <Badge variant="destructive">
                              <Flame className="w-3 h-3 mr-1" /> Spicy
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col bg-white">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <h3 className="text-2xl font-display leading-tight">{item.name}</h3>
                          <span className="text-xl font-display text-primary bg-primary/10 px-3 py-1 rounded-lg">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <p className="text-muted-foreground font-body font-semibold text-sm mb-8 flex-1 leading-relaxed">
                          {item.description}
                        </p>
                        <Button 
                          className="w-full text-lg" 
                          onClick={() => addToCart(item)}
                        >
                          Add to Order
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-2xl font-display text-muted-foreground mb-4">No items found in this category.</p>
              <Button variant="outline" onClick={() => setActiveCategory("all")}>View All Menu</Button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
