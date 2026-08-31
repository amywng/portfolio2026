import { getArt } from "@/lib/db";
import ArtGallery from "@/components/ArtGallery";

export const revalidate = 3600;

export default async function ArtPage() {
  const art = await getArt();

  return (
    <main className="max-w-wide mx-auto px-4 md:px-7 pt-20 md:pt-28 pb-20 md:pb-28">
      <h1 className="section-header">selected pieces from over the years</h1>

      <ArtGallery art={art} />
    </main>
  );
}
