"use client";

import type { KeyboardEvent } from "react";

export type ProjectWorkspaceTab = "overview" | "files" | "messages" | "revisions";

type ProjectTabsProps = Readonly<{
  activeTab: ProjectWorkspaceTab;
  onChange: (nextTab: ProjectWorkspaceTab) => void;
}>;

const TAB_ITEMS: ReadonlyArray<{ key: ProjectWorkspaceTab; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "files", label: "Files" },
  { key: "messages", label: "Messages" },
  { key: "revisions", label: "Revisions" },
];

/**
 * Bespoke tab rail for workspace section navigation.
 * Edge case: keyboard navigation wraps at boundaries for continuous arrow-key movement.
 */
export default function ProjectTabs({ activeTab, onChange }: ProjectTabsProps) {
  const activeIndex = TAB_ITEMS.findIndex((item) => item.key === activeTab);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (activeIndex < 0) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (activeIndex + 1) % TAB_ITEMS.length;
      onChange(TAB_ITEMS[nextIndex].key);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = (activeIndex - 1 + TAB_ITEMS.length) % TAB_ITEMS.length;
      onChange(TAB_ITEMS[nextIndex].key);
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(TAB_ITEMS[0].key);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(TAB_ITEMS[TAB_ITEMS.length - 1].key);
    }
  };

  return (
    <div className="project-tabs" aria-label="Project workspace sections" role="tablist">
      {TAB_ITEMS.map((item) => (
        <button
          aria-controls={`project-panel-${item.key}`}
          aria-selected={item.key === activeTab}
          className={[
            "project-tabs__trigger",
            item.key === activeTab ? "project-tabs__trigger--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          id={`project-tab-${item.key}`}
          key={item.key}
          onClick={() => onChange(item.key)}
          onKeyDown={handleKeyDown}
          role="tab"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
