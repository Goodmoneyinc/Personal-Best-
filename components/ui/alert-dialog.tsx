"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useRef } from "react";

type AlertDialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AlertDialogProps = AlertDialogContextValue & {
  children: ReactNode;
};

type AlertDialogContentProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialog components must be used inside AlertDialog.");
  }

  return context;
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("aria-hidden"));
}

export function AlertDialog({
  open,
  onOpenChange,
  children,
}: AlertDialogProps) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogContent({
  children,
  className,
  ...props
}: AlertDialogContentProps) {
  const { open, onOpenChange } = useAlertDialogContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    contentRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }

      if (event.key !== "Tab" || !contentRef.current) {
        return;
      }

      const focusableElements = getFocusableElements(contentRef.current);

      if (focusableElements.length === 0) {
        event.preventDefault();
        contentRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={contentRef}
        role="alertdialog"
        aria-modal="true"
        tabIndex={-1}
        className={[
          "relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl focus:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["space-y-2 text-left", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={["text-xl font-semibold", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={[
        "text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
