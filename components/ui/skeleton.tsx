import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-[color-mix(in_srgb,var(--slate-gray,var(--color-slate-gray,#64748B))_22%,transparent)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
