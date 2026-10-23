import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/shared/Button";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 sm:py-32">
      <Container className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 text-primary mb-6 shadow-lg shadow-primary/10">
          <ShieldAlert className="h-10 w-10 text-secondary" />
        </div>

        <div className="text-xs uppercase font-semibold tracking-widest text-secondary mb-2">
          404 — Page Not Found
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          The requested path was not found.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-foreground-muted max-w-md mx-auto leading-relaxed">
          The page you are looking for may have moved, had its name changed, or is temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="primary" icon={<Home className="h-4 w-4" />}>
            Return to Homepage
          </Button>
          <Button href="/product" variant="outline">
            Explore Product
          </Button>
          <Button href="/contact" variant="ghost">
            Contact Support
          </Button>
        </div>
      </Container>
    </div>
  );
}
