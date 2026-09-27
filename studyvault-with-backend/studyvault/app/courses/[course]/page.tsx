import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import SemesterCard from "@/components/SemesterCard";
import { courses, getCourse } from "@/data/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export function generateMetadata({ params }: { params: { course: string } }) {
  const course = getCourse(params.course);
  return { title: course ? `${course.name} Study Material — StudyVault` : "Course" };
}

export default function CoursePage({ params }: { params: { course: string } }) {
  const course = getCourse(params.course);
  if (!course) notFound();

  const semesters = Array.from({ length: course.semesterCount }, (_, i) => i + 1);

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: course.name },
        ]}
      />
      <h1 className="font-display text-3xl font-semibold text-ink">{course.name} Study Material</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{course.description}</p>

      <h2 className="mt-10 font-display text-xl font-medium text-ink">Select Semester</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {semesters.map((n) => (
          <SemesterCard key={n} courseSlug={course.slug} number={n} />
        ))}
      </div>
    </div>
  );
}
