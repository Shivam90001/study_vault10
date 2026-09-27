"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { addUploadedFile } from "@/lib/storage";
import { UploadedFile } from "@/types";

interface Props {
  course: string;
  semester: string;
  subject: string;
  section: UploadedFile["section"];
  onAdded: () => void;
}

export default function DropZone({ course, semester, subject, section, onAdded }: Props) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setBusy(true);
      setError(null);
      try {
        for (const file of Array.from(fileList)) {
          await addUploadedFile({
            course,
            semester,
            subject,
            section,
            label: file.name.replace(/\.[^/.]+$/, ""),
            file,
          });
        }
        onAdded();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't upload that file — please try again."
        );
      } finally {
        setBusy(false);
      }
    },
    [course, semester, subject, section, onAdded]
  );

  return (
    <div className="mb-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragging ? "border-brand bg-brand/5" : "border-line hover:border-brand/60"
        }`}
      >
        <UploadCloud size={22} className={dragging ? "text-brand" : "text-muted"} />
        <p className="text-sm text-ink">
          {busy ? "Uploading…" : "Drag & drop a file here, or click to browse"}
        </p>
        <p className="text-xs text-muted">PDF, JPG or PNG — max 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-brick">{error}</p>}
    </div>
  );
}
