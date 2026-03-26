"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTaskStore } from "@/store/task-store";

export function useSSE() {
  const [isConnected, setIsConnected] = useState(false);
  const retryDelay = useRef(3000);
  const eventSourceRef = useRef<EventSource | null>(null);
  const applySSEEvent = useTaskStore((s) => s.applySSEEvent);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource("/api/events");
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      setIsConnected(true);
      retryDelay.current = 3000; // Reset on successful connect
    });

    const taskEvents = [
      "task:created",
      "task:updated",
      "task:deleted",
      "task:status",
      "task:progress",
      "task:output",
    ];

    for (const eventType of taskEvents) {
      es.addEventListener(eventType, (e: MessageEvent) => {
        try {
          const event = JSON.parse(e.data);
          applySSEEvent(event);
        } catch {
          // Ignore malformed events
        }
      });
    }

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      eventSourceRef.current = null;

      // Reconnect with exponential backoff
      const delay = retryDelay.current;
      retryDelay.current = Math.min(delay * 2, 30000);
      setTimeout(connect, delay);
    };
  }, [applySSEEvent]);

  useEffect(() => {
    connect();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [connect]);

  return { isConnected };
}
