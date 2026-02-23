import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border-[1.5px] border-[hsl(var(--input))] bg-[hsl(0_0%_98%)] px-3.5 py-2 text-[0.9375rem] text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] disabled:cursor-not-allowed disabled:opacity-[0.38]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
