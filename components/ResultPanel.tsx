"use client";
import { useState } from "react";
import type { ExtractResult } from "@/app/page";

type Props = { 
  result: ExtractResult | null; 
  loading: boolean;
  onVerify?: (verifiedData: Record<string, string>) => void;
  onSave?: () => void;
  isVerified?: boolean;
};

const CONF_STYLE: Record<string, { bg: string; color: string }> = {
  High:   { bg: "var(--high)",  color: "var(--high-t)"  },
  Medium: { bg: "var(--med)",   color: "var(--med-t)"   },
  Low:    { bg: "var(--low)",   color: "var(--low-t)"   },
};

const DOC_GRAD: Record<string, { from: string; to: string; icon: string }> = {
  "Passport":        { from: "var(--pass-from)", to: "var(--pass-to)", icon: "🛂" },
  "Driving License": { from: "var(--dl-from)",   to: "var(--dl-to)",   icon: "🪪" },
};

export default function ResultPanel({ result, loading, onVerify, onSave, isVerified }: Props) {
  const [editingData, setEditingData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  if (loading) {
    return (
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        color: "var(--muted)",
        fontSize: "0.9rem",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <div style={{
          width: 48, height: 48,
          border: "3px solid var(--border)",
          borderTop: "3px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem" }}>
          Waiting for results…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        color: "var(--muted)",
        fontSize: "0.9rem",
      }}>
        Upload an image to see results
      </div>
    );
  }

  const { doc_type, confidence, strategy, ocr_text, extracted, preview, cropped } = result;
  const grad   = DOC_GRAD[doc_type] || { from: "#1a1a2e", to: "#0f0f1a", icon: "📄" };
  const conf   = CONF_STYLE[confidence] || CONF_STYLE["Low"];

  // Initialize editing data when result changes
  if (result && Object.keys(editingData).length === 0) {
    setEditingData({ ...extracted });
  }

  const handleFieldChange = (key: string, value: string) => {
    setEditingData(prev => ({ ...prev, [key]: value }));
  };

  const handleVerify = () => {
    if (onVerify) {
      onVerify(editingData);
    }
    setIsEditing(false);
  };

  return (
    <div className="animate-fadeUp" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Type badge */}
      <div style={{
        background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "1.25rem 1.5rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "2.25rem" }}>{grad.icon}</span>
          <span style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
            {doc_type}
          </span>
          <span style={{
            marginLeft: "auto",
            background: conf.bg,
            color: conf.color,
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 20,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
            {confidence}
          </span>
        </div>
        <p style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.75rem",
          margin: "0.6rem 0 0",
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          OCR: Chandra OCR 2 &nbsp;·&nbsp; Crop: {strategy}
        </p>
      </div>

      {/* Annotated preview (yellow boundary) */}
      {preview && (
        <div style={{
          background: "#000",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
          maxHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img src={preview} alt="annotated"
            style={{ maxHeight: 180, maxWidth: "100%", objectFit: "contain" }} />
        </div>
      )}

      {/* Extracted fields */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "1.25rem",
      }}>
        <div style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--muted)",
          marginBottom: "0.85rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span>{isVerified ? "Verified Data" : "Extracted Fields"}</span>
          {!isVerified && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--accent)",
                fontSize: "0.7rem",
                padding: "4px 8px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {Object.entries(isEditing ? editingData : extracted).map(([k, v], i, arr) => (
          <div key={k} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "0.6rem",
            marginBottom: "0.6rem",
            borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
              {k.replace(/_/g, " ")}
            </span>
            {isEditing ? (
              <input
                type="text"
                value={editingData[k] || ""}
                onChange={(e) => handleFieldChange(k, e.target.value)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "4px 8px",
                  width: "60%",
                }}
              />
            ) : (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text)",
              }}>
                {String(v)}
              </span>
            )}
          </div>
        ))}

        {isEditing && (
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              onClick={handleVerify}
              style={{
                flex: 1,
                padding: "0.6rem",
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ✓ Verify
            </button>
          </div>
        )}
      </div>

      {/* Raw OCR */}
      <details style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
      }}>
        <summary style={{
          padding: "0.85rem 1.25rem",
          fontSize: "0.82rem",
          color: "var(--muted)",
          cursor: "pointer",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
        }}>
          🔬 Raw OCR text
          <span style={{ fontSize: "0.7rem" }}>▼</span>
        </summary>
        <pre style={{
          padding: "0 1.25rem 1rem",
          fontSize: "0.72rem",
          fontFamily: "'IBM Plex Mono', monospace",
          color: "rgba(232,237,242,0.65)",
          whiteSpace: "pre-wrap",
          overflowY: "auto",
          maxHeight: 200,
          margin: 0,
        }}>
          {ocr_text}
        </pre>
      </details>

      {/* Save button */}
      {!isVerified && !isEditing && (
        <button
          onClick={onSave}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "var(--accent-hi)"}
          onMouseOut={e => e.currentTarget.style.background = "var(--accent)"}
        >
          💾 Save to History
        </button>
      )}

      {isVerified && (
        <div style={{
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: 10,
          padding: "0.75rem",
          textAlign: "center",
          color: "#10b981",
          fontSize: "0.85rem",
          fontWeight: 600,
        }}>
          ✓ Saved to History
        </div>
      )}

    </div>
  );
}
