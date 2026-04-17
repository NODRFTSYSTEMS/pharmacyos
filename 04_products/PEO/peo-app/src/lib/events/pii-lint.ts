// PII Event Linting — prevents prohibited fields from entering analytics payloads
// Prohibited: full address, full name, email, phone, SSN, account numbers, unredacted upload text

const PROHIBITED_KEYS = [
  "address",
  "fullAddress",
  "street",
  "fullName",
  "firstName",
  "lastName",
  "email",
  "phone",
  "ssn",
  "socialSecurityNumber",
  "accountNumber",
  "bankAccount",
  "uploadText",
  "documentText",
];

export function lintEventPayload(payload: Record<string, unknown>): {
  clean: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  function scan(obj: unknown, path = "") {
    if (obj === null || obj === undefined) return;

    if (typeof obj === "object" && !Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        const lowerKey = key.toLowerCase();
        if (
          PROHIBITED_KEYS.some(
            (prohibited) => lowerKey === prohibited.toLowerCase()
          )
        ) {
          violations.push(currentPath);
        }
        scan(value, currentPath);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, idx) => scan(item, `${path}[${idx}]`));
    } else if (typeof obj === "string") {
      // Basic SSN pattern detection
      if (/^\d{3}-\d{2}-\d{4}$/.test(obj)) {
        violations.push(`${path} (SSN pattern detected)`);
      }
    }
  }

  scan(payload);

  return {
    clean: violations.length === 0,
    violations,
  };
}

export function sanitizeEventPayload(
  payload: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase();
    if (
      PROHIBITED_KEYS.some(
        (prohibited) => lowerKey === prohibited.toLowerCase()
      )
    ) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeEventPayload(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }

  return result;
}
