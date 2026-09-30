import React, { useState } from "react";
import isotype from "../../assets/netzen-isotipo-red.svg";
import { DASHBOARD_PASSWORD } from "../../lib/env.js";

const STORAGE_KEY = "netzen_dashboard_auth";

export function isAuthenticated() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorar
  }
}

export function PasswordGate({ onSuccess }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (attempts >= 5) {
      setError("Demasiados intentos fallidos. Recarga la página para intentar de nuevo.");
      return;
    }

    if (value === DASHBOARD_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignorar
      }
      onSuccess();
    } else {
      setAttempts((n) => n + 1);
      setError("Contraseña incorrecta.");
      setValue("");
    }
  };

  const locked = attempts >= 5;

  return (
    <div className="gate-shell">
      <aside className="gate-brand" aria-label="Netzen dashboard interno">
        <div className="gate-brand-grid" aria-hidden="true" />
        <div className="gate-brand-glow" aria-hidden="true" />

        <div className="gate-brand-top">
          <img src={isotype} alt="" className="gate-isotype" aria-hidden="true" />
          <span className="gate-brand-name">Netzen</span>
        </div>

        <div className="gate-brand-body">
          <p className="gate-kicker">Acceso seguro</p>
          <h1 className="gate-title">
            Dashboard
            <br />
            interno.
          </h1>
          <p className="gate-subtitle">
            Backlog de leads, scoring narrativo y seguimiento del equipo comercial.
          </p>
        </div>

        <div className="gate-brand-footer">
          <span>© {new Date().getFullYear()} Netzen</span>
          <span className="gate-dot" aria-hidden="true" />
          <span>Ambiente interno</span>
        </div>
      </aside>

      <main className="gate-card" aria-labelledby="gate-form-title">
        <div className="gate-card-inner">
          <div className="gate-card-header">
            <p className="gate-eyebrow">Iniciar sesión</p>
            <h2 id="gate-form-title" className="gate-form-title">
              Ingresa la contraseña
            </h2>
            <p className="gate-form-copy">Usa la clave interna del equipo para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="gate-form" noValidate>
            <label htmlFor="gate-password" className="gate-label">
              Contraseña
            </label>
            <div className={`gate-input-wrap${error ? " has-error" : ""}`}>
              <input
                id="gate-password"
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                autoComplete="current-password"
                className="gate-input"
                placeholder="••••••••"
                disabled={locked}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "gate-error" : undefined}
              />
              <button
                type="button"
                className="gate-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={-1}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {error && (
              <div id="gate-error" className="gate-error" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="gate-submit"
              disabled={!value || locked}
            >
              Entrar
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          {/* <p className="gate-hint">
            ¿Problemas para entrar? Contacta al admin del equipo.
          </p> */}
        </div>
      </main>
    </div>
  );
}
