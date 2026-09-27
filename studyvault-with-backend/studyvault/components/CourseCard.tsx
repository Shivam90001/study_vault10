import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Course } from "@/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-line bg-panel p-6 transition-colors hover:border-brand"
    >
      <div>
        <p className="font-display text-2xl font-semibold text-ink">{course.name}</p>
        <p className="mt-1 text-sm text-muted">{course.fullName}</p>
        <p className="mt-3 text-sm text-ink/70">{course.description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand">
        View course
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
