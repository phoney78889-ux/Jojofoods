import * as React from "react";
import { cn } from "@/lib/utils";

// --- BUTTON ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display tracking-wider rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 disabled:pointer-events-none",
          {
            "btn-chunky btn-chunky-primary": variant === "primary",
            "btn-chunky btn-chunky-secondary": variant === "secondary",
            "btn-chunky btn-chunky-outline": variant === "outline",
            "bg-transparent hover:bg-muted text-foreground active:scale-95 transition-transform": variant === "ghost",
            "h-10 px-4 text-sm": size === "sm",
            "h-12 px-6 text-lg": size === "default",
            "h-14 px-8 text-xl": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- INPUT ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-border bg-card px-4 py-2 font-body text-base text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- LABEL ---
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-bold font-body text-foreground/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

// --- BADGE ---
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold font-display uppercase tracking-wider transition-colors",
        {
          "border-transparent bg-primary text-primary-foreground shadow-sm": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground shadow-sm": variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground shadow-sm": variant === "destructive",
          "text-foreground border-border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

// --- CARD ---
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}
