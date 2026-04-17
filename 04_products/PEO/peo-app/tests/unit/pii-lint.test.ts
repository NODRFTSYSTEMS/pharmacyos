import { describe, it, expect } from "vitest";
import { lintEventPayload, sanitizeEventPayload } from "@/lib/events/pii-lint";

describe("PII linting", () => {
  it("passes clean payload", () => {
    const result = lintEventPayload({
      event: "button_click",
      page: "/pricing",
      userId: "abc-123",
    });
    expect(result.clean).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("detects prohibited keys", () => {
    const result = lintEventPayload({
      event: "form_submit",
      address: "123 Main St",
      email: "test@example.com",
    });
    expect(result.clean).toBe(false);
    expect(result.violations).toContain("address");
    expect(result.violations).toContain("email");
  });

  it("detects nested prohibited keys", () => {
    const result = lintEventPayload({
      event: "profile_update",
      data: {
        fullName: "John Doe",
        preferences: { theme: "dark" },
      },
    });
    expect(result.clean).toBe(false);
    expect(result.violations).toContain("data.fullName");
  });

  it("detects SSN pattern in string value", () => {
    const result = lintEventPayload({
      event: "verification",
      ssnValue: "123-45-6789",
    });
    expect(result.clean).toBe(false);
    expect(result.violations.some((v) => v.includes("SSN"))).toBe(true);
  });

  it("sanitizes prohibited keys", () => {
    const result = sanitizeEventPayload({
      event: "form_submit",
      address: "123 Main St",
      email: "test@example.com",
      safeField: "ok",
    });
    expect(result.address).toBe("[REDACTED]");
    expect(result.email).toBe("[REDACTED]");
    expect(result.safeField).toBe("ok");
  });
});
