import Link from "next/link";

export default function SemesterCard({
  courseSlug,
  number,
}: {
  courseSlug: string;
  number: number;
}) {
  return (
    <Link
      href={`/courses/${courseSlug}/semester-${number}`}
      className="group flex items-center gap-4 rounded-lg border border-line bg-panel p-5 transition-colors hover:border-brand"
    >
      <span className="font-display text-2xl font-semibold text-brand">
        {String(number).padStart(2, "0")}
      </span>
      <span className="text-sm font-medium text-ink">Semester {number}</span>
    </Link>
  );
}
