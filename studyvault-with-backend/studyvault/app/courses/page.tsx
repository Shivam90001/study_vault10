import CourseCard from "@/components/CourseCard";
import Breadcrumb from "@/components/Breadcrumb";
import { courses } from "@/data/courses";

export const metadata = { title: "All Courses — StudyVault" };

export default function CoursesPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">All Courses</h1>
      <p className="mt-2 text-sm text-muted">Pick a course to see its semesters.</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
