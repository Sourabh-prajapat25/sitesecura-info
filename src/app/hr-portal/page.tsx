"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  LogOut,
} from "lucide-react";

export default function HrPortalLoginPage() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await fetch("/api/hr/session");
        if (res.ok) {
          setIsAlreadyLoggedIn(true);
        }
      } catch {
        // Not logged in
      }
    }
    checkExistingSession();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!passkey.trim()) {
      setErrorMessage("Please enter the HR administrative passkey.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/hr/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed.");
        setIsLoading(false);
        return;
      }

      // Success: redirect to interns dashboard
      router.push("/hr-portal/interns");
      router.refresh();
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/hr/logout", { method: "POST" });
      setIsAlreadyLoggedIn(false);
      setPasskey("");
      router.refresh();
    } catch {
      // Ignored
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:py-20">
      <Container size="narrow">
        <Breadcrumbs items={[{ label: "HR Portal" }]} />

        <div className="mx-auto max-w-md">
          {/* Card Container */}
          <div className="rounded-2xl border border-border bg-background-card/90 p-8 shadow-2xl backdrop-blur-md">
            {/* Header Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/15 border border-primary/30 text-secondary mb-6 shadow-inner">
              <Lock className="h-7 w-7 text-secondary" />
            </div>

            <div className="text-center space-y-2 mb-8">
              <Badge variant="primary" size="sm">
                RESTRICTED ACCESS
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                HR Administration Portal
              </h1>
              <p className="text-xs sm:text-sm text-foreground-muted">
                Authorized SiteSecura personnel only. Server-authenticated session required.
              </p>
            </div>

            {isAlreadyLoggedIn ? (
              <div className="space-y-6 text-center">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span>You currently have an active HR administrative session.</span>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    href="/hr-portal/interns"
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    Proceed to Dashboard
                  </Button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 text-xs text-foreground-muted hover:text-foreground py-2 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out of Current Session</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="passkey"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground-muted"
                  >
                    HR Administrative Passkey
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground-muted">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      id="passkey"
                      name="passkey"
                      type={showPasskey ? "text" : "password"}
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      placeholder="Enter configured passkey"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-xl border border-border bg-background-secondary py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasskey(!showPasskey)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground-muted hover:text-foreground"
                      aria-label={showPasskey ? "Hide passkey" : "Show passkey"}
                    >
                      {showPasskey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    <span>Authenticate & Enter</span>
                  )}
                </Button>

                <div className="pt-2 text-center text-[11px] text-foreground-subtle">
                  Sessions are protected with HttpOnly encrypted cookies and rate-limited against
                  unauthorized brute-force access.
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
