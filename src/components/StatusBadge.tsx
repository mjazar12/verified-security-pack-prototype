export type BadgeTone = "neutral" | "accent" | "good" | "warn" | "danger";

interface StatusBadgeProps {
  children: string;
  tone?: BadgeTone;
}

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
