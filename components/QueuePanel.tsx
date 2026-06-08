"use client";
import type { QueueItem } from "@/app/page";

type Props = {
  queue: QueueItem[];
  onSelectItem: (item: QueueItem) => void;
};

export default function QueuePanel({ queue, onSelectItem }: Props) {
  if (queue.length === 0) return null;

  const getStatusColor = (status: QueueItem["status"]) => {
    switch (status) {
      case "pending": return "#6b7280";
      case "processing": return "#3b82f6";
      case "completed": return "#10b981";
      case "error": return "#ef4444";
    }
  };

  const getStatusIcon = (status: QueueItem["status"]) => {
    switch (status) {
      case "pending": return "⏳";
      case "processing": return "🔄";
      case "completed": return "✅";
      case "error": return "❌";
    }
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "1.5rem",
      marginTop: "1.5rem",
    }}>
      <div style={{
        fontSize: "0.7rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--muted)",
        marginBottom: "1rem",
      }}>
        Queue ({queue.length} files)
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxHeight: 300,
        overflowY: "auto",
      }}>
        {queue.map((item, index) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
          >
            <span style={{ fontSize: "1.2rem" }}>{getStatusIcon(item.status)}</span>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {item.file.name}
              </div>
              <div style={{
                fontSize: "0.72rem",
                color: "var(--muted)",
                marginTop: "0.15rem",
              }}>
                {(item.file.size / 1024 / 1024).toFixed(2)} MB · {item.status}
              </div>
            </div>

            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: getStatusColor(item.status),
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
