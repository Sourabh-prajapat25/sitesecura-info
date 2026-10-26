"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/shared/Badge";
import {
  Users,
  UserPlus,
  Award,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

export default function HrPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<string>("hr_admin");

  const isLoginPage = pathname === "/hr-portal";

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/hr/session");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          if (data.user?.username) {
            setAdminUser(data.user.username);
          }
        } else {
          setIsAuthenticated(false);
          if (!isLoginPage) {
            router.push("/hr-portal");
          }
        }
      } catch {
        setIsAuthenticated(false);
        if (!isLoginPage) {
          router.push("/hr-portal");
        }
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  async function handleLogout() {
    try {
      await fetch("/api/hr/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/hr-portal");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // If on the login page, render children without the protected nav
  if (isLoginPage) {
    return <>{children}</>;
  }

  // While checking auth on protected subpages, show a clean loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Verifying HR session credentials...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Intern Directory",
      href: "/hr-portal/interns",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Register Intern",
      href: "/hr-portal/register",
      icon: <UserPlus className="h-4 w-4" />,
    },
    {
      label: "Certificates",
      href: "/hr-portal/certificates",
      icon: <Award className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col pb-16">
      {/* HR Header Subnavigation Bar */}
      <div className="border-b border-border bg-background-secondary/70 backdrop-blur-md sticky top-[65px] z-30">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary border border-primary/30">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  SiteSecura HR Administration
                </span>
                <Badge variant="primary" size="sm">
                  Internal
                </Badge>
              </div>
            </div>

            {/* Subnav Links */}
            <div className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/hr-portal/interns" &&
                    pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "text-foreground-muted hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 transition-colors border border-amber-500/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <div className="flex-1 pt-6">{children}</div>
    </div>
  );
}
