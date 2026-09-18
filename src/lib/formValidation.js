const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFields(values, rules) {
  const errors = {};
  for (const [key, rule] of Object.entries(rules)) {
    const value = String(values[key] ?? "").trim();
    if (rule.required && !value) {
      errors[key] = rule.message || "Este campo es obligatorio.";
      continue;
    }
    if (value && rule.email && !EMAIL_RE.test(value)) {
      errors[key] = rule.emailMessage || "Ingresa un correo válido.";
    }
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
