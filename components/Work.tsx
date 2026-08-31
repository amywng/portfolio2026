import Image from "next/image";
import { getExperience } from "@/lib/db";

export default async function Work() {
  const experiences = await getExperience();

  return (
    <section id="experience" className="max-w-wide mx-auto px-7 pt-24 md:pt-28">
      <p className="eyebrow">experience</p>

      <div className="space-y-0">
        {experiences.map((job) => (
          <div
            key={job.company}
            className="group border-t border-line py-6 last:border-b"
          >
            <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 md:gap-6">
              <div className="pt-1 flex justify-center">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-line bg-paper/80 p-1.5 dark:bg-ink/80 flex-shrink-0">
                  <Image
                    src={job.icon}
                    alt={`${job.company} icon`}
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div>
                <div className="space-y-4">
                  {job.roles.map((role, i) => (
                    <div
                      key={`${role.title}-${role.start_date}`}
                      className={i > 0 ? "pt-4 border-t border-line/60" : ""}
                    >
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
                        <h3 className="font-display text-xl leading-none tracking-[-0.02em] text-ink dark:text-paper transition-colors hover:text-fuchsia">
                          {role.title}
                        </h3>
                        <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted flex-shrink-0">
                          {`${role.start_date} - ${role.end_date || "Present"}`}
                        </span>
                      </div>
                      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted mt-1">
                        {job.company}
                      </p>
                      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft dark:text-white/80">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
