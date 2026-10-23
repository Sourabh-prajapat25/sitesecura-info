import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
}

export function Card({
  children,
  hoverEffect = true,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`relative rounded-xl border border-border bg-background-card/90 p-6 sm:p-7 shadow-lg shadow-black/20 transition-all duration-300 ${
        hoverEffect
          ? "hover:border-primary/40 hover:bg-background-card hover:shadow-primary/5 hover:-translate-y-1"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
