import { useRoute } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Card, Badge, Button } from "@/components/ui-elements";
import { Clock, MapPin, Phone, Receipt, CheckCircle2, ChefHat, Bike, Home, ArrowLeft, Store } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";

const STATUS_STEPS = [
  { id: "pending", label: "Received", icon: Receipt },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { id: "preparing", label: "Cooking", icon: ChefHat },
  { id: "out_for_delivery", label: "On the way", icon: Bike },
  { id: "delivered", label: "Delivered", icon: Home },
];

export default function Order() {
  const [, params] = useRoute("/order/:id");
  const orderId = Number(params?.id);

  // Poll for updates every 5 seconds since it's an active order
  const { data: order, isLoading, error } = useGetOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl font-display mb-4">Order Not Found</h2>
        <p className="text-muted-foreground font-body mb-8">We couldn't find the order you're looking for.</p>
        <Link href="/">
          <Button><ArrowLeft className="mr-2 w-4 h-4"/> Back to Menu</Button>
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 text-sm px-4 py-1.5">
          Order #{order.id}
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-display mb-2">Track Your Order</h1>
        {order.estimatedDeliveryTime && !isCancelled && order.status !== 'delivered' && (
          <p className="text-xl font-body font-bold text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Estimated time: {order.estimatedDeliveryTime} mins
          </p>
        )}
      </div>

      {!isCancelled ? (
        <Card className="p-6 sm:p-10 mb-8 border-4 border-foreground">
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-8 left-0 right-0 h-2 bg-muted rounded-full hidden sm:block" />
            
            {/* Progress line */}
            <motion.div 
              className="absolute top-8 left-0 h-2 bg-primary rounded-full hidden sm:block origin-left"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
              {STATUS_STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex sm:flex-col items-center gap-4 sm:gap-3 group">
                    <motion.div 
                      initial={false}
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        backgroundColor: isActive || isPast ? "var(--color-primary)" : "var(--color-card)",
                        borderColor: isActive || isPast ? "var(--color-primary)" : "var(--color-border)",
                      }}
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-colors z-10 shadow-sm",
                        isActive || isPast ? "text-white" : "text-muted-foreground"
                      )}
                    >
                      <Icon className={cn("w-7 h-7", isActive && "animate-pulse")} />
                    </motion.div>
                    <div className="sm:text-center">
                      <div className={cn(
                        "font-display text-lg leading-none pt-1 transition-colors",
                        isActive ? "text-primary" : isPast ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-8 mb-8 border-destructive bg-destructive/10 text-center">
          <h2 className="text-3xl font-display text-destructive mb-2">Order Cancelled</h2>
          <p className="text-muted-foreground font-body font-bold">This order has been cancelled.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 sm:p-8">
          <h3 className="text-2xl font-display mb-6 border-b-2 border-border pb-4">Order Details</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start font-body font-bold">
                <div className="flex gap-3">
                  <span className="bg-muted px-2 py-0.5 rounded text-sm text-muted-foreground h-fit mt-0.5">{item.quantity}x</span>
                  <div>
                    <div className="text-foreground">Item #{item.menuItemId}</div>
                    {item.notes && <div className="text-sm text-muted-foreground mt-1 text-normal">Note: {item.notes}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t-2 border-dashed border-border space-y-2 font-body font-bold">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalPrice - order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-xl text-foreground pt-2">
              <span className="font-display">Total</span>
              <span className="font-display text-primary">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 sm:p-8 h-fit">
          <h3 className="text-2xl font-display mb-6 border-b-2 border-border pb-4">Delivery Info</h3>
          <div className="space-y-6 font-body font-bold text-foreground/80">
            <div>
              <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Customer</div>
              <div className="text-lg">{order.customerName}</div>
            </div>
            
            <div className="flex gap-4">
               <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
               <span>{order.customerPhone}</span>
            </div>

            {order.deliveryZone !== 'pickup' ? (
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <span>{order.deliveryAddress}</span>
              </div>
            ) : (
              <div className="flex gap-4 items-center bg-primary/10 p-3 rounded-xl text-primary">
                <Store className="w-5 h-5" />
                <span>Pickup at JoJo Foods Store</span>
              </div>
            )}

            {order.specialInstructions && (
              <div className="bg-muted p-4 rounded-xl text-sm italic">
                "{order.specialInstructions}"
              </div>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}
