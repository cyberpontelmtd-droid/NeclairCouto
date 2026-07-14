import Link from "next/link";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { labelVinculoUrl } from "@/lib/siteUrl";
import { PIMACO_6180, LABELS_PER_SHEET } from "@/lib/labelSheets";
import { PrintButton } from "../../imprimir/PrintButton";
import { AutoDownload } from "./AutoDownload";

export default async function ImprimirLoteEtiquetasPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids } = await searchParams;
  const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];

  const labels = await prisma.label.findMany({
    where: { id: { in: idList } },
    orderBy: { code: "asc" },
  });

  const rendered = await Promise.all(
    labels.map(async (label, index) => ({
      ...label,
      qrDataUrl: await QRCode.toDataURL(labelVinculoUrl(label.code), { margin: 1, width: 200 }),
      slot: index % LABELS_PER_SHEET,
      page: Math.floor(index / LABELS_PER_SHEET),
    }))
  );

  const pageCount = rendered.length === 0 ? 0 : Math.floor((rendered.length - 1) / LABELS_PER_SHEET) + 1;
  const pages = Array.from({ length: pageCount }, (_, i) => rendered.filter((l) => l.page === i));

  const pdfHref = `/admin/etiquetas/lote/pdf?${idList.map((id) => `ids=${id}`).join("&")}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Etiquetas geradas</h1>
          <Link href="/admin/etiquetas" className="text-sm text-brand-purple hover:underline">
            ← Voltar
          </Link>
          <p className="text-xs text-gray-400 mt-1">Layout calibrado para folha Pimaco 6180 (Carta, 30/folha).</p>
        </div>
        <div className="flex gap-3">
          <a
            href={pdfHref}
            download="etiquetas-pimaco-6180.pdf"
            className="bg-white border border-brand-purple text-brand-purple px-6 py-2 rounded-full hover:bg-brand-purple/5 transition-colors text-sm font-bold"
          >
            Baixar PDF
          </a>
          <PrintButton />
        </div>
      </div>

      {rendered.length === 0 ? (
        <p className="text-gray-400 print:hidden">Nenhuma etiqueta encontrada.</p>
      ) : (
        pages.map((pageLabels, pageIndex) => (
          <div
            key={pageIndex}
            className="relative bg-white mx-auto mb-8 print:mb-0 shadow print:shadow-none print:break-after-page"
            style={{ width: `${PIMACO_6180.pageWidthIn}in`, height: `${PIMACO_6180.pageHeightIn}in` }}
          >
            {pageLabels.map((label) => {
              const col = label.slot % PIMACO_6180.columns;
              const row = Math.floor(label.slot / PIMACO_6180.columns);
              return (
                <div
                  key={label.id}
                  className="absolute flex items-center gap-1 overflow-hidden border border-dashed border-gray-300"
                  style={{
                    left: `${PIMACO_6180.marginLeftIn + col * PIMACO_6180.colPitchIn}in`,
                    top: `${PIMACO_6180.marginTopIn + row * PIMACO_6180.rowPitchIn}in`,
                    width: `${PIMACO_6180.labelWidthIn}in`,
                    height: `${PIMACO_6180.labelHeightIn}in`,
                    padding: "0.08in",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={label.qrDataUrl} alt={label.code} style={{ height: "0.84in", width: "0.84in" }} />
                  <span className="font-mono font-bold text-brand-dark text-[9px] leading-tight">{label.code}</span>
                </div>
              );
            })}
          </div>
        ))
      )}

      <AutoDownload href={pdfHref} />

      <style>{`
        @media print {
          @page { size: letter; margin: 0; }
          body { margin: 0; }
        }
      `}</style>
    </div>
  );
}
