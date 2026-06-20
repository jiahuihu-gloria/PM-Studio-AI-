import { cn } from "@/lib/utils";

export function Panel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("rounded-lg border border-line bg-white shadow-sm", className)}>{children}</section>;
}

export function PanelHeader({
  title,
  eyebrow,
  action
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-muted">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
