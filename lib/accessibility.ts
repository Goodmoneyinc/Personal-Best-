import type { RefObject } from 'react';

let generatedIdCounter = 0;

function getLiveRegion(priority: 'polite' | 'assertive') {
  if (typeof document === 'undefined') {
    return null;
  }

  const regionId = `fulatelier-${priority}-announcer`;
  const existingRegion = document.getElementById(regionId);

  if (existingRegion) {
    return existingRegion;
  }

  const region = document.createElement('div');
  region.id = regionId;
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);

  return region;
}

export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite',
): void {
  const region = getLiveRegion(priority);

  if (!region) {
    return;
  }

  region.textContent = '';
  window.setTimeout(() => {
    region.textContent = message;
  }, 0);
  window.setTimeout(() => {
    if (region.textContent === message) {
      region.textContent = '';
    }
  }, 3000);
}

export function trapFocus(containerRef: RefObject<HTMLElement>): () => void {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const container = containerRef.current;

  if (!container) {
    return () => {};
  }

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getFocusableElements = () =>
    Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
    );
  const initialFocusableElements = getFocusableElements();

  if (
    initialFocusableElements.length > 0 &&
    document.activeElement instanceof HTMLElement &&
    !container.contains(document.activeElement)
  ) {
    initialFocusableElements[0].focus();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

export function generateId(prefix = 'fulatelier'): string {
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '-');

  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${safePrefix}-${crypto.randomUUID()}`;
  }

  generatedIdCounter += 1;
  return `${safePrefix}-${Date.now().toString(36)}-${generatedIdCounter}`;
}
