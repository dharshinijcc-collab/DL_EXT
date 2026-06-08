"use client";
import { useState, useRef } from "react";
import UploadPanel from "@/components/UploadPanel";
import ResultPanel from "@/components/ResultPanel";
import StatusBar from "@/components/StatusBar";
import QueuePanel from "@/components/QueuePanel";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type ExtractResult = {
  doc_type:   string;
  confidence: string;
  strategy:   string;
  ocr_text:   string;
  extracted:  Record<string, string>;
  preview:    string;
  cropped:    string;
};

export type QueueItem = {
  file: File;
  id: string;
  status: "pending" | "processing" | "completed" | "error";
  result?: ExtractResult | null;
  error?: string;
};

export default function Home() {
  const [file,    setFile]    = useState<File | null>(null);
  const [localSrc,setLocalSrc]= useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<ExtractResult | null>(null);
  const [error,   setError]   = useState("");
  const [stage,   setStage]   = useState("");
  const [queue,   setQueue]   = useState<QueueItem[]>([]);

  const handleFile = (f: File) => {
    const newItem: QueueItem = {
      file: f,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
    };
    setQueue(prev => [...prev, newItem]);
    
    // Update current file preview to show the first pending file
    if (!file || loading) {
      setFile(f);
      setLocalSrc(URL.createObjectURL(f));
    }
    setResult(null);
    setError("");
    setStage("");
  };

  const processQueueItem = async (item: QueueItem): Promise<ExtractResult | null> => {
    const stages = [
      "Uploading image…",
      "Running smart crop…",
      "Chandra OCR scanning…",
      "Ollama extracting fields…",
    ];
    let si = 0;
    setStage(stages[si]);
    const interval = setInterval(() => {
      si = Math.min(si + 1, stages.length - 1);
      setStage(stages[si]);
    }, 4000);

    try {
      const form = new FormData();
      form.append("file", item.file);

      const res = await fetch(`${API_URL}/extract`, {
        method: "POST",
        body:   form,
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail?.detail || `Server error: ${res.status}`);
      }

      const data: ExtractResult = await res.json();
      return data;
    } catch (e: any) {
      throw e;
    } finally {
      clearInterval(interval);
    }
  };

  const handleSelectQueueItem = (item: QueueItem) => {
    setFile(item.file);
    setLocalSrc(URL.createObjectURL(item.file));
    if (item.result) {
      setResult(item.result);
    } else if (item.error) {
      setError(item.error);
    } else {
      setResult(null);
      setError("");
    }
  };

  const handleSubmit = async () => {
    const pendingItems = queue.filter(item => item.status === "pending");
    if (pendingItems.length === 0) return;

    setLoading(true);
    setError("");
    setResult(null);

    for (const item of pendingItems) {
      // Update item status to processing
      setQueue(prev => prev.map(q => 
        q.id === item.id ? { ...q, status: "processing" } : q
      ));

      // Update current file preview
      setFile(item.file);
      setLocalSrc(URL.createObjectURL(item.file));

      try {
        const result = await processQueueItem(item);
        
        // Update item status to completed with result
        setQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: "completed", result } : q
        ));
        
        // Show the most recent completed result
        setResult(result);
      } catch (e: any) {
        // Update item status to error
        setQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: "error", error: e.message } : q
        ));
        setError(e.message);
      }
    }

    setLoading(false);
    setStage("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2rem" }}>

      {/* Header */}
      <header style={{ maxWidth: 1100, margin: "0 auto 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "1.8rem" }}>🪪</span>
          <h1 style={{
            fontSize: "1.75rem", fontWeight: 800, margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Universal ID Extractor
          </h1>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
          Smart crop&nbsp;→&nbsp;Chandra OCR 2&nbsp;→&nbsp;Ollama / Qwen2.5 extraction
        </p>
      </header>

      {/* Main Grid */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
      }}
        className="id-grid"
      >
        {/* Left — upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <UploadPanel
            localSrc={localSrc}
            loading={loading}
            stage={stage}
            hasFile={!!file}
            onFile={handleFile}
            onSubmit={handleSubmit}
            error={error}
            queueSize={queue.filter(q => q.status === "pending").length}
          />
          
          {/* Queue Panel */}
          <QueuePanel queue={queue} onSelectItem={handleSelectQueueItem} />
        </div>

        {/* Right — result */}
        <ResultPanel result={result} loading={loading} />
      </div>

      {/* Status bar */}
      <StatusBar apiUrl={API_URL} />

      <style>{`
        @media (max-width: 720px) {
          .id-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
