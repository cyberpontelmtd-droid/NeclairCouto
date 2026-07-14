"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

function CameraCaptureModal({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
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
      } catch {
        setError("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvas.toDataURL("image/jpeg", 0.9));
  }

  function usePhoto() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], `foto-${Date.now()}.jpg`, { type: "image/jpeg" }));
        onClose();
      },
      "image/jpeg",
      0.9
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-4 w-full max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-brand-dark">Tirar foto</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2">{error}</p>
        )}

        <div className={captured ? "hidden" : ""}>
          <video ref={videoRef} muted playsInline className="w-full rounded-lg bg-black aspect-square object-cover" />
        </div>
        {captured && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={captured} alt="Prévia" className="w-full rounded-lg aspect-square object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-3 mt-3">
          {captured ? (
            <>
              <button
                type="button"
                onClick={() => setCaptured(null)}
                className="flex-1 border border-brand-purple text-brand-purple rounded-full py-2 text-sm font-bold"
              >
                Refazer
              </button>
              <button
                type="button"
                onClick={usePhoto}
                className="flex-1 bg-brand-purple text-white rounded-full py-2 text-sm font-bold"
              >
                Usar foto
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={takePhoto}
              disabled={!!error}
              className="flex-1 bg-brand-purple text-white rounded-full py-2 text-sm font-bold disabled:opacity-50"
            >
              Tirar foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PhotoCapture({ name = "images" }: { name?: string }) {
  const [pending, setPending] = useState<File[]>([]);
  const [capturing, setCapturing] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => pending.map((f) => URL.createObjectURL(f)), [pending]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  useEffect(() => {
    if (!hiddenInputRef.current || typeof DataTransfer === "undefined") return;
    try {
      const dt = new DataTransfer();
      pending.forEach((f) => dt.items.add(f));
      hiddenInputRef.current.files = dt.files;
    } catch {
      // Older browsers may not support assigning a synthesized FileList;
      // pending photos just won't be attached to the hidden input in that case.
    }
  }, [pending]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    setPending((prev) => [...prev, ...Array.from(files)]);
  }

  function removeAt(index: number) {
    setPending((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {previews.map((url, i) => (
            <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <label className="text-sm text-brand-purple hover:underline cursor-pointer">
          Escolher da galeria
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => setCapturing(true)}
          className="inline-flex items-center gap-1 text-sm text-brand-purple hover:underline"
        >
          <Camera size={14} />
          Tirar foto
        </button>
      </div>

      <input ref={hiddenInputRef} type="file" name={name} multiple className="hidden" />

      {capturing && (
        <CameraCaptureModal onCapture={(file) => setPending((prev) => [...prev, file])} onClose={() => setCapturing(false)} />
      )}
    </div>
  );
}
