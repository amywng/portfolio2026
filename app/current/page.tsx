import { getRecentlyPlayed } from "@/lib/spotify";
import { getCurrentData } from "@/lib/db";
import Current from "@/components/Current";

export const revalidate = 60;

export default async function CurrentPage() {
  const [recentlyPlayed, { reading, finished, plate, into }] =
    await Promise.all([getRecentlyPlayed(), getCurrentData()]);

  return (
    <main>
      <div className="max-w-wide mx-auto px-4 md:px-7 pt-20 md:pt-28 pb-20 md:pb-28">
        <h1 className="section-header">what I've been up to recently</h1>
        <Current
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
