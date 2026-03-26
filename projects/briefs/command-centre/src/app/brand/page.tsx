"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BrandCardGrid } from "@/components/brand/brand-card-grid";
import { BrandDetailPanel } from "@/components/brand/brand-detail-panel";

export default function BrandPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <AppShell title="Brand">
      <BrandCardGrid onSelectFile={setSelectedFile} />
      <BrandDetailPanel path={selectedFile} onClose={() => setSelectedFile(null)} />
    </AppShell>
  );
}
