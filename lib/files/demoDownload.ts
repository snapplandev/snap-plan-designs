/**
 * Triggers a browser download for demo artifacts without a backend file store.
 * Edge case: no-op during server rendering when window/document are unavailable.
 */
export function downloadTextAsFile(filename: string, content: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const objectUrl = window.URL.createObjectURL(blob);
  const linkElement = document.createElement("a");
  linkElement.href = objectUrl;
  linkElement.download = filename;
  linkElement.rel = "noopener";

  document.body.append(linkElement);
  linkElement.click();
  linkElement.remove();

  window.setTimeout(() => {
    window.URL.revokeObjectURL(objectUrl);
  }, 0);
}
