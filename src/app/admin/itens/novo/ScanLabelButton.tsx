"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { QrCode, X } from "lucide-react";

function parseLabelCode(text: string): string | null {
  try {
    const url = new URL(text);
    const match = url.pathname.match(/\/admin\/etiquetas\/vincular\/([^/]+)\/?$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function ScanLabelButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    function scanLoop() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scanLoop);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(scanLoop);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height);

      if (result?.data) {
        const code = parseLabelCode(result.data);
        if (code) {
          streamRef.current?.getTracks().forEach((t) => t.stop());
          router.push(`/admin/etiquetas/vincular/${code}`);
          return;
        }
        setError("Esse QR code não é de uma etiqueta válida.");
      }
      rafRef.current = requestAnimationFrame(scanLoop);
    }

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        scanLoop();
      } catch {
        setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      }
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 bg-white border border-brand-purple text-brand-purple px-5 py-2 rounded-full hover:bg-brand-purple/5 transition-colors text-sm font-bold"
      >
        <QrCode size={16} />
        Escanear etiqueta
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-brand-dark">Escanear etiqueta</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            {error ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">
                {error}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mb-2">Aponte a câmera para o QR code da etiqueta.</p>
            )}

            <video ref={videoRef} muted playsInline className="w-full rounded-lg bg-black aspect-square object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
}
