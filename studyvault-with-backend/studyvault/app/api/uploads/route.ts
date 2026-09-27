import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

// This route touches the filesystem (saves the uploaded file to disk) and
// the database, so it must run in the Node.js runtime, not the Edge runtime.
export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function toApiShape(u: {
  id: string;
  course: string;
  semester: string;
  subject: string;
  section: string;
  label: string;
  fileName: string;
  fileUrl: string;
  addedAt: Date;
}) {
  return {
    id: u.id,
    course: u.course,
    semester: u.semester,
    subject: u.subject,
    section: u.section,
    label: u.label,
    fileName: u.fileName,
    // Field kept as "dataUrl" for backwards compatibility with the UI —
    // it now holds a real server path (e.g. /uploads/xyz.pdf) instead of
    // a base64 data URL.
    dataUrl: u.fileUrl,
    addedAt: u.addedAt.getTime(),
  };
}

// GET /api/uploads                       -> everything (used by /admin)
// GET /api/uploads?course=&semester=&subject= -> filtered (used by subject pages)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const course = searchParams.get("course");
  const semester = searchParams.get("semester");
  const subject = searchParams.get("subject");

  const isFullDump = !course && !semester && !subject;

  // Listing *everything* is an admin action — require the admin key.
  // Listing one subject's files (what every public subject page needs) stays open.
  if (isFullDump) {
    const key = req.headers.get("x-admin-key");
    if (!key || key !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const where: Record<string, string> = {};
  if (course) where.course = course;
  if (semester) where.semester = semester;
  if (subject) where.subject = subject;

  const uploads = await prisma.upload.findMany({
    where,
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(uploads.map(toApiShape));
}

// POST /api/uploads (multipart/form-data: file, course, semester, subject, section, label)
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const course = formData.get("course") as string | null;
  const semester = formData.get("semester") as string | null;
  const subject = formData.get("subject") as string | null;
  const section = formData.get("section") as string | null;
  const label = formData.get("label") as string | null;

  if (!file || !course || !semester || !subject || !section) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "Only PDF, JPG and PNG files are allowed" },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is larger than 10 MB" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, uniqueName), bytes);

  const upload = await prisma.upload.create({
    data: {
      course,
      semester,
      subject,
      section,
      label: label?.trim() || file.name.replace(/\.[^/.]+$/, ""),
      fileName: file.name,
      fileUrl: `/uploads/${uniqueName}`,
    },
  });

  return NextResponse.json(toApiShape(upload), { status: 201 });
}
