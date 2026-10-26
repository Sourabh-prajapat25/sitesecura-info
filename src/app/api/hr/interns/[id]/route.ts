import { NextRequest, NextResponse } from "next/server";
import { getHrSessionFromCookies, validateCsrfOrigin } from "@/lib/auth";
import {
  getInternById,
  updateIntern,
  isValidStatusTransition,
} from "@/lib/storage/intern-store";
import { InternshipStatus } from "@/types/intern";

const VALID_STATUSES: InternshipStatus[] = [
  "Registered",
  "Onboarding",
  "Active",
  "Completed",
  "Withdrawn",
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const internId = params.id;
  const intern = await getInternById(internId);

  if (!intern) {
    return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
  }

  return NextResponse.json({ intern });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getHrSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  if (!validateCsrfOrigin(request)) {
    return NextResponse.json(
      { error: "Invalid request origin (CSRF check failed)." },
      { status: 403 }
    );
  }

  const internId = params.id;
  const existing = await getInternById(internId);
  if (!existing) {
    return NextResponse.json({ error: "Intern record not found." }, { status: 404 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, any> = {};

    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }

      const transitionCheck = isValidStatusTransition(
        existing.status,
        body.status,
        Boolean(body.isAdministrativeOverride)
      );

      if (!transitionCheck.allowed) {
        return NextResponse.json(
          { error: transitionCheck.reason || "Prohibited lifecycle transition." },
          { status: 400 }
        );
      }

      updates.status = body.status;
    }

    if (body.hrNotes !== undefined) {
      updates.hrNotes = String(body.hrNotes).trim();
    }

    if (body.offerLetterRef !== undefined) {
      updates.offerLetterRef = String(body.offerLetterRef).trim();
    }

    const updated = await updateIntern(internId, updates, session.username);
    return NextResponse.json({
      success: true,
      message: "Intern record updated.",
      intern: updated,
    });
  } catch (error) {
    console.error("[SiteSecura HR] Failed to update intern:", error);
    return NextResponse.json({ error: "Failed to update record." }, { status: 500 });
  }
}
