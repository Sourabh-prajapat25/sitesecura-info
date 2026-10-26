import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { siteConfig } from "@/config/site";

export interface GenerateCertificateOptions {
  internName: string;
  role: string;
  startDate: string;
  endDate: string;
  certificateNumber: string;
  issueDate?: string;
  signatoryName?: string;
  signatoryTitle?: string;
}

/**
 * Generates a high-resolution, branded SiteSecura Internship Completion Certificate as a PDF Buffer.
 */
export async function generateCertificatePdf(
  options: GenerateCertificateOptions
): Promise<Buffer> {
  const {
    internName,
    role,
    startDate,
    endDate,
    certificateNumber,
    issueDate = new Date().toISOString().split("T")[0],
    signatoryName = process.env.CERTIFICATE_SIGNATORY_NAME || "Sourabh K.",
    signatoryTitle = process.env.CERTIFICATE_SIGNATORY_TITLE || "Director, People & Operations",
  } = options;

  const siteUrl = process.env.SITE_URL || siteConfig.siteUrl;
  const verificationUrl = `${siteUrl}/verify-internship?cert=${encodeURIComponent(
    certificateNumber
  )}`;

  // Generate QR code data URL (PNG)
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 240,
    color: {
      dark: "#080D19",
      light: "#FFFFFF",
    },
  });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");

  // Create PDF document (Landscape A4: 842 x 595 pt)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  // Fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Embed QR Image
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  // Palette colors
  const colorBg = rgb(8 / 255, 13 / 255, 25 / 255); // #080D19
  const colorCardBg = rgb(17 / 255, 28 / 255, 48 / 255); // #111C30
  const colorPrimary = rgb(79 / 255, 140 / 255, 255 / 255); // #4F8CFF
  const colorSecondary = rgb(53 / 255, 214 / 255, 232 / 255); // #35D6E8
  const colorWhite = rgb(245 / 255, 247 / 255, 255 / 255);
  const colorMuted = rgb(164 / 255, 176 / 255, 196 / 255);
  const colorSubtle = rgb(110 / 255, 126 / 255, 153 / 255);
  const colorGold = rgb(245 / 255, 197 / 255, 66 / 255);

  // Draw Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colorBg,
  });

  // Outer Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: colorPrimary,
    borderWidth: 1.5,
  });

  // Inner Border (with subtle offset)
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: colorSecondary,
    borderWidth: 0.75,
  });

  // Inner Card Panel
  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    color: colorCardBg,
  });

  // Decorative top accent line
  page.drawLine({
    start: { x: 40, y: height - 44 },
    end: { x: width - 40, y: height - 44 },
    color: colorPrimary,
    thickness: 2,
  });

  // Brand Header
  const brandTitle = "SITESECURA";
  const brandWidth = fontBold.widthOfTextAtSize(brandTitle, 22);
  page.drawText(brandTitle, {
    x: (width - brandWidth) / 2,
    y: height - 85,
    size: 22,
    font: fontBold,
    color: colorSecondary,
  });

  const brandTagline = "WEBSITE SECURITY & POSTURE SAAS";
  const taglineWidth = fontBold.widthOfTextAtSize(brandTagline, 9);
  page.drawText(brandTagline, {
    x: (width - taglineWidth) / 2,
    y: height - 102,
    size: 9,
    font: fontBold,
    color: colorPrimary,
  });

  // Certificate Header
  const certHeader = "CERTIFICATE OF INTERNSHIP COMPLETION";
  const certHeaderWidth = fontBold.widthOfTextAtSize(certHeader, 16);
  page.drawText(certHeader, {
    x: (width - certHeaderWidth) / 2,
    y: height - 142,
    size: 16,
    font: fontBold,
    color: colorGold,
  });

  // Subtitle
  const subText = "This is proudly presented to";
  const subWidth = fontRegular.widthOfTextAtSize(subText, 11);
  page.drawText(subText, {
    x: (width - subWidth) / 2,
    y: height - 172,
    size: 11,
    font: fontRegular,
    color: colorMuted,
  });

  // Intern Name (Prominent)
  const nameText = internName.toUpperCase();
  const nameSize = 26;
  const nameWidth = fontBold.widthOfTextAtSize(nameText, nameSize);
  page.drawText(nameText, {
    x: (width - nameWidth) / 2,
    y: height - 212,
    size: nameSize,
    font: fontBold,
    color: colorWhite,
  });

  // Accent underline below name
  page.drawLine({
    start: { x: width / 2 - 140, y: height - 222 },
    end: { x: width / 2 + 140, y: height - 222 },
    color: colorSecondary,
    thickness: 1.5,
  });

  // Body Description
  const bodyText1 = `for successfully completing the practical technology internship program as`;
  const bodyText2 = role.toUpperCase();
  const bodyText3 = `from ${startDate} to ${endDate}.`;

  const body1Width = fontRegular.widthOfTextAtSize(bodyText1, 12);
  page.drawText(bodyText1, {
    x: (width - body1Width) / 2,
    y: height - 258,
    size: 12,
    font: fontRegular,
    color: colorMuted,
  });

  const body2Width = fontBold.widthOfTextAtSize(bodyText2, 14);
  page.drawText(bodyText2, {
    x: (width - body2Width) / 2,
    y: height - 280,
    size: 14,
    font: fontBold,
    color: colorPrimary,
  });

  const body3Width = fontRegular.widthOfTextAtSize(bodyText3, 12);
  page.drawText(bodyText3, {
    x: (width - body3Width) / 2,
    y: height - 302,
    size: 12,
    font: fontRegular,
    color: colorMuted,
  });

  const commendation =
    "During this tenure, the candidate demonstrated technical curiosity, dedication to web standards, and valuable contributions to SiteSecura.";
  const commWidth = fontOblique.widthOfTextAtSize(commendation, 10);
  page.drawText(commendation, {
    x: (width - commWidth) / 2,
    y: height - 330,
    size: 10,
    font: fontOblique,
    color: colorSubtle,
  });

  // Divider Line above footer
  page.drawLine({
    start: { x: 60, y: 155 },
    end: { x: width - 60, y: 155 },
    color: colorPrimary,
    thickness: 0.5,
  });

  // Footer Layout: 3 Columns
  // Column 1 (Left): Signatory & Issue Date
  page.drawText(signatoryName, {
    x: 75,
    y: 125,
    size: 12,
    font: fontBold,
    color: colorWhite,
  });
  page.drawText(signatoryTitle, {
    x: 75,
    y: 110,
    size: 10,
    font: fontRegular,
    color: colorMuted,
  });
  page.drawText(`SiteSecura • sitesecura.com`, {
    x: 75,
    y: 95,
    size: 9,
    font: fontRegular,
    color: colorSubtle,
  });
  page.drawText(`Issued: ${issueDate}`, {
    x: 75,
    y: 75,
    size: 9,
    font: fontRegular,
    color: colorMuted,
  });

  // Column 2 (Center): QR Code for Online Verification
  const qrSize = 75;
  page.drawImage(qrImage, {
    x: (width - qrSize) / 2,
    y: 65,
    width: qrSize,
    height: qrSize,
  });
  const scanText = "Scan to Verify Authenticity";
  const scanWidth = fontRegular.widthOfTextAtSize(scanText, 8);
  page.drawText(scanText, {
    x: (width - scanWidth) / 2,
    y: 52,
    size: 8,
    font: fontRegular,
    color: colorSecondary,
  });

  // Column 3 (Right): Certificate Number & Official Registry
  const rightX = width - 260;
  page.drawText("CERTIFICATE IDENTIFIER", {
    x: rightX,
    y: 125,
    size: 9,
    font: fontBold,
    color: colorSecondary,
  });
  page.drawText(certificateNumber, {
    x: rightX,
    y: 108,
    size: 12,
    font: fontBold,
    color: colorWhite,
  });
  page.drawText("Verify online at:", {
    x: rightX,
    y: 90,
    size: 9,
    font: fontRegular,
    color: colorMuted,
  });
  page.drawText("sitesecura.info/verify-internship", {
    x: rightX,
    y: 75,
    size: 9,
    font: fontRegular,
    color: colorPrimary,
  });

  // Save PDF as Buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
