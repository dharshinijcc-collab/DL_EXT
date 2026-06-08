"use client";
import { useRef, DragEvent } from "react";

type Props = {
  localSrc:  string;
  loading:   boolean;
  stage:     string;
  hasFile:   boolean;
  error:     string;
  onFile:    (f: File) => void;
  onSubmit:  () => void;
  queueSize?: number;
};

export default function UploadPanel({ localSrc, loading, stage, hasFile, error, onFile, onSubmit, queueSize }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        onFile(files[i]);
      }
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.type.startsWith("image/") || f.name.endsWith('.heic') || f.name.endsWith('.heif')) {
          onFile(f);
        }
      }
    }
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: `2px dashed ${localSrc ? "var(--accent)" : "var(--border-hi)"}`,
          borderRadius: 12,
          padding: "1.5rem",
          cursor: "pointer",
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          transition: "border-color 0.2s",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          style={{ display: "none" }}
          onChange={pick}
        />

        {localSrc ? (
          /* Preview */
          <img
            src={localSrc}
            alt="preview"
            style={{
              maxHeight: 200,
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        ) : (
          /* Placeholder */
          <div style={{ textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📤</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              Click or drag an ID image here
            </div>
            <div style={{ fontSize: "0.78rem" }}>
              Driver License · Passport · iPhone Photos (HEIC/HEIF) &nbsp;—&nbsp; any background OK
            </div>
          </div>
        )}

        {/* Scanning overlay */}
        {loading && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(9,12,16,0.75)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "0.75rem", borderRadius: 10,
          }}>
            <div style={{
              width: 40, height: 40,
              border: "3px solid var(--border)",
              borderTop: "3px solid var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <span style={{
              fontSize: "0.82rem",
              color: "var(--accent-hi)",
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {stage}
            </span>
          </div>
        )}
      </div>

      {/* Button */}
      <button
        onClick={onSubmit}
        disabled={!hasFile || loading}
        className={loading ? "scanning-btn" : ""}
        style={{
          width: "100%",
          padding: "0.85rem",
          background: hasFile && !loading ? "var(--accent)" : "var(--border)",
          color: hasFile && !loading ? "white" : "var(--muted)",
          border: "none",
          borderRadius: 10,
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: hasFile && !loading ? "pointer" : "not-allowed",
          transition: "background 0.2s, transform 0.1s",
          letterSpacing: "0.02em",
        }}
        onMouseDown={e => { if (!loading)(e.currentTarget.style.transform = "scale(0.98)") }}
        onMouseUp={e   => { e.currentTarget.style.transform = "scale(1)" }}
      >
        {loading ? "⏳ Processing…" : queueSize && queueSize > 1 ? `🔍 Process Queue (${queueSize} files)` : "🔍 Scan & Extract"}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          background: "#1a0a0a",
          border: "1px solid #7f1d1d",
          borderRadius: 10,
          padding: "0.75rem 1rem",
          fontSize: "0.82rem",
          color: "#fca5a5",
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          ⚠️ {error}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
