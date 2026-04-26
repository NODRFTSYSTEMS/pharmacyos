"use client";

import posthog from "posthog-js";
import { lintEventPayload } from "./pii-lint";

type TrackableEvent =
  | { event: "estimator_completed"; props: { mode: string; strategy?: string } }
  | { event: "application_submitted"; props: { applicationId: string; context: string } }
  | { event: "result_viewed"; props: { applicationId: string; confidenceTier?: string } }
  | { event: "upgrade_clicked"; props: { from: string; targetTier: string; location: string } }
  | { event: "signed_up"; props: { method?: string } };

export function track({ event, props }: TrackableEvent) {
  const { clean, violations } = lintEventPayload(props as Record<string, unknown>);
  if (!clean) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PEO analytics] PII violation blocked event "${event}":`, violations);
    }
    return;
  }
  posthog.capture(event, props);
}
