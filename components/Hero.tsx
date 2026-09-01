import GalleryWall from "@/components/GalleryWall";

export default function Hero() {
  return (
    <section id="hero" className="max-w-wide mx-auto px-7 pt-32 md:pt-36">
      <div className="grid md:grid-cols-[1.1fr_380px] gap-8 items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-ink-soft dark:text-muted mb-1.5">
            software engineer — artist
          </p>
          <h1 className="font-display italic font-light text-6xl md:text-8xl leading-[0.94] tracking-[-0.025em]">
            Amy
            <span className="block ml-2 not-italic font-semibold text-ink dark:text-paper">
              Wang
            </span>
          </h1>
          <div className="w-14 h-0.5 bg-fuchsia my-5" />
          <p className="text-[15px] text-[16.5px] text-ink-soft dark:text-white/80 leading-relaxed">
            I'm a rising senior at Northeastern University studying Computer
            Science and Media Arts. I like building things, learning new Vim and
            Unix commands, and following stack traces.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
            <span>based in — Boston</span>
            <span>currently — SWE Co-op at WHOOP</span>
          </div>
        </div>
        <GalleryWall />
      </div>
    </section>
  );
}
