"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { courses, getSubjects } from "@/data/courses";

interface Result {
  label: string;
  path: string;
  href: string;
}

function buildIndex(): Result[] {
  const results: Result[] = [];
  for (const course of courses) {
    results.push({ label: course.name, path: course.name, href: `/courses/${course.slug}` });
    for (let sem = 1; sem <= course.semesterCount; sem++) {
      results.push({
        label: `Semester ${sem}`,
        path: `${course.name} → Semester ${sem}`,
        href: `/courses/${course.slug}/semester-${sem}`,
      });
      for (const subject of getSubjects(course.slug, sem)) {
        results.push({
          label: `${subject.name} (${subject.code})`,
          path: `${course.name} → Semester ${sem} → ${subject.name}`,
          href: `/courses/${course.slug}/semester-${sem}/${subject.slug}`,
        });
      }
    }
  }
  return results;
}

const index = buildIndex();

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return index.filter((r) => r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q)).slice(0, 30);
  }, [query]);

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="font-display text-3xl font-semibold text-ink">Search</h1>
      <p className="mt-2 text-sm text-muted">
        Find a course, semester or subject. Try “DBMS” or “Semester 5”.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-3">
        <SearchIcon size={18} className="text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subjects, courses, codes…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </div>

      <div className="mt-6 space-y-2">
        {query.trim() && results.length === 0 && (
          <p className="text-sm text-muted">No matches for “{query}”.</p>
        )}
        {results.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="block rounded-lg border border-line bg-panel px-4 py-3 hover:border-brand"
          >
            <p className="text-sm font-medium text-ink">{r.label}</p>
            <p className="text-xs text-muted">{r.path}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
