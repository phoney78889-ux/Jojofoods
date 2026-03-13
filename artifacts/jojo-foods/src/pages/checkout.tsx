import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { Button, Input, Label, Card } from "@/components/ui-elements";
import { Trash2, Minus, Plus, ArrowLeft, Bike, Store, ShoppingBag } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

const DELIVERY_FEES = {
  zone_a: 2.99,
  zone_b: 4.99,
  zone_c: 6.99,
  pickup: 0,
};

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerEmail: z.string().email("Valid email required"),
  deliveryZone: z.enum(["zone_a", "zone_b", "zone_c", "pickup"]),
  deliveryAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
}).refine(
  (data) => {
    if (data.deliveryZone !== "pickup" && (!data.deliveryAddress || data.deliveryAddress.trim() === "")) {
      return false;
    }
    return true;
  },
  {
    message: "Address is required for delivery",
    path: ["deliveryAddress"],
  }
);

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const createOrder = useCreateOrder();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryZone: "pickup",
    },
  });

  const selectedZone = watch("deliveryZone");
  const deliveryFee = DELIVERY_FEES[selectedZone as keyof typeof DELIVERY_FEES] || 0;
  const finalTotal = cartTotal + deliveryFee;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error("Your tray is empty!");
      return;
    }

    try {
      const orderData = {
        ...data,
        items: items.map(i => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          notes: i.notes
        }))
      };

      const result = await createOrder.mutateAsync({ data: orderData });
      toast.success("Order placed successfully!", { icon: "🎉" });
      clearCart();
      setLocation(`/order/${result.id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-4xl font-display mb-4">Your Tray is Empty</h2>
          <p className="text-muted-foreground font-body mb-8 text-lg">Looks like you haven't decided what you're craving yet.</p>
          <Button onClick={() => setLocation("/")} size="lg" className="text-xl">
            <ArrowLeft className="mr-2 w-5 h-5" /> Back to Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl sm:text-5xl font-display mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                Contact Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input id="customerName" placeholder="JoJo Fan" {...register("customerName")} />
                  {errors.customerName && <p className="text-destructive text-sm font-bold">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input id="customerPhone" placeholder="(555) 123-4567" {...register("customerPhone")} />
                  {errors.customerPhone && <p className="text-destructive text-sm font-bold">{errors.customerPhone.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="customerEmail">Email Address</Label>
                  <Input id="customerEmail" type="email" placeholder="hungry@example.com" {...register("customerEmail")} />
                  {errors.customerEmail && <p className="text-destructive text-sm font-bold">{errors.customerEmail.message}</p>}
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                Delivery Method
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <label className={cn(
                  "cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all",
                  selectedZone === "pickup" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                )}>
                  <input type="radio" value="pickup" {...register("deliveryZone")} className="sr-only" />
                  <Store className={cn("w-8 h-8", selectedZone === "pickup" ? "text-primary" : "text-muted-foreground")} />
                  <div className="text-center">
                    <div className="font-display text-lg">Pickup</div>
                    <div className="text-sm font-bold text-muted-foreground mt-1">Free • 15-20 min</div>
                  </div>
                </label>
                
                <label className={cn(
                  "cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all",
                  selectedZone !== "pickup" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                )}>
                  <input type="radio" value="zone_a" {...register("deliveryZone")} className="sr-only" />
                  <Bike className={cn("w-8 h-8", selectedZone !== "pickup" ? "text-primary" : "text-muted-foreground")} />
                  <div className="text-center">
                    <div className="font-display text-lg">Delivery</div>
                    <div className="text-sm font-bold text-muted-foreground mt-1">From $2.99</div>
                  </div>
                </label>
              </div>

              {selectedZone !== "pickup" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-6 pt-4 border-t-2 border-border"
                >
                  <div className="space-y-3">
                    <Label>Select Zone</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(["zone_a", "zone_b", "zone_c"] as const).map(zone => (
                        <label key={zone} className={cn(
                          "cursor-pointer border-2 rounded-xl p-3 flex justify-between items-center transition-all",
                          selectedZone === zone ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted"
                        )}>
                          <input type="radio" value={zone} {...register("deliveryZone")} className="sr-only" />
                          <span className="font-bold font-body capitalize">{zone.replace('_', ' ')}</span>
                          <span className="font-display text-primary">${DELIVERY_FEES[zone]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Full Delivery Address</Label>
                    <Input id="deliveryAddress" placeholder="123 Burger St, Apt 4" {...register("deliveryAddress")} />
                    {errors.deliveryAddress && <p className="text-destructive text-sm font-bold">{errors.deliveryAddress.message}</p>}
                  </div>
                </motion.div>
              )}
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">3</span>
                Extras
              </h2>
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <textarea 
                  id="specialInstructions" 
                  {...register("specialInstructions")}
                  placeholder="Extra ketchup, ring doorbell..."
                  className="w-full rounded-xl border-2 border-border bg-card px-4 py-3 font-body text-base focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none resize-none h-24 transition-all"
                />
              </div>
            </Card>
          </form>
        </div>

        {/* SUMMARY SECTION */}
        <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2">
          <div className="sticky top-28">
            <Card className="overflow-hidden border-4 border-foreground shadow-xl">
              <div className="bg-foreground text-background p-6">
                <h2 className="text-3xl font-display">Your Order</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-xl bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                        <img 
                           src={item.menuItem.imageUrl || `${import.meta.env.BASE_URL}images/${item.menuItem.category}-mock.png`} 
                           alt={item.menuItem.name} 
                           className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display leading-tight mb-1">{item.menuItem.name}</h4>
                        <div className="font-bold text-muted-foreground text-sm mb-2">{formatPrice(item.menuItem.price)}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-muted rounded-lg border border-border">
                            <button type="button" onClick={() => updateQuantity(item.menuItem.id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-display text-sm pt-1">{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.menuItem.id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeFromCart(item.menuItem.id)} className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors ml-auto">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-dashed border-border pt-4 space-y-2 font-body font-bold text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
                  </div>
                </div>

                <div className="border-t-2 border-border pt-4 flex justify-between items-end">
                  <span className="font-display text-xl text-foreground">Total</span>
                  <span className="font-display text-4xl text-primary">{formatPrice(finalTotal)}</span>
                </div>

                <Button 
                  type="submit" 
                  form="checkout-form"
                  className="w-full text-xl h-16 shadow-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
