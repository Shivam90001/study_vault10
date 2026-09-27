import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-5 py-24 text-center">
      <p className="font-display text-3xl font-semibold text-ink">Page not found</p>
      <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
        Back to home
      </Link>
    </div>
  );
}
