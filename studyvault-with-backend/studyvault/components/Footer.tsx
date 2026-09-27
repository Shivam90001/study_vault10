import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-content gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Study smarter with organised academic resources.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Site</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/" className="hover:text-brand">Home</Link></li>
            <li><Link href="/courses" className="hover:text-brand">Courses</Link></li>
            <li><Link href="/#about" className="hover:text-brand">About</Link></li>
            <li><Link href="/#contact" className="hover:text-brand">Contact</Link></li>
            <li><Link href="/admin" className="hover:text-brand">Manage uploads</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-ink">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/#" className="hover:text-brand">Privacy Policy</Link></li>
            <li><Link href="/#" className="hover:text-brand">Terms &amp; Conditions</Link></li>
            <li><Link href="/#" className="hover:text-brand">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-5 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. {SITE_TAGLINE}.
      </div>
    </footer>
  );
}
