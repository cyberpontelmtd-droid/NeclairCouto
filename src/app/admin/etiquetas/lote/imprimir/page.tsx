import Link from "next/link";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { labelVinculoUrl } from "@/lib/siteUrl";
import { columnsForPerPage } from "@/lib/labelLayout";
import { PrintButton } from "../../imprimir/PrintButton";
import { AutoDownload } from "./AutoDownload";

export default async function ImprimirLoteEtiquetasPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[]; porFolha?: string }>;
}) {
  const { ids, porFolha } = await searchParams;
  const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];
  const perPage = Number(porFolha) || 12;
  const columns = columnsForPerPage(perPage);

  const labels = await prisma.label.findMany({
    where: { id: { in: idList } },
    orderBy: { code: "asc" },
  });

  const rendered = await Promise.all(
    labels.map(async (label) => ({
      ...label,
      qrDataUrl: await QRCode.toDataURL(labelVinculoUrl(label.code), { margin: 1, width: 200 }),
    }))
  );

  const pdfHref = `/admin/etiquetas/lote/pdf?${idList.map((id) => `ids=${id}`).join("&")}&porFolha=${perPage}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Etiquetas geradas</h1>
          <Link href="/admin/etiquetas" className="text-sm text-brand-purple hover:underline">
            ← Voltar
          </Link>
        </div>
        <div className="flex gap-3">
          <a
            href={pdfHref}
            download="etiquetas.pdf"
            className="bg-white border border-brand-purple text-brand-purple px-6 py-2 rounded-full hover:bg-brand-purple/5 transition-colors text-sm font-bold"
          >
            Baixar PDF
          </a>
          <PrintButton />
        </div>
      </div>

      {rendered.length === 0 ? (
        <p className="text-gray-400">Nenhuma etiqueta encontrada.</p>
      ) : (
        <div
          className="grid gap-4 print:gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {rendered.map((label) => (
            <div
              key={label.id}
              className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center break-inside-avoid"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={label.qrDataUrl} alt={label.code} className="w-24 h-24" />
              <p className="font-mono font-bold text-brand-dark mt-2">{label.code}</p>
            </div>
          ))}
        </div>
      )}

      <AutoDownload href={pdfHref} />

      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
        }
      `}</style>
    </div>
  );
}
