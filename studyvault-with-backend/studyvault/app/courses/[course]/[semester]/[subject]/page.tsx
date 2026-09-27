"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Accordion from "@/components/Accordion";
import PaperCard from "@/components/PaperCard";
import NotesCard from "@/components/NotesCard";
import DropZone from "@/components/DropZone";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getCourse, getSubject, getSubjectContent } from "@/data/courses";
import { getUploadedFiles } from "@/lib/storage";
import { UploadedFile } from "@/types";

type Tab = "syllabus" | "pyqs" | "notes";

const tabs: { id: Tab; label: string }[] = [
  { id: "syllabus", label: "Syllabus" },
  { id: "pyqs", label: "Previous Year Question Papers" },
  { id: "notes", label: "Notes" },
];

function parseSemester(param: string): number | null {
  const match = param.match(/^semester-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export default function SubjectPage() {
  const params = useParams<{ course: string; semester: string; subject: string }>();
  const semNum = parseSemester(params.semester);
  const course = getCourse(params.course);
  const subject = course && semNum ? getSubject(course.slug, semNum, params.subject) : undefined;

  const [tab, setTab] = useState<Tab>("syllabus");
  const [uploads, setUploads] = useState<UploadedFile[]>([]);

  const refreshUploads = async () => {
    if (!course || !semNum || !subject) return;
    setUploads(await getUploadedFiles(course.slug, `semester-${semNum}`, subject.slug));
  };

  useEffect(() => {
    void refreshUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.slug, semNum, subject?.slug]);

  const content = useMemo(() => {
    if (!course || !semNum || !subject) return null;
    return getSubjectContent(course.slug, semNum, subject.slug);
  }, [course, semNum, subject]);

  if (!course || !semNum || !subject || !content) {
    return (
      <div className="mx-auto max-w-content px-5 py-16 text-center">
        <p className="font-display text-2xl text-ink">Subject not found</p>
        <p className="mt-2 text-sm text-muted">Check the link and try again.</p>
      </div>
    );
  }

  const uploadsFor = (section: Tab) => uploads.filter((u) => u.section === section);

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: course!.name, href: `/courses/${course!.slug}` },
          { label: `Semester ${semNum}`, href: `/courses/${course!.slug}/semester-${semNum}` },
          { label: subject!.name },
        ]}
      />

      <p className="text-xs font-medium uppercase tracking-wide text-amber-dark">
        {subject!.code}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">{subject!.name}</h1>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-b-2 border-brand text-brand"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "syllabus" && (
          <>
            <Accordion units={content!.syllabus} />
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-ink">Add a syllabus file</p>
              <DropZone
                course={course!.slug}
                semester={`semester-${semNum}`}
                subject={subject!.slug}
                section="syllabus"
                onAdded={refreshUploads}
              />
              {uploadsFor("syllabus").map((f) => (
                <div key={f.id} className="mb-3">
                  <PaperCard
                    title={f.label}
                    subtitle={f.fileName}
                    fileUrl={f.dataUrl}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "pyqs" && (
          <div className="space-y-3">
            {content!.pyqs.map((p) => (
              <PaperCard
                key={p.year}
                title={`${p.year} — ${p.examType}`}
                subtitle={subject!.name}
                fileUrl={p.fileUrl}
              />
            ))}
            <div className="pt-4">
              <p className="mb-2 text-sm font-medium text-ink">Add a question paper</p>
              <DropZone
                course={course!.slug}
                semester={`semester-${semNum}`}
                subject={subject!.slug}
                section="pyqs"
                onAdded={refreshUploads}
              />
              {uploadsFor("pyqs").map((f) => (
                <div key={f.id} className="mb-3">
                  <PaperCard
                    title={f.label}
                    subtitle={f.fileName}
                    fileUrl={f.dataUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-3">
            {content!.notes.map((n) => (
              <NotesCard key={n.title} title={n.title} fileUrl={n.fileUrl} />
            ))}
            <div className="pt-4">
              <p className="mb-2 text-sm font-medium text-ink">Add your notes</p>
              <DropZone
                course={course!.slug}
                semester={`semester-${semNum}`}
                subject={subject!.slug}
                section="notes"
                onAdded={refreshUploads}
              />
              {uploadsFor("notes").map((f) => (
                <div key={f.id} className="mb-3">
                  <NotesCard
                    title={f.label}
                    fileUrl={f.dataUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10">
        <AdPlaceholder />
      </div>
    </div>
  );
}
