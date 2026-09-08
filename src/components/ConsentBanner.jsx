import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./ui.jsx";
import {
  acceptAll,
  denyAll,
  hasChoice,
  applyStoredConsent,
  CONSENT_CHANGED_EVENT
} from "../lib/consent.js";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    applyStoredConsent();
    if (!hasChoice()) setVisible(true);

    const onExternalChange = () => setVisible(!hasChoice());
    const onOpenRequest = () => setVisible(true);

    window.addEventListener(CONSENT_CHANGED_EVENT, onExternalChange);
    window.addEventListener("netzen:consent-open", onOpenRequest);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onExternalChange);
      window.removeEventListener("netzen:consent-open", onOpenRequest);
    };
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    acceptAll("banner");
    setVisible(false);
  };
  const handleDeny = () => {
    denyAll("banner");
    setVisible(false);
  };

  return (
    <div className="consent-banner" role="dialog" aria-label="Preferencias de cookies" aria-live="polite">
      <div className="consent-banner__inner">
        <div className="consent-banner__body">
          <div className="consent-banner__icon" aria-hidden="true">
            <Icon name="ShieldCheck" size={22} />
          </div>
          <div>
            <h2 className="consent-banner__title">Cookies y medición</h2>
            <p className="consent-banner__text">
              Usamos cookies propias y de terceros (Meta, Google) para entender cómo se usa el sitio y mejorar tu experiencia.
              Puedes aceptar, rechazar o consultar el detalle en nuestro{" "}
              <Link to="/legal/privacidad">Aviso de Privacidad</Link>.
            </p>
          </div>
        </div>
        <div className="consent-banner__actions">
          <button type="button" className="consent-banner__btn consent-banner__btn--ghost" onClick={handleDeny}>
            Rechazar no esenciales
          </button>
          <button type="button" className="consent-banner__btn consent-banner__btn--primary" onClick={handleAccept}>
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}

export function openConsentBanner() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("netzen:consent-open"));
}
