"use client";

import type { ButtonHTMLAttributes } from "react";

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={[
        "inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]",
        checked
          ? "bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
          : "bg-[var(--slate-gray,var(--color-slate-gray,#64748B))]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={[
          "h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
