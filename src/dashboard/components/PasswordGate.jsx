import React, { useState } from "react";
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
      setError("Demasiados intentos fallidos. Recargá la página para intentar de nuevo.");
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
      <div className="gate-card">
        <div className="gate-brand">
          <span className="brand-red">Netzen</span>
        </div>
        <h1 className="gate-title">Dashboard interno</h1>
        <p className="gate-subtitle">
          Acceso restringido. Ingresá la contraseña para ver el backlog de leads.
        </p>

        <form onSubmit={handleSubmit} className="gate-form">
          <label htmlFor="password" className="gate-label">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="input-text gate-input"
            placeholder="Escribí la contraseña..."
            disabled={attempts >= 5}
          />

          {error && <div className="gate-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary gate-submit"
            disabled={!value || attempts >= 5}
          >
            Entrar
          </button>
        </form>

        <div className="gate-footer">
          Prueba interna · No es auth de producción
        </div>
      </div>
    </div>
  );
}
