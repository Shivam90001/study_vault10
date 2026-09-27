import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import SubjectCard from "@/components/SubjectCard";
import { getCourse, getSubjects } from "@/data/courses";

function parseSemester(param: string): number | null {
  const match = param.match(/^semester-(\d+)$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export function generateMetadata({
  params,
}: {
  params: { course: string; semester: string };
}) {
  const course = getCourse(params.course);
  const num = parseSemester(params.semester);
  return {
    title: course && num ? `${course.name} Semester ${num} — StudyVault` : "Semester",
  };
}

export default function SemesterPage({
  params,
}: {
  params: { course: string; semester: string };
}) {
  const course = getCourse(params.course);
  const semNum = parseSemester(params.semester);
  if (!course || !semNum || semNum < 1 || semNum > course.semesterCount) notFound();

  const subjects = getSubjects(course.slug, semNum);

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: course.name, href: `/courses/${course.slug}` },
          { label: `Semester ${semNum}` },
        ]}
      />
      <h1 className="font-display text-3xl font-semibold text-ink">
        {course.name} Semester {semNum}
      </h1>
      <p className="mt-2 text-sm text-muted">Select a subject to view its syllabus, PYQs and notes.</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.slug}
            courseSlug={course.slug}
            semester={semNum}
            subject={subject}
          />
        ))}
      </div>
    </div>
  );
}
