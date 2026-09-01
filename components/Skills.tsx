import {
  SiKotlin,
  SiSwift,
  SiOpenjdk,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiAndroid,
  SiJetpackcompose,
  SiExpress,
  SiReact,
  SiNextdotjs,
  SiGraphql,
  SiNestjs,
  SiFlask,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiGit,
  SiSupabase,
  SiAmazonwebservices,
  SiDatadog,
  SiApachekafka,
  SiVisualstudiocode,
  SiJest,
  SiUikit,
  SiJunit5,
  SiTailwindcss,
  SiPostman,
} from "react-icons/si";
import type { IconType } from "react-icons";

type Skill = {
  label: string;
  icon?: IconType;
  color?: string;
};

type Category = {
  category: string;
  items: Skill[];
};

const skills: Category[] = [
  {
    category: "languages",
    items: [
      { label: "Java", icon: SiOpenjdk, color: "#ED8B00" },
      { label: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
      { label: "Swift", icon: SiSwift, color: "#F05138" },
      { label: "Python", icon: SiPython, color: "#3776AB" },
      { label: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    ],
  },

  {
    category: "web",
    items: [
      { label: "React", icon: SiReact, color: "#61DAFB" },
      { label: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { label: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { label: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { label: "Express", icon: SiExpress, color: "#000000" },
      { label: "Flask", icon: SiFlask, color: "#000000" },
      { label: "REST APIs" },
    ],
  },

  {
    category: "mobile",
    items: [
      { label: "Android", icon: SiAndroid, color: "#3DDC84" },
      { label: "Jetpack Compose", icon: SiJetpackcompose, color: "#4285F4" },
      { label: "SwiftUI", icon: SiSwift, color: "#F05138" },
      { label: "UIKit", icon: SiUikit, color: "#2396F3" },
      { label: "MVVM" },
      { label: "Kotlin Coroutines" },
    ],
  },

  {
    category: "databases & infrastructure",
    items: [
      { label: "SQL" },
      { label: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { label: "MySQL", icon: SiMysql, color: "#4479A1" },
      { label: "GraphQL", icon: SiGraphql, color: "#E10098" },
      { label: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { label: "Docker", icon: SiDocker, color: "#2496ED" },
      { label: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
      { label: "Datadog", icon: SiDatadog, color: "#632CA6" },
      { label: "Apache Kafka", icon: SiApachekafka, color: "#231F20" },
    ],
  },

  {
    category: "ai",
    items: [
      { label: "Claude Code" },
      { label: "Cursor" },
      { label: "RAG" },
      { label: "MCP" },
      { label: "Codex" },
    ],
  },

  {
    category: "tools",
    items: [
      { label: "Git", icon: SiGit, color: "#F05032" },
      { label: "Postman", icon: SiPostman, color: "#FF6C37" },
      { label: "Jest", icon: SiJest, color: "#C21325" },
      { label: "JUnit", icon: SiJunit5, color: "#25A162" },
      { label: "MockK" },
      { label: "Proxyman" },
      { label: "Unix" },
      { label: "Vim" },
      { label: "VS Code", icon: SiVisualstudiocode, color: "#007ACC" },
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="max-w-wide mx-auto px-4 md:px-7 pt-24 md:pt-28"
    >
      <p className="eyebrow">skills</p>

      <div className="space-y-8">
        {skills.map(({ category, items }) => (
          <div
            key={category}
            className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)] gap-2 md:gap-6 md:items-start"
          >
            <p className="font-mono text-sm uppercase tracking-[0.12em] text-muted pt-0.5">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {items.map(({ label, icon: Icon, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 font-mono text-xs px-2.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 text-ink-soft dark:text-white/50"
                >
                  {Icon && (
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                  )}
                  {label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
