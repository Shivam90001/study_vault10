import CourseCard from "@/components/CourseCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { courses } from "@/data/courses";
import { SITE_NAME, SITE_TAGLINE } from "@/data/site";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-5 py-14">
      <section className="max-w-2xl">
        <p className="text-sm font-medium text-amber-dark">{SITE_NAME}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {SITE_TAGLINE}
        </h1>
        <p className="mt-4 text-base text-ink/70">
          Syllabus, previous year question papers and notes for every course and
          semester — organised so you can find exactly what you need in a few clicks.
        </p>
      </section>

      <section className="mt-14" id="courses">
        <h2 className="font-display text-2xl font-medium text-ink">Select your course</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <AdPlaceholder />
      </section>

      <section id="about" className="mt-14 max-w-2xl border-t border-line pt-10">
        <h2 className="font-display text-xl font-medium text-ink">About {SITE_NAME}</h2>
        <p className="mt-3 text-sm text-ink/70">
          {SITE_NAME} brings together syllabus documents, previous year question
          papers and notes for students, organised by course, semester and
          subject. Everything is browsable without an account.
        </p>
      </section>

      <section id="contact" className="mt-10 max-w-2xl">
        <h2 className="font-display text-xl font-medium text-ink">Contact</h2>
        <p className="mt-3 text-sm text-ink/70">
          Questions or corrections? Reach out at{" "}
          <a href="mailto:hello@studyvault.example" className="text-brand hover:underline">
            hello@studyvault.example
          </a>
          .
        </p>
      </section>
    </div>
  );
}
