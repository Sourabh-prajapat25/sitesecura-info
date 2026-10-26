"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge, StatusBadge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { INTERN_ROLES, InternRecord, InternshipStatus } from "@/types/intern";
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Eye,
  FileText,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function InternsDashboardPage() {
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    certificatesIssued: 0,
    upcomingEndDates: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchInterns = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (selectedRole) params.set("role", selectedRole);
      if (selectedStatus) params.set("status", selectedStatus);
      params.set("page", currentPage.toString());
      params.set("limit", "15");

      const res = await fetch(`/api/hr/interns?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInterns(data.interns || []);
        if (data.stats) setStats(data.stats);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalResults || 0);
      }
    } catch (err) {
      console.error("Failed to fetch interns:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedRole, selectedStatus, currentPage]);

  useEffect(() => {
    fetchInterns();
  }, [fetchInterns]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCurrentPage(1);
    fetchInterns();
  }

  function handleResetFilters() {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
    setCurrentPage(1);
  }

  return (
    <div className="flex flex-col gap-8">
      <Container>
        <Breadcrumbs
          items={[{ label: "HR Portal", href: "/hr-portal" }, { label: "Intern Directory" }]}
        />

        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Intern Directory & Records
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              Manage candidate profiles, review verified resumes, update statuses, and issue certificates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/api/hr/export"
              download
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background-card hover:bg-background-cardHover text-xs font-semibold text-foreground transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-secondary" />
              <span>Export CSV</span>
            </a>

            <Button
              href="/hr-portal/register"
              variant="primary"
              size="sm"
              icon={<UserPlus className="h-4 w-4" />}
            >
              Register Intern
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted flex items-center justify-between">
              <span>Total Interns</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted flex items-center justify-between">
              <span>Active Interns</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted flex items-center justify-between">
              <span>Upcoming End Dates</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{stats.upcomingEndDates}</div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted flex items-center justify-between">
              <span>Completed</span>
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
          </div>

          <div className="rounded-xl border border-border/80 bg-background-card/80 p-4 space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted flex items-center justify-between">
              <span>Certificates Issued</span>
              <Award className="h-4 w-4 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-secondary">{stats.certificatesIssued}</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-2xl border border-border bg-background-card/60 p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-foreground-muted">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Intern ID, name, or email..."
                className="block w-full rounded-xl border border-border bg-background-secondary py-2 pl-9 pr-4 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full rounded-xl border border-border bg-background-secondary py-2 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Roles</option>
                {INTERN_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-background-card">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full rounded-xl border border-border bg-background-secondary py-2 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Registered" className="bg-background-card">Registered</option>
                <option value="Onboarding" className="bg-background-card">Onboarding</option>
                <option value="Active" className="bg-background-card">Active</option>
                <option value="Completed" className="bg-background-card">Completed</option>
                <option value="Certificate Issued" className="bg-background-card">Certificate Issued</option>
                <option value="Withdrawn" className="bg-background-card">Withdrawn</option>
              </select>
            </div>
          </form>

          {(searchTerm || selectedRole || selectedStatus) && (
            <div className="flex items-center justify-between text-xs text-foreground-muted pt-1 border-t border-border/40">
              <span>Showing filtered results ({totalResults} matched)</span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-secondary hover:text-white underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Intern Records Table */}
        <div className="rounded-2xl border border-border bg-background-card/90 overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-foreground-muted flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs sm:text-sm">Loading intern records...</span>
            </div>
          ) : interns.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-background-secondary text-foreground-muted">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No intern records found</h3>
              <p className="text-xs sm:text-sm text-foreground-muted max-w-sm mx-auto">
                {searchTerm || selectedRole || selectedStatus
                  ? "No interns matched your current search and filter criteria."
                  : "No interns have been registered yet. Use the registration form to add your first intern."}
              </p>
              <div className="pt-2">
                <Button href="/hr-portal/register" variant="primary" size="sm">
                  Register First Intern
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-background-secondary/60 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                    <th className="py-3.5 px-4">Intern ID</th>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Tenure</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs sm:text-sm">
                  {interns.map((intern) => (
                    <tr
                      key={intern.id}
                      className="hover:bg-background-secondary/40 transition-colors"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-secondary">
                        <Link
                          href={`/hr-portal/interns/${intern.id}`}
                          className="hover:underline"
                        >
                          {intern.id}
                        </Link>
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">{intern.fullName}</div>
                        <div className="text-[11px] text-foreground-muted">{intern.email}</div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 text-foreground-muted">
                        {intern.customRole || intern.role}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 text-xs text-foreground-muted whitespace-nowrap">
                        <div>{intern.startDate}</div>
                        <div className="text-[11px] text-foreground-subtle">to {intern.endDate}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={intern.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/hr-portal/interns/${intern.id}`}
                            className="p-1.5 rounded-lg border border-border/80 bg-background-secondary hover:bg-background-card hover:text-primary transition-colors text-foreground-muted"
                            title="View Profile Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          <a
                            href={`/api/hr/resumes/${intern.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-border/80 bg-background-secondary hover:bg-background-card hover:text-secondary transition-colors text-foreground-muted"
                            title="View Verified Resume PDF"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </a>

                          {intern.certificateNumber ? (
                            <a
                              href={`/api/certificates/${intern.certificateNumber}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                              title="Download Issued Certificate"
                            >
                              <Award className="h-3.5 w-3.5" />
                            </a>
                          ) : intern.status === "Completed" ? (
                            <Link
                              href={`/hr-portal/interns/${intern.id}#certificate`}
                              className="px-2 py-1 rounded bg-secondary/15 border border-secondary/30 text-[10px] font-semibold text-secondary hover:bg-secondary/25"
                            >
                              Issue Cert
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-border/60 flex items-center justify-between text-xs text-foreground-muted">
              <div>
                Page {currentPage} of {totalPages} ({totalResults} total records)
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-border disabled:opacity-40 hover:bg-white/5"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded border border-border disabled:opacity-40 hover:bg-white/5"
                  aria-label="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
