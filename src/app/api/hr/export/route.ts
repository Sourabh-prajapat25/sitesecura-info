import { NextResponse } from "next/server";
import { getHrSessionFromCookies } from "@/lib/auth";
import { getAllInterns } from "@/lib/storage/intern-store";
import { sanitizeForSpreadsheet } from "@/lib/sanitizer";

const CSV_HEADERS = [
  "Intern ID",
  "Registration Timestamp (UTC)",
  "Full Name",
  "Email",
  "Phone",
  "City",
  "State",
  "Role",
  "Internship Start Date",
  "Internship End Date",
  "LinkedIn URL",
  "Instagram URL",
  "Other Social URL",
  "Portfolio/GitHub URL",
  "College",
  "Course/Year",
  "Resume Drive File ID",
  "Resume Drive Link",
  "Status",
  "Certificate Number",
  "Certificate Drive File ID",
  "Certificate Drive Link",
  "Certificate Issue Date",
  "HR Notes",
  "Created By",
  "Last Updated Timestamp",
];

function escapeCsvCell(val: unknown): string {
  const sanitized = sanitizeForSpreadsheet(val);
  const escaped = sanitized.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const all = getAllInterns();

  const lines = [CSV_HEADERS.map((h) => `"${h}"`).join(",")];

  for (const r of all) {
    const row = [
      escapeCsvCell(r.id),
      escapeCsvCell(r.registrationTimestamp),
      escapeCsvCell(r.fullName),
      escapeCsvCell(r.email),
      escapeCsvCell(r.phone),
      escapeCsvCell(r.city),
      escapeCsvCell(r.state),
      escapeCsvCell(r.customRole || r.role),
      escapeCsvCell(r.startDate),
      escapeCsvCell(r.endDate),
      escapeCsvCell(r.linkedinUrl || ""),
      escapeCsvCell(r.instagramUrl || ""),
      escapeCsvCell(r.otherSocialUrl || ""),
      escapeCsvCell(r.portfolioUrl || ""),
      escapeCsvCell(r.college || ""),
      escapeCsvCell(r.courseYear || ""),
      escapeCsvCell(r.resumeDriveFileId || ""),
      escapeCsvCell(r.resumeDriveLink || ""),
      escapeCsvCell(r.status),
      escapeCsvCell(r.certificateNumber || ""),
      escapeCsvCell(r.certificateDriveFileId || ""),
      escapeCsvCell(r.certificateDriveLink || ""),
      escapeCsvCell(r.certificateIssueDate || ""),
      escapeCsvCell(r.hrNotes || ""),
      escapeCsvCell(r.createdBy),
      escapeCsvCell(r.lastUpdatedTimestamp),
    ];
    lines.push(row.join(","));
  }

  const csvContent = lines.join("\r\n");
  const dateStr = new Date().toISOString().split("T")[0];

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sitesecura-interns-${dateStr}.csv"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
