import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { labelVinculoUrl } from "@/lib/siteUrl";
import { PIMACO_6180, LABELS_PER_SHEET, pt } from "@/lib/labelSheets";

const PAGE_WIDTH = pt(PIMACO_6180.pageWidthIn);
const PAGE_HEIGHT = pt(PIMACO_6180.pageHeightIn);
const LABEL_WIDTH = pt(PIMACO_6180.labelWidthIn);
const LABEL_HEIGHT = pt(PIMACO_6180.labelHeightIn);
const MARGIN_LEFT = pt(PIMACO_6180.marginLeftIn);
const MARGIN_TOP = pt(PIMACO_6180.marginTopIn);
const COL_PITCH = pt(PIMACO_6180.colPitchIn);
const ROW_PITCH = pt(PIMACO_6180.rowPitchIn);
const PADDING = 6;

export async function GET(request: NextRequest) {
  const idList = request.nextUrl.searchParams.getAll("ids");

  const labels = await prisma.label.findMany({
    where: { id: { in: idList } },
    orderBy: { code: "asc" },
  });

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const qrSize = LABEL_HEIGHT - PADDING * 2;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let slot = 0;

  for (const label of labels) {
    if (slot === LABELS_PER_SHEET) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      slot = 0;
    }

    const col = slot % PIMACO_6180.columns;
    const row = Math.floor(slot / PIMACO_6180.columns);
    const cellX = MARGIN_LEFT + col * COL_PITCH;
    const cellTopY = PAGE_HEIGHT - MARGIN_TOP - row * ROW_PITCH;
    const cellBottomY = cellTopY - LABEL_HEIGHT;

    const qrDataUrl = await QRCode.toDataURL(labelVinculoUrl(label.code), { margin: 0, width: 300 });
    const qrPngBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
    const qrImage = await pdfDoc.embedPng(qrPngBytes);

    const qrX = cellX + PADDING;
    const qrY = cellBottomY + PADDING;
    page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    const textSize = 9;
    const textX = qrX + qrSize + PADDING;
    const textY = cellBottomY + LABEL_HEIGHT / 2 - textSize / 2.5;
    page.drawText(label.code, {
      x: textX,
      y: textY,
      size: textSize,
      font,
      color: rgb(0.15, 0.1, 0.2),
    });

    slot++;
  }

  const pdfBytes = await pdfDoc.save();

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="etiquetas-pimaco-6180.pdf"',
    },
  });
}
