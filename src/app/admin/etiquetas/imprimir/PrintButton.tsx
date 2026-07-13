"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden bg-brand-purple text-white px-6 py-2 rounded-full hover:bg-brand-dark transition-colors text-sm font-bold"
    >
      Imprimir
    </button>
  );
}
