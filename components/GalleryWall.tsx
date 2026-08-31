"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { moodboard, type MoodboardPiece } from "@/data/moodboard";

const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url);

const layout: Record<
  string,
  { w: number; h: number; x: number; y: number; rotate: number; z: number }
> = {
  "matcha-sticker": { w: 112, h: 126, x: -44, y: 127, rotate: -3, z: 8 },
  "flower-sticker": { w: 130, h: 125, x: 365, y: 79, rotate: 4, z: 7 },
  "aperol-sticker": { w: 100, h: 110, x: 50, y: 177, rotate: 8, z: 5 },
  "lily-pads": { w: 145, h: 190, x: 244, y: 6, rotate: -2, z: 3 },
  "taiwan-lantern": { w: 130, h: 175, x: 135, y: 204, rotate: 1.5, z: 2 },
  "strawbs-sticker": { w: 118, h: 120, x: 122, y: -32, rotate: 3, z: 6 },
  "yogurt-sticker": { w: 200, h: 200, x: 234, y: 157, rotate: -2, z: 4 },
  "koi-fish": { w: 200, h: 140, x: 30, y: 40, rotate: 2, z: 1 },
};

export default function GalleryWall() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const [topZ, setTopZ] = useState(10);
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >(
    Object.fromEntries(
      Object.entries(layout).map(([id, pos]) => [id, { x: pos.x, y: pos.y }]),
    ),
  );

  return (
    <div
      ref={containerRef}
      className="relative hidden md:block"
      style={{ height: 380, width: 400 }}
    >
      {moodboard.map((piece: MoodboardPiece) => {
        const pos = layout[piece.id];
        if (!pos) return null; // no layout entry = skip

        return (
          <motion.div
            key={piece.id}
            drag
            dragMomentum={false}
            onPointerDown={() => {
              const next = topZ + 1;
              setTopZ(next);
              setZMap((z) => ({ ...z, [piece.id]: next }));
            }}
            initial={{ x: pos.x, y: pos.y, rotate: pos.rotate }}
            className="absolute cursor-grab active:cursor-grabbing select-none group"
            style={{
              width: pos.w,
              height: pos.h,
              zIndex: zMap[piece.id] ?? pos.z,
              boxShadow:
                piece.type === "frame"
                  ? "0 8px 24px rgba(22,24,29,0.15)"
                  : "none",
            }}
            onDragEnd={(_, info) => {
              const newX = Math.round(
                (positions[piece.id]?.x ?? pos.x) + info.offset.x,
              );
              const newY = Math.round(
                (positions[piece.id]?.y ?? pos.y) + info.offset.y,
              );
              setPositions((p) => ({ ...p, [piece.id]: { x: newX, y: newY } }));
            }}
          >
            {piece.type === "frame" ? (
              <div className="w-full h-full bg-white p-1 border border-line">
                <div className="relative w-full h-full overflow-hidden">
                  {isVideo(piece.imageUrl) ? (
                    <video
                      src={piece.imageUrl}
                      className="w-full h-full object-cover pointer-events-none"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <Image
                      src={piece.imageUrl}
                      alt={piece.id}
                      fill
                      sizes="220px"
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {isVideo(piece.imageUrl) ? (
                  <video
                    src={piece.imageUrl}
                    className="w-full h-full object-contain pointer-events-none"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : (
                  <Image
                    src={piece.imageUrl}
                    alt={piece.id}
                    fill
                    sizes="220px"
                    className="object-contain pointer-events-none"
                    draggable={false}
                  />
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
