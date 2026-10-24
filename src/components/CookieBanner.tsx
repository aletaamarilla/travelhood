import { useState, useEffect } from "react";

import { getStoredConsent, saveConsent, type CookieConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }

    const handleReopen = () => {
      const current = getStoredConsent();
      if (current) {
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
      }
      setShowCustomize(true);
      setVisible(true);
    };

    window.addEventListener("openCookieBanner", handleReopen);
    return () => window.removeEventListener("openCookieBanner", handleReopen);
  }, []);

  function accept(consent: CookieConsent) {
    if (!saveConsent(consent)) {
      setAnalytics(false);
      setMarketing(false);
      setStorageError(true);
      return;
    }
    setStorageError(false);
    setVisible(false);
    setShowCustomize(false);
  }

  function handleAcceptAll() {
    accept({ necessary: true, analytics: true, marketing: true });
  }

  function handleRejectAll() {
    accept({ necessary: true, analytics: false, marketing: false });
  }

  function handleSaveCustom() {
    accept({ necessary: true, analytics, marketing });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#0B2E3A] p-6 shadow-2xl shadow-black/40">
        {storageError && <p role="alert" className="mb-4 text-sm text-white">No hemos podido guardar tus preferencias. Las cookies opcionales están desactivadas en esta página.</p>}
        {!showCustomize ? (
          <>
            <p className="text-sm leading-relaxed text-white/80">
              Usamos cookies para mejorar tu experiencia en nuestra web. Puedes aceptar todas,
              solo las necesarias o personalizar tus preferencias.{" "}
              <a
                href="/legal/politica-de-cookies/"
                className="underline text-[#0E94B0] hover:text-white transition-colors"
              >
                Más información
              </a>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAcceptAll}
                className="rounded-lg bg-[#0E94B0] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0b7d95]"
              >
                Aceptar todas
              </button>
              <button
                onClick={handleRejectAll}
                className="rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Solo necesarias
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Personalizar
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-serif text-lg font-bold text-white mb-4">Preferencias de cookies</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-white">Necesarias</span>
                  <p className="text-xs text-white/50 mt-0.5">Imprescindibles para el funcionamiento del sitio</p>
                </div>
                <input type="checkbox" checked disabled className="h-5 w-5 accent-[#0E94B0] cursor-not-allowed" />
              </label>
              <label className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-white">Analíticas</span>
                  <p className="text-xs text-white/50 mt-0.5">Nos ayudan a entender cómo usas la web</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-5 w-5 accent-[#0E94B0] cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-white">Marketing</span>
                  <p className="text-xs text-white/50 mt-0.5">Permiten mostrarte contenido y anuncios relevantes</p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-5 w-5 accent-[#0E94B0] cursor-pointer"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveCustom}
                className="rounded-lg bg-[#0E94B0] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0b7d95]"
              >
                Guardar preferencias
              </button>
              <button
                onClick={() => setShowCustomize(false)}
                className="rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Volver
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
