import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// DELETE /api/uploads/:id — requires the admin key (see app/admin/page.tsx)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const key = req.headers.get("x-admin-key");
  if (!key || key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upload = await prisma.upload.findUnique({ where: { id: params.id } });
  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Best-effort file cleanup — if it's already gone, don't fail the request.
  try {
    await unlink(path.join(process.cwd(), "public", upload.fileUrl.replace(/^\//, "")));
  } catch {
    // ignore
  }

  await prisma.upload.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
