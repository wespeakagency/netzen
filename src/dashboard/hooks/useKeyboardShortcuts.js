import { useEffect } from "react";

export function useKeyboardShortcuts({
  selectedLead,
  selectedLeadId,
  showShortcuts,
  setShowShortcuts,
  onCloseDrawer,
  onOpenRelativeLead,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      const isEditableTarget =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        e.target?.isContentEditable;

      if (e.key === "Escape") {
        if (showShortcuts) {
          e.preventDefault();
          e.stopImmediatePropagation?.();
          setShowShortcuts(false);
          return;
        }
        if (!isEditableTarget && selectedLeadId) {
          onCloseDrawer();
        }
        return;
      }

      if (isEditableTarget) return;

      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts((value) => !value);
        return;
      }

      if (e.key === "/" && !e.shiftKey) {
        const searchInput = document.querySelector(".filter-search .input-text");
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
        return;
      }

      if (!selectedLead) return;

      const key = e.key.toLowerCase();
      if (key === "e" && selectedLead.work_email) {
        e.preventDefault();
        window.location.href = `mailto:${selectedLead.work_email}`;
      } else if (key === "w" && selectedLead.whatsapp) {
        e.preventDefault();
        window.open(`https://wa.me/${cleanPhone(selectedLead.whatsapp)}`, "_blank", "noopener,noreferrer");
      } else if (key === "j") {
        e.preventDefault();
        onOpenRelativeLead(1);
      } else if (key === "k") {
        e.preventDefault();
        onOpenRelativeLead(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCloseDrawer, onOpenRelativeLead, selectedLead, selectedLeadId, setShowShortcuts, showShortcuts]);
}

function cleanPhone(phone) {
  return String(phone).replace(/[^\d+]/g, "");
}
