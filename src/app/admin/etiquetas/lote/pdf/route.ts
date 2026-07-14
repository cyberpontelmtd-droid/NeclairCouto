import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { labelVinculoUrl } from "@/lib/siteUrl";
import { columnsForPerPage } from "@/lib/labelLayout";

const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const MARGIN = 28;

export async function GET(request: NextRequest) {
  const idList = request.nextUrl.searchParams.getAll("ids");
  const perPage = Number(request.nextUrl.searchParams.get("porFolha")) || 12;
  const columns = columnsForPerPage(perPage);

  const labels = await prisma.label.findMany({
    where: { id: { in: idList } },
    orderBy: { code: "asc" },
  });

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const usableWidth = PAGE_WIDTH - MARGIN * 2;
  const usableHeight = PAGE_HEIGHT - MARGIN * 2;
  const cellWidth = usableWidth / columns;
  const rows = Math.ceil(perPage / columns);
  const cellHeight = usableHeight / rows;
  const qrSize = Math.min(cellWidth, cellHeight) * 0.6;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let slot = 0;

  for (const label of labels) {
    if (slot === perPage) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      slot = 0;
    }

    const col = slot % columns;
    const row = Math.floor(slot / columns);
    const cellX = MARGIN + col * cellWidth;
    const cellTopY = PAGE_HEIGHT - MARGIN - row * cellHeight;

    const qrDataUrl = await QRCode.toDataURL(labelVinculoUrl(label.code), { margin: 0, width: 300 });
    const qrPngBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
    const qrImage = await pdfDoc.embedPng(qrPngBytes);

    const qrX = cellX + (cellWidth - qrSize) / 2;
    const qrY = cellTopY - cellHeight * 0.15 - qrSize;
    page.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    const textWidth = font.widthOfTextAtSize(label.code, 9);
    page.drawText(label.code, {
      x: cellX + (cellWidth - textWidth) / 2,
      y: qrY - 14,
      size: 9,
      font,
      color: rgb(0.15, 0.1, 0.2),
    });

    slot++;
  }

  const pdfBytes = await pdfDoc.save();

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="etiquetas.pdf"',
    },
  });
}
