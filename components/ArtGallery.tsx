"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { ArtPiece } from "@/lib/db";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
    
const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url);

export default function ArtGallery({ art }: { art: ArtPiece[] }) {
  const [tooltip, setTooltip] = useState<ArtPiece | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    let timeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setTooltip(null);
      }, 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  function onMouseMove(e: React.MouseEvent) {
    setPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <>
      {tooltip && tooltip.blurb && (
        <div
          className="fixed z-[9990] pointer-events-none"
          style={{
            left: pos.x + 16,
            top: pos.y + 16,
            transform: 
              // flip left if too close to right edge
              pos.x > window.innerWidth - 220
                ? `translateX(calc(-100% - 32px))`
                : undefined,
          }}
        >
          <div className="bg-paper dark:bg-ink rounded-md px-2 py-0.5 shadow-lg">
            {tooltip.blurb && (
              <p className="font-mono text-[10px] text-ink/60 dark:text-white/80 leading-relaxed">
                {tooltip.blurb}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="columns-2 md:columns-3 gap-3 md:gap-4"
        onMouseMove={onMouseMove}
      >
        {art.map((piece) => (
          <div
            key={piece.id}
            className="break-inside-avoid mb-3 md:mb-4 group relative overflow-hidden rounded-md z-10"
            onMouseEnter={() => { if (!isMobile) setTooltip(piece)} }
            onMouseLeave={() => { if (!isMobile) setTooltip(null)} }
            onClick={() => {
              if (isMobile) {
                setTooltip((current) =>
                  current?.id === piece.id ? null : piece
                )
              }
            }}
            data-cursor-hover
          >
            {isVideo(piece.url) ? (
              <video
                src={piece.url}
                className="w-full h-auto block"
                controls={Boolean(piece.audio)}
                loop
                playsInline
                autoPlay
                muted
              />
            ) : (
              <Image
                src={piece.url}
                alt={piece.id}
                width={800}
                height={800}
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
                className="
                  w-full h-auto block 
                  transition-transform duration-300 
                  md:group-hover:scale-[1.02]
                "
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
