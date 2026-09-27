import Link from "next/link";
import { Subject } from "@/types";

export default function SubjectCard({
  courseSlug,
  semester,
  subject,
}: {
  courseSlug: string;
  semester: number;
  subject: Subject;
}) {
  return (
    <Link
      href={`/courses/${courseSlug}/semester-${semester}/${subject.slug}`}
      className="rounded-lg border border-line bg-panel p-5 transition-colors hover:border-brand"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-amber-dark">{subject.code}</p>
      <p className="mt-1.5 font-display text-lg font-medium text-ink">{subject.name}</p>
    </Link>
  );
}
