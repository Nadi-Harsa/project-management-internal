/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import polyfills from "@/lib/polyfills";

void polyfills;

const isHydrationNoiseMessage = (message: string) =>
  message.includes("Minified React error #418") || message.includes("Minified React error #423");

// React Router v7 SPA-mode prerenders a shell that structurally can't match the
// client render — a known unresolved framework issue. React re-renders client-
// side and continues fine, but leaves noisy #418/#423 in the console via three
// paths: onRecoverableError, window error events, and a direct console.error
// from the reconciler. All three are filtered here.
{
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    for (const arg of args) {
      const message = arg instanceof Error ? arg.message : typeof arg === "string" ? arg : "";
      if (isHydrationNoiseMessage(message)) return;
    }
    originalConsoleError(...args);
  };
}

window.addEventListener(
  "error",
  (event) => {
    const message = event.error instanceof Error ? event.error.message : event.message ?? "";
    if (isHydrationNoiseMessage(message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true
);

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
    {
      onRecoverableError: (error) => {
        const message = error instanceof Error ? error.message : String(error);
        if (isHydrationNoiseMessage(message)) return;
        console.error(error);
      },
    }
  );
});
