import { Course, Subject, SubjectContent } from "@/types";

export const courses: Course[] = [
  {
    slug: "btech",
    name: "B.Tech",
    fullName: "Bachelor of Technology",
    description: "Four-year engineering degree across CSE, ECE, ME and more.",
    semesterCount: 8,
  },
  {
    slug: "bca",
    name: "BCA",
    fullName: "Bachelor of Computer Applications",
    description: "Three-year foundation in programming and computer science.",
    semesterCount: 6,
  },
  {
    slug: "bba",
    name: "BBA",
    fullName: "Bachelor of Business Administration",
    description: "Three-year undergraduate business management degree.",
    semesterCount: 6,
  },
  {
    slug: "mca",
    name: "MCA",
    fullName: "Master of Computer Applications",
    description: "Two-year postgraduate degree in applied computing.",
    semesterCount: 4,
  },
  {
    slug: "mba",
    name: "MBA",
    fullName: "Master of Business Administration",
    description: "Two-year postgraduate management programme.",
    semesterCount: 4,
  },
];

// Subjects are only fleshed out for B.Tech Semester 5 as demo/sample data.
// Every other course/semester combination gets a small generic placeholder
// list so every route in the site works end to end.
const btechSem5: Subject[] = [
  { slug: "dbms", name: "Database Management System", code: "BCS-501" },
  { slug: "computer-networks", name: "Computer Networks", code: "BCS-502" },
  { slug: "operating-systems", name: "Operating Systems", code: "BCS-503" },
  { slug: "daa", name: "Design and Analysis of Algorithms", code: "BCS-504" },
  { slug: "compiler-design", name: "Compiler Design", code: "BCS-505" },
  { slug: "artificial-intelligence", name: "Artificial Intelligence", code: "BCS-506" },
];

const genericSubjects = (courseSlug: string, semester: number): Subject[] => [
  { slug: "subject-1", name: "Core Subject 1", code: `${courseSlug.toUpperCase()}-${semester}01` },
  { slug: "subject-2", name: "Core Subject 2", code: `${courseSlug.toUpperCase()}-${semester}02` },
  { slug: "subject-3", name: "Core Subject 3", code: `${courseSlug.toUpperCase()}-${semester}03` },
  { slug: "subject-4", name: "Elective Subject", code: `${courseSlug.toUpperCase()}-${semester}04` },
];

export function getSubjects(courseSlug: string, semester: number): Subject[] {
  if (courseSlug === "btech" && semester === 5) return btechSem5;
  return genericSubjects(courseSlug, semester);
}

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getSubject(
  courseSlug: string,
  semester: number,
  subjectSlug: string
): Subject | undefined {
  return getSubjects(courseSlug, semester).find((s) => s.slug === subjectSlug);
}

const dbmsContent: SubjectContent = {
  syllabus: [
    {
      title: "Unit 1 — Introduction to DBMS",
      topics: ["Database concepts", "Database architecture", "Data models", "ER model"],
    },
    {
      title: "Unit 2 — Relational Model",
      topics: ["Relational algebra", "Relational calculus", "SQL basics", "Constraints & keys"],
    },
    {
      title: "Unit 3 — Database Design",
      topics: ["Functional dependencies", "Normalization (1NF–BCNF)", "Schema refinement"],
    },
    {
      title: "Unit 4 — Transactions & Concurrency",
      topics: ["ACID properties", "Concurrency control", "Locking protocols", "Deadlocks"],
    },
    {
      title: "Unit 5 — Storage & Indexing",
      topics: ["File organization", "Indexing structures", "B/B+ trees", "Hashing"],
    },
  ],
  pyqs: [
    { year: "2025", examType: "End Semester", fileUrl: "#" },
    { year: "2024", examType: "End Semester", fileUrl: "#" },
    { year: "2023", examType: "End Semester", fileUrl: "#" },
    { year: "2022", examType: "End Semester", fileUrl: "#" },
    { year: "2021", examType: "End Semester", fileUrl: "#" },
  ],
  notes: [
    { title: "Unit 1 Notes", fileUrl: "#" },
    { title: "Unit 2 Notes", fileUrl: "#" },
    { title: "Unit 3 Notes", fileUrl: "#" },
    { title: "Unit 4 Notes", fileUrl: "#" },
    { title: "Unit 5 Notes", fileUrl: "#" },
  ],
};

const genericContent: SubjectContent = {
  syllabus: [
    { title: "Unit 1 — Foundations", topics: ["Core concepts", "Key definitions", "Scope"] },
    { title: "Unit 2 — Core Theory", topics: ["Principal models", "Worked examples"] },
    { title: "Unit 3 — Applications", topics: ["Case studies", "Practical use"] },
  ],
  pyqs: [
    { year: "2025", examType: "End Semester", fileUrl: "#" },
    { year: "2024", examType: "End Semester", fileUrl: "#" },
    { year: "2023", examType: "End Semester", fileUrl: "#" },
  ],
  notes: [
    { title: "Unit 1 Notes", fileUrl: "#" },
    { title: "Unit 2 Notes", fileUrl: "#" },
  ],
};

export function getSubjectContent(
  courseSlug: string,
  semester: number,
  subjectSlug: string
): SubjectContent {
  if (courseSlug === "btech" && semester === 5 && subjectSlug === "dbms") {
    return dbmsContent;
  }
  return genericContent;
}
