"use client";

import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { createReservation } from "./actions";

export type CatalogItem = {
  id: string;
  name: string;
  material: string | null;
  price: number;
  categoryName: string | null;
  imageFilename: string | null;
};

export function CatalogGrid({ items }: { items: CatalogItem[] }) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const selectedIds = Object.keys(selected).filter((id) => selected[id] > 0);
  const totalQty = selectedIds.reduce((sum, id) => sum + selected[id], 0);
  const totalPrice = selectedIds.reduce((sum, id) => {
    const item = items.find((i) => i.id === id);
    return sum + (item ? item.price * selected[id] : 0);
  }, 0);

  function setQty(id: string, qty: number) {
    setSelected((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await createReservation({
        customerName,
        contact,
        items: selectedIds.map((id) => ({ itemId: id, quantity: selected[id] })),
      });
      if (res.success) {
        setResult("success");
        setSelected({});
        setCustomerName("");
        setContact("");
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item) => {
          const qty = selected[item.id] ?? 0;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-brand-accent"
            >
              <div className="relative w-full aspect-square bg-brand-pink/30">
                {item.imageFilename ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/uploads/${item.imageFilename}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-purple/40 text-sm">
                    Sem foto
                  </div>
                )}
              </div>
              <div className="p-6">
                {item.categoryName && (
                  <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                    {item.categoryName}
                  </span>
                )}
                <h3 className="text-lg font-bold text-brand-dark mt-1 mb-1">{item.name}</h3>
                {item.material && <p className="text-sm text-gray-500 mb-2">{item.material}</p>}
                <p className="text-brand-purple font-bold mb-4">
                  {item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>

                {qty === 0 ? (
                  <button
                    type="button"
                    onClick={() => setQty(item.id, 1)}
                    className="w-full bg-brand-purple text-white font-bold py-2 rounded-full hover:bg-brand-dark transition-colors text-sm"
                  >
                    Reservar
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-brand-pink/30 rounded-full px-2 py-1">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty - 1)}
                      className="w-8 h-8 flex items-center justify-center text-brand-purple hover:bg-white rounded-full transition-colors"
                      aria-label="Diminuir"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-brand-dark">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-brand-purple hover:bg-white rounded-full transition-colors"
                      aria-label="Aumentar"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 px-4 py-3">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-brand-dark">
              <strong>{totalQty}</strong> peça{totalQty > 1 ? "s" : ""} selecionada{totalQty > 1 ? "s" : ""} ·{" "}
              <span className="text-brand-purple font-bold">
                {totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="bg-brand-purple text-white font-bold px-6 py-2 rounded-full hover:bg-brand-dark transition-colors text-sm whitespace-nowrap"
            >
              Continuar reserva
            </button>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-brand-dark">Confirmar reserva</h2>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            {result === "success" ? (
              <div className="text-center py-6">
                <p className="text-brand-dark font-bold mb-2">Reserva enviada!</p>
                <p className="text-sm text-gray-500 mb-6">
                  Entraremos em contato para confirmar sua reserva.
                </p>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="bg-brand-purple text-white font-bold px-6 py-2 rounded-full hover:bg-brand-dark transition-colors"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <ul className="text-sm text-gray-600 mb-2 space-y-1">
                  {selectedIds.map((id) => {
                    const item = items.find((i) => i.id === id);
                    if (!item) return null;
                    return (
                      <li key={id} className="flex justify-between">
                        <span>
                          {selected[id]}x {item.name}
                        </span>
                        <span>
                          {(item.price * selected[id]).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Seu nome *</label>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    WhatsApp ou e-mail para contato *
                  </label>
                  <input
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>

                {result === "error" && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    Não foi possível enviar sua reserva. Tente novamente.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-purple text-white font-bold py-3 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? "Enviando..." : "Confirmar reserva"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
