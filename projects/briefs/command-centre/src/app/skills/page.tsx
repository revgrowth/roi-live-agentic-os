"use client";

import { AppShell } from "@/components/layout/app-shell";
import { SkillsGrid } from "@/components/skills/skills-grid";

export default function SkillsPage() {
  return (
    <AppShell title="Skills">
      <SkillsGrid />
    </AppShell>
  );
}
