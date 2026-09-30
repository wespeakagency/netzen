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

  return (
    <div className="gate-shell">
      <div className="gate-panel">
        <section className="gate-brand" aria-label="Netzen dashboard interno">
          <img src={isotype} alt="" className="gate-isotype" aria-hidden="true" />
          <p className="gate-kicker">Acceso seguro</p>
          <h1 className="gate-title">
            <span className="brand-red">Netzen</span> Dashboard interno
          </h1>
          <p className="gate-subtitle">
            Acceso restringido. Ingresa la contraseña para ver el backlog de leads.
          </p>
        </section>

        <section className="gate-card" aria-labelledby="gate-form-title">
          <div className="gate-card-header">
            <h2 id="gate-form-title" className="gate-form-title">
              Ingresa la contraseña
            </h2>
            <p className="gate-form-copy">Usa la clave interna del equipo para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="gate-form">
            <label htmlFor="gate-password" className="gate-label">
              Contraseña
            </label>
            <input
              id="gate-password"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              autoComplete="current-password"
              className="input-text gate-input"
              placeholder="Escribe la contraseña..."
              disabled={attempts >= 5}
            />

            {error && (
              <div className="gate-error" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary gate-submit"
              disabled={!value || attempts >= 5}
            >
              Entrar
            </button>
          </form>

          <div className="gate-footer">
            Ambiente de prueba · No es autenticación de producción
          </div>
        </section>
      </div>
    </div>
  );
}
