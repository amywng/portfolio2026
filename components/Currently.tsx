"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { Song } from "@/lib/spotify";
import type { Book, OnMyPlate, CurrentlyInto } from "@/lib/db";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useHoverDelay } from "@/hooks/useHoverDelay";

type Props = {
  recentlyPlayed: Song[];
  reading: Book | undefined;
  finished: Book[];
  plate: OnMyPlate[];
  into: CurrentlyInto[];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-fuchsia tracking-widest text-[11px]">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function Tooltip({
  children,
  label,
  className,
  style,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute bottom-full mb-2 z-[100] pointer-events-none ${className ?? "left-1/2 -translate-x-1/2 w-64"}`}
      style={style}
    >
      <div className="bg-ink dark:bg-paper text-paper dark:text-ink rounded-md px-3 py-2.5 shadow-lg text-left">
        <p className="font-mono text-[10px] uppercase tracking-widest text-fuchsia mb-1 font-semibold">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

function HeadphonesZone({ songs }: { songs: Song[] }) {
  const [idx, setIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const current = songs[idx];
  const isMobile = useIsMobile();

  function handleClick() {
    setIdx((i) => (i + 1) % songs.length);
  }

  return (
    <div
      className="
        absolute cursor-pointer rounded-full z-10
        top-[61%] left-[68%] w-[24%] h-[18%]
        md:top-[60%] md:left-[69%] md:w-[15%] md:h-[30%]
      "
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      data-cursor-hover
      onClick={handleClick}
    >
      {isVisible && current && (
        <Tooltip
          label="recently played"
          className={isMobile ? "w-48 z-10" : "w-48"}
          style={isMobile
            ? { top: "100%", bottom: "auto", left: "50%", transform: "translateX(-60%)", marginTop: "0.5rem" }
            : { bottom: "-40%", left: "100%" }
          }
        >
          <div className="flex items-center gap-3">
            {current.albumArt && (
              <img
                src={current.albumArt}
                alt=""
                className="w-12 h-12 rounded flex-shrink-0 object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="font-display italic text-[14px] leading-snug truncate">
                {current.title}
              </p>
              <p className="font-mono text-[10px] text-paper/60 dark:text-ink/60 mt-0.5 truncate">
                {current.artist}
              </p>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

function NotepadZone({ items }: { items: CurrentlyInto[] }) {
  return (
    <div
      className="
        absolute z-10 rotate-4 md:-rotate-[8deg]
        top-[3.5%] left-[36%] w-[28%] h-[18%]
        md:top-[14%] md:left-[4%] md:w-[15%] md:h-[36%]
      "
    >
      <ul className="m-0 p-0 pt-[45%] px-[5%] md:px-[11%] space-y-0.5 md:space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="m-0 p-0 leading-none flex items-start gap-0.5 md:gap-1"
          >
            <span className="text-fuchsia text-[6px] md:text-[8px] mt-[2px]">✦</span>
            <span className="font-mono text-black dark:text-white/80 text-[9px] md:text-[10px]">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LaptopZone({ stickers }: { stickers: CurrentlyInto[] }) {
  const isMobile = useIsMobile();
  const stickerW = isMobile ? 40 : 52;
  const [hovered, setHovered] = useState<string | null>(null);

  const slots = [
    { top: "15%", left: "65%", rotate: -6 },
    { top: "10%", left: "16%", rotate: 5 },
    { top: "55%", left: "5%", rotate: 3 },
    { top: "60%", left: "65%", rotate: -4 },
    { top: "35%", left: "80%", rotate: 7 },
  ];

  return (
    <div
      className="
        absolute rounded-xl z-8
        top-[39%] left-[26%] w-[46%] h-[23%]
        md:top-[32%] md:left-[37%] md:w-[28%] md:h-[42%]
      "
    >
      {stickers.slice(0, slots.length).map((item, i) => {
        const slot = slots[i];
        return (
          <div
            key={item.id}
            className="absolute cursor-pointer"
            style={{
              top: slot.top,
              left: slot.left,
              width: stickerW,
              transform: `rotate(${slot.rotate}deg)`,
              zIndex: 12,
            }}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered((current) => current === item.id ? null : item.id)}
            data-cursor-hover
          >
            {hovered === item.id && (
              <Tooltip label={item.category} className="w-36">
                <p className="font-mono text-[10px] leading-snug">{item.text}</p>
              </Tooltip>
            )}
            {item.sticker && (
              <Image
                src={item.sticker}
                alt={item.text}
                width={stickerW}
                height={stickerW}
                className="w-full h-auto"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BookStack({
  reading,
  finished,
}: {
  reading: Book | undefined;
  finished: Book[];
}) {
  const { value: hovered, show, hide, keep, clear } = useHoverDelay<"reading" | "finished">();
  const recent = finished[0];
  const isMobile = useIsMobile();
  const coverW = isMobile ? 60 : 90;
  const offset = isMobile ? 24 : 18;

  return (
    <div
      className="
        absolute -rotate-12 z-10
        top-[35%] right-[27%]
        md:top-[28%] md:right-[18%]
      "
    >
      {hovered && (
        <div
          className="absolute z-[100] w-48 md:w-64 rotate-12"
          style={isMobile
            ? { bottom: "100%", right: "80%", marginBottom: "0.5rem" }
            : { bottom: "100%", left: "-60%", marginBottom: "1rem" }
          }
          onMouseEnter={keep}
          onMouseLeave={hide}
        >
          <div className="bg-ink dark:bg-paper text-paper dark:text-ink rounded-md px-3 py-2.5 shadow-lg text-left pointer-events-auto">
            <p className="font-mono text-[10px] uppercase tracking-widest text-fuchsia mb-1 font-semibold">
              {hovered === "reading" ? "currently reading" : "recently finished"}
            </p>
            {hovered === "reading" && reading && (
              <>
                <p className="font-display italic text-[14px] leading-snug">{reading.title}</p>
                <p className="font-mono text-[10px] text-paper/60 dark:text-ink/60 mt-0.5">{reading.author}</p>
              </>
            )}
            {hovered === "finished" && recent && (
              <>
                <p className="font-display italic text-[14px] leading-snug">{recent.title}</p>
                <p className="font-mono text-[10px] text-paper/60 dark:text-ink/60 mt-0.5">{recent.author}</p>
                {recent.rating && <div className="mt-1"><StarRating rating={recent.rating} /></div>}
                {recent.review && (
                  <p className="font-mono text-[10px] text-paper/50 dark:text-ink/50 mt-1 leading-relaxed">
                    {recent.review}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {recent?.cover_url && (
        <div
          className="absolute cursor-pointer"
          style={{ top: offset, left: offset, width: coverW, zIndex: 1 }}
          onMouseEnter={() => show("finished")}
          onMouseLeave={hide}
          onClick={() => hovered === "finished" ? clear() : show("finished")}
          data-cursor-hover
        >
          <Image
            src={recent.cover_url}
            alt={recent.title}
            width={coverW}
            height={Math.round(coverW * 1.44)}
            className="w-full h-auto rounded shadow-md"
            style={{ transform: "rotate(6deg)" }}
          />
        </div>
      )}

      {reading?.cover_url && (
        <div
          className="absolute cursor-pointer"
          style={{ top: 0, left: 0, width: coverW, zIndex: 2 }}
          onMouseEnter={() => show("reading")}
          onMouseLeave={hide}
          onClick={() => hovered === "reading" ? clear() : show("reading")}
          data-cursor-hover
        >
          <Image
            src={reading.cover_url}
            alt={reading.title}
            width={coverW}
            height={Math.round(coverW * 1.44)}
            className="w-full h-auto rounded shadow-lg hover:scale-105 transition-transform duration-200"
            style={{ transform: "rotate(-4deg)" }}
          />
        </div>
      )}
    </div>
  );
}

function Plate({ items }: { items: OnMyPlate[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { value: hovered, show, hide } = useHoverDelay<true>();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [items]);

  const activeItem = items[activeIndex];
  if (!activeItem) return null;

  return (
    <div
      className="
        absolute rounded-full z-10
        top-[63%] left-[6%] w-[28%] h-[19%]
        md:top-[57%] md:left-[15%] md:w-[17%] md:h-[34%]
      "
    >
      {hovered && (
        <Tooltip
          className="w-36"
          style={isMobile
            ? { bottom: "auto", top: "100%", left: "80%", transform: "translateX(-50%)", marginTop: "0.5rem" }
            : { bottom: "auto", left: "-72%", top: "auto", marginBottom: "-12%" }
          }
          label="on my plate"
        >
          <p className="font-display italic text-[14px] leading-snug">{activeItem.dish}</p>
          {activeItem.restaurant && (
            <p className="font-mono text-[10px] text-paper/60 dark:text-ink/60 mt-0.5">
              {activeItem.restaurant}
            </p>
          )}
          {activeItem.note && (
            <p className="font-mono text-[10px] text-paper/50 dark:text-ink/50 mt-1 leading-relaxed">
              {activeItem.note}
            </p>
          )}
        </Tooltip>
      )}
      <div
        className="relative cursor-pointer h-full w-full flex items-center justify-center p-4"
        data-cursor-hover
        onMouseEnter={() => show(true)}
        onMouseLeave={hide}
      >
        <Image
          src={activeItem.image_url}
          alt={activeItem.dish}
          width={80}
          height={80}
          className="h-full w-full object-contain transition-transform duration-500"
        />
      </div>
    </div>
  );
}

export default function Currently({
  recentlyPlayed,
  reading,
  finished,
  plate,
  into,
}: Props) {
  const computerStickers = into.filter((i) => i.location === "laptop");
  const notepadItems = into.filter((i) => i.location === "notepad");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full mt-2">
      <div
        className="
          relative isolate z-10 w-full overflow-x-clip md:overflow-visible
          aspect-[1673/2235]
          md:aspect-[2712/1250]
        "
      >
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={isDark ? "/currently/desk_dark.png" : "/currently/desk_light.png"}
            alt="desk"
            fill
            className="object-contain rounded-xl"
            priority
          />
        </div>
        <div className="absolute inset-0 block md:hidden">
          <Image
            src={isDark ? "/currently/desk_mobile_dark.png" : "/currently/desk_mobile_light.png"}
            alt="desk"
            fill
            className="object-contain rounded-xl"
            priority
          />
        </div>

        <HeadphonesZone songs={recentlyPlayed} />
        <NotepadZone items={notepadItems} />
        <LaptopZone stickers={computerStickers} />
        <BookStack reading={reading} finished={finished} />
        <Plate items={plate} />
      </div>

      <p className="font-mono text-sm md:text-xs text-muted mt-9 md:mt-3 text-center">
        hover to explore · click headphones to cycle through recently played tracks
      </p>
    </div>
  );
}
