import { getRecentlyPlayed } from "@/lib/spotify";
import { getCurrentlyData } from "@/lib/db";
import Currently from "@/components/Currently";

export const revalidate = 60;

export default async function CurrentlyPage() {
  const [recentlyPlayed, { reading, finished, plate, into }] =
    await Promise.all([getRecentlyPlayed(), getCurrentlyData()]);

  return (
    <main>
      <div className="max-w-wide mx-auto px-4 md:px-7 pt-20 md:pt-28 pb-20 md:pb-28">
        <p className="eyebrow">currently</p>
        <h1 className="section-header">what I've been up to recently</h1>
        <Currently
          recentlyPlayed={recentlyPlayed}
          reading={reading}
          finished={finished}
          plate={plate}
          into={into}
        />
      </div>
    </main>
  );
}
