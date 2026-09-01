export default function Footer() {
  return (
    <footer className="max-w-content mx-auto px-7 border-t border-line py-8 mt-16 mb-8 flex justify-between font-mono text-sm md:text-sm text-muted">
      <span className="flex gap-6">
        <a
          href="mailto:acwng2@gmail.com"
          className="hover:text-fuchsia transition-colors"
          data-cursor-hover
        >
          email
        </a>
        <a
          href="https://github.com/amywng"
          target="_blank"
          className="hover:text-fuchsia transition-colors"
          data-cursor-hover
        >
          github
        </a>
        <a
          href="https://www.linkedin.com/in/amyluwang/"
          target="_blank"
          className="hover:text-fuchsia transition-colors"
          data-cursor-hover
        >
          linkedin
        </a>
      </span>
    </footer>
  );
}
