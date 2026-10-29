import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dh-surface px-4 text-center">
      <p className="text-6xl font-bold text-dh-brand">404</p>
      <h1 className="mt-3 text-lg font-semibold text-dh-ink">Page not found</h1>
      <p className="mt-1 text-sm text-dh-muted">The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-6 rounded-md bg-dh-brand px-4 py-2 text-[13px] font-semibold text-white hover:bg-dh-brand-dark">
        Back to Dashboard
      </Link>
    </main>
  );
}
