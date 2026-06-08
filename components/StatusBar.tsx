"use client";
import { useEffect, useState } from "react";

type Props = { apiUrl: string };

export default function StatusBar({ apiUrl }: Props) {
  const [alive, setAlive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then(r => r.ok ? setAlive(true) : setAlive(false))
      .catch(() => setAlive(false));
  }, [apiUrl]);

  const dot = alive === null ? "#888" : alive ? "#34d399" : "#f87171";
  const label = alive === null ? "Checking…" : alive ? "API connected" : "API unreachable — is Colab running?";

  return (
    <div style={{
      maxWidth: 1100,
      margin: "1.5rem auto 0",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.75rem",
      fontFamily: "'IBM Plex Mono', monospace",
      color: "var(--muted)",
    }}>
      <span style={{
        width: 8, height: 8,
        borderRadius: "50%",
        background: dot,
        display: "inline-block",
        boxShadow: alive ? `0 0 6px ${dot}` : "none",
        flexShrink: 0,
      }} />
      {label}
      <span style={{ marginLeft: "auto", opacity: 0.5 }}>{apiUrl}</span>
    </div>
  );
}
