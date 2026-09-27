import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/admin/verify  { password } -> { ok: true|false }
// Keeps ADMIN_PASSWORD server-side only; the browser never sees it, it just
// gets a yes/no and (on yes) reuses the password the user typed as the key
// for later delete requests.
export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set on the server (see .env)" },
      { status: 500 }
    );
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
