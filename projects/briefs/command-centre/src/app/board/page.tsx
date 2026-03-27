"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { KanbanBoard } from "@/components/board/kanban-board";
import { useTaskStore } from "@/store/task-store";

function BoardContent() {
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const searchParams = useSearchParams();
  const projectFilter = searchParams.get("project");
  const initialView = searchParams.get("view") as "board" | "tasks" | null;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return <KanbanBoard initialProjectFilter={projectFilter} initialView={initialView} />;
}

export default function BoardPage() {
  return (
    <AppShell title="Board">
      <Suspense>
        <BoardContent />
      </Suspense>
    </AppShell>
  );
}
