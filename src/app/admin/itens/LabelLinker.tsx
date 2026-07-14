"use client";

import { useState } from "react";
import { QrCode, X } from "lucide-react";
import { QrScanModal } from "../QrScanModal";

function parseLabelCode(text: string): string | null {
  try {
    const url = new URL(text);
    const match = url.pathname.match(/\/admin\/etiquetas\/vincular\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function LabelLinker({
  existingCodes = [],
  initialCodes = [],
}: {
  existingCodes?: string[];
  initialCodes?: string[];
}) {
  const [codes, setCodes] = useState<string[]>(initialCodes);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function addCode(raw: string) {
    const code = raw.trim();
    if (!code) return;
    if (existingCodes.includes(code) || codes.includes(code)) {
      setMessage("Essa etiqueta já está na lista.");
      return;
    }
    setCodes((prev) => [...prev, code]);
    setMessage(null);
  }

  function handleScanned(text: string) {
    setScanning(false);
    const code = parseLabelCode(text);
    if (!code) {
      setMessage("Esse QR code não é de uma etiqueta válida.");
      return;
    }
    addCode(code);
  }

  function removeCode(code: string) {
    setCodes((prev) => prev.filter((c) => c !== code));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-brand-dark mb-1">Etiquetas vinculadas</label>
      <p className="text-xs text-gray-400 mb-2">
        Vincule mais de uma etiqueta para representar várias peças iguais no mesmo cadastro.
      </p>

      {(existingCodes.length > 0 || codes.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {existingCodes.map((code) => (
            <span key={code} className="font-mono text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {code}
            </span>
          ))}
          {codes.map((code) => (
            <span
              key={code}
              className="font-mono text-xs bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full inline-flex items-center gap-1"
            >
              {code}
              <button type="button" onClick={() => removeCode(code)} aria-label={`Remover ${code}`}>
                <X size={12} />
              </button>
              <input type="hidden" name="labelCodes" value={code} />
            </span>
          ))}
        </div>
      )}

      {message && <p className="text-xs text-red-600 mb-2">{message}</p>}

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => {
            setMessage(null);
            setScanning(true);
          }}
          className="inline-flex items-center gap-2 bg-white border border-brand-purple text-brand-purple px-4 py-2 rounded-full hover:bg-brand-purple/5 transition-colors text-sm font-bold"
        >
          <QrCode size={16} />
          Escanear etiqueta
        </button>
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Ou digite o código"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
        <button
          type="button"
          onClick={() => {
            addCode(manualCode);
            setManualCode("");
          }}
          className="text-sm text-brand-purple hover:underline"
        >
          Adicionar
        </button>
      </div>

      {scanning && <QrScanModal onDetected={handleScanned} onClose={() => setScanning(false)} />}
    </div>
  );
}
