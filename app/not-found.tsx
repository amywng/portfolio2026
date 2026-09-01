import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-fuchsia mb-3">
        404
      </p>

      <h1 className="font-display italic text-4xl mb-3">oops, wrong turn.</h1>

      <p className="font-mono text-sm text-muted mb-6">
        have an idea for a page?{" "}
        <a
          href="mailto:acwng2@gmail.com"
          className="hover:text-fuchsia transition-colors"
          data-cursor-hover
        >
          email
        </a>{" "}
        me.
      </p>

      <Link
        href="/"
        className="font-mono text-xs underline underline-offset-4 hover:text-fuchsia transition-colors"
      >
        ← back to home
      </Link>
    </main>
  );
}
