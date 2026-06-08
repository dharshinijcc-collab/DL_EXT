"use client";
import type { HistoryItem } from "@/app/page";

type Props = {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClose: () => void;
};

export default function HistoryPanel({ history, onSelectItem, onClose }: Props) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: "400px",
      height: "100vh",
      background: "var(--surface)",
      borderLeft: "1px solid var(--border)",
      padding: "1.5rem",
      overflowY: "auto",
      zIndex: 1000,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{
          fontSize: "1.2rem",
          fontWeight: 700,
          margin: 0,
        }}>
          📜 Extraction History
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)",
            fontSize: "1.2rem",
            padding: "0.25rem 0.75rem",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {history.length === 0 ? (
        <div style={{
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "0.9rem",
          marginTop: "2rem",
        }}>
          No saved extractions yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "1rem",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
            >
              <div style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                marginBottom: "0.5rem",
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                {formatDate(item.timestamp)}
              </div>
              
              {item.preview && (
                <img
                  src={item.preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: "0.75rem",
                  }}
                />
              )}

              <div style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: "0.5rem",
              }}>
                {item.doc_type}
              </div>

              <div style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
              }}>
                {Object.keys(item.extracted).length} fields extracted
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
