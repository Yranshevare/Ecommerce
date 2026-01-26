import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-emerald-700 text-stone-50 hover:bg-emerald-700/90 shadow-md hover:shadow-lg",
        destructive: "bg-red-500 text-stone-50 hover:bg-red-500/90",
        outline: "border border-stone-300 bg-stone-50 hover:bg-stone-100 hover:text-stone-900",
        secondary: "bg-stone-200 text-stone-800 hover:bg-stone-200/80",
        ghost: "hover:bg-stone-100 hover:text-stone-900",
        link: "text-emerald-700 underline-offset-4 hover:underline",
        hero: "bg-stone-800 text-stone-50 hover:bg-stone-800/90 shadow-md hover:shadow-lg text-base font-medium",
        "hero-outline": "border-2 border-stone-800 text-stone-800 bg-transparent hover:bg-stone-800 hover:text-stone-50 text-base font-medium",
        product: "bg-emerald-700 text-stone-50 hover:bg-emerald-700/90 shadow-md hover:shadow-lg font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8",
        xl: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
