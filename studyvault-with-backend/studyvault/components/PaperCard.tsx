import { Eye, Download, Trash2 } from "lucide-react";

export default function PaperCard({
  title,
  subtitle,
  fileUrl,
  onRemove,
}: {
  title: string;
  subtitle: string;
  fileUrl: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel px-5 py-4">
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-brand hover:text-brand"
        >
          <Eye size={14} /> View
        </a>
        <a
          href={fileUrl}
          download
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
        >
          <Download size={14} /> Download
        </a>
        {onRemove && (
          <button
            onClick={onRemove}
            aria-label="Remove file"
            className="inline-flex items-center rounded-md border border-line p-1.5 text-muted hover:border-brick hover:text-brick"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
