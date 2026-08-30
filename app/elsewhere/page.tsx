import { getTravelPlaces } from "@/lib/db";
import TravelMap from "@/components/TravelMap";

export const revalidate = 3600;

export default async function ElsewherePage() {
  const places = await getTravelPlaces();

  return (
    <main className="max-w-wide mx-auto px-4 md:px-7 pt-20 md:pt-28 pb-20 md:pb-28">
      <p className="eyebrow">elsewhere</p>
      <h1 className="section-header">travel log</h1>

      <TravelMap places={places} />
    </main>
  );
}
