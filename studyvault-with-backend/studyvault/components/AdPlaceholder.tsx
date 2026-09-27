export default function AdPlaceholder({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-line text-xs uppercase tracking-wide text-muted">
      {label} space
    </div>
  );
}
