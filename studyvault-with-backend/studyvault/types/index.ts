export interface Course {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  semesterCount: number;
}

export interface Subject {
  slug: string;
  name: string;
  code: string;
}

export interface SyllabusUnit {
  title: string;
  topics: string[];
}

export interface Paper {
  year: string;
  examType: string;
  fileUrl: string;
}

export interface NoteItem {
  title: string;
  fileUrl: string;
}

export interface SubjectContent {
  syllabus: SyllabusUnit[];
  pyqs: Paper[];
  notes: NoteItem[];
}

// Shape of a file a student drags in through the uploader.
// Now backed by a real database + server file storage — see lib/storage.ts
// and app/api/uploads/. `dataUrl` holds the server path (e.g. /uploads/x.pdf),
// the name is kept for backwards compatibility with existing components.
export interface UploadedFile {
  id: string;
  course: string;
  semester: string;
  subject: string;
  section: "syllabus" | "pyqs" | "notes";
  label: string;
  fileName: string;
  dataUrl: string;
  addedAt: number;
}
