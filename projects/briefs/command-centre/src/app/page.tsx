"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { KanbanBoard } from "@/components/board/kanban-board";
import { useTaskStore } from "@/store/task-store";

export default function Home() {
  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <AppShell>
      <KanbanBoard />
    </AppShell>
  );
}
