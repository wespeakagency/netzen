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
      continue;
    }
    if (value && (rule.digitsMin || rule.digitsMax)) {
      const digits = value.replace(/\D/g, "");
      if (rule.digitsMin && digits.length < rule.digitsMin) {
        errors[key] = rule.digitsMessage || `Debe tener al menos ${rule.digitsMin} dígitos.`;
        continue;
      }
      if (rule.digitsMax && digits.length > rule.digitsMax) {
        errors[key] = rule.digitsMessage || `No debe tener más de ${rule.digitsMax} dígitos.`;
        continue;
      }
    }
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
