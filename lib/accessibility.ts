// Focus management
export function focusElement(selector: string): void {
  const el = document.querySelector<HTMLElement>(selector);

  if (el) {
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Announce to screen readers without moving focus
export function announce(
  message: string,
  priority: "polite" | "assertive" = "polite",
): void {
  const el = document.getElementById(`sr-announcer-${priority}`);

  if (el) {
    el.textContent = "";
    setTimeout(() => {
      el.textContent = message;
    }, 100);
  }
}

// Generate accessible IDs
export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
