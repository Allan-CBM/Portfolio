"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export function Studio() {
  if (!isSanityConfigured) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#050505", color: "#fff", fontFamily: "system-ui", padding: 24 }}>
        <div style={{ maxWidth: 520 }}>
          <p style={{ color: "#6EE7FF", letterSpacing: "0.2em", fontSize: 12 }}>SANITY STUDIO</p>
          <h1 style={{ fontSize: 32, margin: "12px 0" }}>Connect your Sanity project</h1>
          <p style={{ color: "#888", lineHeight: 1.6 }}>
            Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in <code>.env.local</code>, then
            restart the dev server. See README → “Sanity setup”.
          </p>
        </div>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
