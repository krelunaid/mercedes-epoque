import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost" | "dark";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; block?: boolean }
>(function Button({ className, variant = "gold", block, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium tracking-wide transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-40",
        variant === "gold" && "bg-gold text-bg hover:bg-gold/90",
        variant === "outline" &&
          "border border-gold/40 bg-transparent text-gold hover:border-gold hover:bg-gold/10",
        variant === "ghost" && "bg-transparent text-cream/80 hover:bg-cream/5 hover:text-cream",
        variant === "dark" && "bg-elevated text-cream shadow-[var(--shadow-card)] hover:bg-surface",
        block && "w-full",
        className,
      )}
      {...props}
    />
  );
});
