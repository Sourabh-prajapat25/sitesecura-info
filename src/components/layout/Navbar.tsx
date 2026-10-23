"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Shield, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md shadow-lg shadow-black/20 py-3"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm py-4"
      }`}
    >
      <Container>
        <nav
          className="flex items-center justify-between"
          aria-label="Main Navigation"
        >
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="SiteSecura Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/15 border border-primary/30 transition-transform duration-200 group-hover:scale-105 group-hover:border-primary/50">
              <Shield
                className="h-5 w-5 text-secondary transition-colors duration-200 group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-white">
                SiteSecura
              </span>
              <span className="text-[10px] uppercase tracking-wider text-secondary -mt-1 font-semibold">
                Info & Careers
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {siteConfig.navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "text-secondary font-semibold bg-secondary/10"
                        : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-secondary"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right CTAs pointing to main SaaS product */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={siteConfig.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-foreground-muted hover:text-foreground transition-colors px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            >
              Visit Platform
            </a>

            <a
              href={siteConfig.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span>Explore SiteSecura</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={siteConfig.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary/20 border border-primary/30 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/30"
              aria-label="Launch main platform"
            >
              Platform
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background-card/80 text-foreground-muted hover:text-foreground hover:bg-background-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Accessible Mobile Navigation Panel */}
      <div
        id="mobile-nav-panel"
        className={`fixed inset-x-0 top-[61px] bottom-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border transition-all duration-300 md:hidden overflow-y-auto ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <Container className="py-6 flex flex-col gap-6">
          <ul className="flex flex-col gap-1">
            {siteConfig.navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "text-foreground-muted hover:bg-white/5 hover:text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-secondary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-foreground-muted px-1">
              Main Product Platform
            </div>
            <a
              href={siteConfig.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all"
            >
              <span>Explore SiteSecura Platform</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <div className="text-[11px] text-center text-foreground-muted pt-2">
              Website Security Should Be Simple.
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
