export type MoodboardPiece = {
  id: string;
  imageUrl: string;
  type: "sticker" | "frame";
};

export const moodboard: MoodboardPiece[] = [
  { id: "matcha-sticker", imageUrl: "/moodboard/matcha.png", type: "sticker" },
  { id: "flower-sticker", imageUrl: "/moodboard/flower.png", type: "sticker" },
  { id: "aperol-sticker", imageUrl: "/moodboard/aperol.png", type: "sticker" },
  {
    id: "strawbs-sticker",
    imageUrl: "/moodboard/strawberries.png",
    type: "sticker",
  },
  { id: "yogurt-sticker", imageUrl: "/moodboard/yogurt.png", type: "sticker" },
  { id: "koi-fish", imageUrl: "/moodboard/koi_fish.jpeg", type: "frame" },
  {
    id: "taiwan-lantern",
    imageUrl: "/moodboard/taiwan_lantern.jpeg",
    type: "frame",
  },
  { id: "lily-pads", imageUrl: "/moodboard/lily_pads.jpeg", type: "frame" },
];
