"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-sm text-center">
        <h1 className="text-lg font-bold text-brand-dark mb-2">Ops, algo deu errado</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ocorreu um erro inesperado nesta tela. Tente novamente — se persistir, volte ao painel e
          tente de outro jeito.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-brand-purple text-white font-bold px-6 py-2 rounded-full hover:bg-brand-dark transition-colors"
          >
            Tentar novamente
          </button>
          <Link href="/admin" className="text-sm text-brand-purple hover:underline">
            Voltar ao painel
          </Link>
        </div>
      </div>
    </div>
  );
}
