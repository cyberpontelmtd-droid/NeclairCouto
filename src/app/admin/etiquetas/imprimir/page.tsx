import Link from "next/link";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "./PrintButton";

export default async function ImprimirEtiquetasPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { ids } = await searchParams;
  const idList = ids ? (Array.isArray(ids) ? ids : [ids]) : [];

  const items = await prisma.item.findMany({
    where: { id: { in: idList } },
    orderBy: { name: "asc" },
  });

  const labels = await Promise.all(
    items.map(async (item) => ({
      ...item,
      qrDataUrl: await QRCode.toDataURL(item.sku, { margin: 1, width: 200 }),
    }))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Etiquetas para impressão</h1>
          <Link href="/admin/etiquetas" className="text-sm text-brand-purple hover:underline">
            ← Voltar para seleção
          </Link>
        </div>
        <PrintButton />
      </div>

      {labels.length === 0 ? (
        <p className="text-gray-400">Nenhuma peça selecionada.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 print:gap-2">
          {labels.map((label) => (
            <div
              key={label.id}
              className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center text-center break-inside-avoid"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={label.qrDataUrl} alt={label.sku} className="w-24 h-24" />
              <p className="font-mono font-bold text-brand-dark mt-2">{label.sku}</p>
              <p className="text-xs text-gray-600 leading-tight mt-1">{label.name}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media print {
          @page { size: A4; margin: 1cm; }
        }
      `}</style>
    </div>
  );
}
