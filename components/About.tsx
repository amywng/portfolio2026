import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="max-w-wide mx-auto px-7 pt-24 md:pt-28">
      <p className="eyebrow">about</p>

      <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft dark:text-white/80">
        <p>
          I grew up in <span className="text-[#232D4B] dark:text-[#6B7FBF]">Charlottesville</span>, {" "}
          <span className="text-[#E57200] dark:text-[#F5A64D]">Virginia</span>, and my CS journey went from Scratch
          blocks to robotics and eventually landed on Racket in my first year at Northeastern,
          which was a super fun place to start from zero.
        </p>
        <p>
          I haven't stopped building since, whether it be end-to-end Android features at
          Priceline or full-stack web applications at {" "}
          <a href="https://c4cneu.com" rel="noreferrer" className="text-[#605ACD] hover:font-semibold" data-cursor-hover target="_blank">Code4Community</a>. 
          I'm currently a software engineer co-op at {" "}
          <a href="https://www.whoop.com" rel="noreferrer" className="text-black dark:text-white hover:font-semibold" data-cursor-hover target="_blank">WHOOP</a>{" "}
          and Director of Operations at {" "}
          <a href="https://c4cneu.com" rel="noreferrer" className="text-[#605ACD] hover:font-semibold" data-cursor-hover target="_blank">Code4Community</a>
          , two environments where I've learned what it means to build under real pressure and for real people.
        </p>
        <p>
          Outside of work, I love trying new restaurants (and rating them on Beli), staying
          active, and baking. See what I'm up to right now{" "}
          <a href="/current" className="text-fuchsia hover:font-semibold" data-cursor-hover>here</a>.
        </p>
      </div>
    </section>
  );
}
