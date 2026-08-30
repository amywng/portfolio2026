export default function Contact() {
  return (
    <section id="contact" className="max-w-wide mx-auto px-7 pt-20 pb-20 md:pt-28 md:pb-28">
      <p className="eyebrow">contact</p>

      <div className="border border-line rounded-[28px] p-7 md:p-10 bg-gradient-to-br from-fuchsia/5 via-transparent to-burnt/5">
        <h2 className="font-display text-2xl md:text-3xl leading-none tracking-[-0.04em]">
          thank you for visiting my portfolio.
        </h2>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft dark:text-white/80">
          I'm graduating in Spring 2027 and am currently looking for new-grad 
          software engineering roles. If anything here resonates, I'd love to chat!
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2 md:gap-4 font-mono text-sm text-muted">
          <a href="mailto:acwng2@gmail.com" className="hover:text-fuchsia" data-cursor-hover>
            acwng2@gmail.com
          </a>
          <span className="text-line">/</span>
          <a href="https://github.com/amywng" target="_blank" rel="noreferrer" className="hover:text-fuchsia" data-cursor-hover>
            github
          </a>
          <span className="text-line">/</span>
          <a href="https://www.linkedin.com/in/amyluwang/" target="_blank" rel="noreferrer" className="hover:text-fuchsia" data-cursor-hover>
            linkedin
          </a>
        </div>
      </div>
    </section>
  );
}
