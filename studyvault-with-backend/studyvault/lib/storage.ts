"use client";

import { UploadedFile } from "@/types";

// This used to read/write the browser's localStorage. Now every function
// talks to the real backend (SQLite database + files saved on the server
// under /public/uploads) via the API routes in app/api/uploads/.
// The exported function names/shapes are kept the same so the rest of the
// UI barely had to change — they're just async now.

const ADMIN_KEY_STORAGE = "studyvault:adminKey";

export function getStoredAdminKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_KEY_STORAGE);
}

export function setStoredAdminKey(key: string) {
  window.localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearStoredAdminKey() {
  window.localStorage.removeItem(ADMIN_KEY_STORAGE);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const res = await fetch("/api/admin/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return Boolean(data.ok);
}

export async function addUploadedFile(params: {
  course: string;
  semester: string;
  subject: string;
  section: UploadedFile["section"];
  label: string;
  file: File;
}): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append("course", params.course);
  formData.append("semester", params.semester);
  formData.append("subject", params.subject);
  formData.append("section", params.section);
  formData.append("label", params.label);
  formData.append("file", params.file);

  const res = await fetch("/api/uploads", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || "Upload failed");
  }
  return res.json();
}

export async function removeUploadedFile(id: string): Promise<void> {
  const key = getStoredAdminKey();
  const res = await fetch(`/api/uploads/${id}`, {
    method: "DELETE",
    headers: key ? { "x-admin-key": key } : {},
  });
  if (!res.ok) {
    throw new Error("Delete failed — admin key missing or incorrect");
  }
}

export async function getUploadedFiles(
  course: string,
  semester: string,
  subject: string
): Promise<UploadedFile[]> {
  const params = new URLSearchParams({ course, semester, subject });
  const res = await fetch(`/api/uploads?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getAllUploadedFiles(): Promise<UploadedFile[]> {
  const key = getStoredAdminKey();
  const res = await fetch("/api/uploads", {
    headers: key ? { "x-admin-key": key } : {},
  });
  if (!res.ok) return [];
  return res.json();
}
