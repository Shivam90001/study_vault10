"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import {
  getAllUploadedFiles,
  removeUploadedFile,
  verifyAdminPassword,
  getStoredAdminKey,
  setStoredAdminKey,
  clearStoredAdminKey,
} from "@/lib/storage";
import { UploadedFile } from "@/types";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [files, setFiles] = useState<UploadedFile[]>([]);

  const refresh = async () => setFiles(await getAllUploadedFiles());

  // On load, if a key is already stored from a previous visit, try it silently.
  useEffect(() => {
    (async () => {
      const stored = getStoredAdminKey();
      if (stored && (await verifyAdminPassword(stored))) {
        setUnlocked(true);
        await refresh();
      }
      setChecking(false);
    })();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const ok = await verifyAdminPassword(password);
    if (ok) {
      setStoredAdminKey(password);
      setUnlocked(true);
      setPassword("");
      await refresh();
    } else {
      setLoginError("Wrong password — try again.");
    }
  };

  const handleLogout = () => {
    clearStoredAdminKey();
    setUnlocked(false);
    setFiles([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeUploadedFile(id);
      await refresh();
    } catch {
      alert("Couldn't delete that file. Try logging in again.");
    }
  };

  if (checking) {
    return (
      <div className="mx-auto max-w-content px-5 py-10">
        <p className="text-sm text-muted">Checking…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-content px-5 py-10">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Manage uploads" }]} />
        <h1 className="font-display text-3xl font-semibold text-ink">Admin Login</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          This page manages every file uploaded to the site. Enter the admin password to
          continue.
        </p>
        <form onSubmit={handleLogin} className="mt-6 flex max-w-sm flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Unlock
          </button>
          {loginError && <p className="text-xs text-brick">{loginError}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-5 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Manage uploads" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Manage Uploads</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-muted hover:border-brick hover:text-brick"
        >
          Log out
        </button>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Every file anyone has uploaded across the whole site, saved in the database — not
        just this browser.
      </p>

      {files.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          Nothing uploaded yet. Open any subject page and drag a file into the
          syllabus, PYQ or notes section.
        </p>
      ) : (
        <div className="mt-8 space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{f.label}</p>
                <p className="text-xs text-muted">
                  {f.course} / {f.semester} / {f.subject} / {f.section}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={f.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-line px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand"
                >
                  Open
                </a>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-brick hover:border-brick"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
