"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { confirmSale } from "./actions";

type SaleLine = { itemId: string; name: string; sku: string; price: number; quantity: number };
type AvailableItem = { id: string; name: string; sku: string; price: number };

export function ConfirmSaleForm({
  reservationId,
  initialLines,
  availableItems,
}: {
  reservationId: string;
  initialLines: SaleLine[];
  availableItems: AvailableItem[];
}) {
  const router = useRouter();
  const [lines, setLines] = useState<SaleLine[]>(initialLines);
  const [addingId, setAddingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const addableItems = availableItems.filter((i) => !lines.some((l) => l.itemId === i.id));

  function setQty(itemId: string, qty: number) {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.itemId !== itemId) : prev.map((l) => (l.itemId === itemId ? { ...l, quantity: qty } : l))
    );
  }

  function addItem() {
    const item = availableItems.find((i) => i.id === addingId);
    if (!item) return;
    setLines((prev) => [...prev, { itemId: item.id, name: item.name, sku: item.sku, price: item.price, quantity: 1 }]);
    setAddingId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.length === 0) {
      setError("Adicione ao menos uma peça.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await confirmSale({
        reservationId,
        items: lines.map((l) => ({ itemId: l.itemId, quantity: l.quantity })),
      });
      router.push("/admin/reservas");
    } catch {
      setError("Não foi possível confirmar a venda. Tente novamente.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5 max-w-xl">
      {lines.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhuma peça na venda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {lines.map((line) => (
            <li key={line.itemId} className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0">
              <div>
                <p className="font-medium text-brand-dark">{line.name}</p>
                <p className="text-xs text-gray-400 font-mono">{line.sku}</p>
                <p className="text-xs text-gray-500">
                  {line.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} / un.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-brand-pink/30 rounded-full px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setQty(line.itemId, line.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-brand-purple hover:bg-white rounded-full transition-colors"
                    aria-label="Diminuir"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-bold text-brand-dark text-sm">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQty(line.itemId, line.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-brand-purple hover:bg-white rounded-full transition-colors"
                    aria-label="Aumentar"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setQty(line.itemId, 0)}
                  aria-label={`Remover ${line.name}`}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {addableItems.length > 0 && (
        <div className="flex gap-2 items-center">
          <select
            value={addingId}
            onChange={(e) => setAddingId(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="">Adicionar outra peça...</option>
            {addableItems.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.sku})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addItem}
            disabled={!addingId}
            className="text-sm text-brand-purple hover:underline disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="font-bold text-brand-dark">Total</span>
        <span className="font-bold text-brand-purple text-lg">
          {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting || lines.length === 0}
        className="self-start bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50"
      >
        {submitting ? "Confirmando..." : "Confirmar venda e dar baixa no estoque"}
      </button>
    </form>
  );
}
