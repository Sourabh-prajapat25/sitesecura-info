import { NextRequest, NextResponse } from "next/server";
import { getInternById } from "@/lib/storage/intern-store";
import { isValidInternIdFormat } from "@/lib/id-generator";
import { checkRateLimit, getClientIdentifier } from "@/lib/auth";

function maskName(fullName: string): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first} ${lastInitial}.`;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIdentifier(request);

    // Rate limiting: max 10 lookups per 10 minutes to prevent ID enumeration
    const rateCheck = checkRateLimit(`intern_lookup_${clientIp}`, 10, 10 * 60, 10 * 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many lookup attempts. Please wait before trying again.",
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const internId = (body?.internId || "").trim().toUpperCase();

    if (!internId || !isValidInternIdFormat(internId)) {
      return NextResponse.json(
        { error: "Please enter a valid Intern ID (e.g. SS-INT-2026-A7K92P)." },
        { status: 400 }
      );
    }

    const intern = getInternById(internId);
    if (!intern) {
      return NextResponse.json(
        { error: "No matching record found for the provided Intern ID." },
        { status: 404 }
      );
    }

    const hasCertificate = Boolean(intern.certificateNumber);

    // Return strictly non-private, public status fields
    return NextResponse.json({
      success: true,
      intern: {
        internId: intern.id,
        internName: maskName(intern.fullName),
        role: intern.customRole || intern.role,
        startDate: intern.startDate,
        endDate: intern.endDate,
        status: intern.status,
        certificateAvailable: hasCertificate,
        certificateNumber: hasCertificate ? intern.certificateNumber : undefined,
        certificateIssueDate: hasCertificate ? intern.certificateIssueDate : undefined,
        downloadUrl: hasCertificate
          ? `/api/certificates/${intern.certificateNumber}/download`
          : undefined,
      },
    });
  } catch (error) {
    console.error("[SiteSecura Intern Lookup] Error:", error);
    return NextResponse.json(
      { error: "Lookup service encountered an error." },
      { status: 500 }
    );
  }
}
