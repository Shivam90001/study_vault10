import { BookOpen, Download, Trash2 } from "lucide-react";

export default function NotesCard({
  title,
  fileUrl,
  onRemove,
}: {
  title: string;
  fileUrl: string;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel px-5 py-4">
      <p className="font-medium text-ink">{title}</p>
      <div className="flex items-center gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-brand hover:text-brand"
        >
          <BookOpen size={14} /> Read
        </a>
        <a
          href={fileUrl}
          download
          className="inline-flex items-center gap-1.5 rounded-md bg-sage px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
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
