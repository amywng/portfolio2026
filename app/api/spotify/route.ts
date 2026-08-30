import { NextResponse } from "next/server";
import { getRecentlyPlayed } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const songs = await getRecentlyPlayed();
    return NextResponse.json(songs);
  } catch (err) {
    console.error("Spotify API error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
