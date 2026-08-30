import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTravelPlace, getTravelPlaces } from "@/lib/db";

export async function generateStaticParams() {
  const places = await getTravelPlaces();
  return places.map((p) => ({ slug: p.slug }));
}

export const revalidate = 3600;

export default async function TravelPlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { place, images } = await getTravelPlace(slug);
  if (!place) notFound();

  return (
    <main className="max-w-wide mx-auto px-4 md:px-7 pt-20 md:pt-28 pb-20 md:pb-28">
      <Link
        href="/elsewhere"
        className="inline-flex min-h-11 items-center font-mono text-sm md:text-xs text-muted hover:text-fuchsia transition-colors"
        data-cursor-hover
      >
        ← elsewhere
      </Link>

      <div className="mt-8">
        <p className="eyebrow">{place.states ? `${place.states}` : place.country}</p>
        <h1 className="break-words font-display italic font-light text-5xl md:text-6xl tracking-[-0.02em]">
          {place.name}
        </h1>
        {place.date && (
          <p className="font-mono text-[11px] text-muted mt-2">{place.date}</p>
        )}
      </div>

      {place.cover_url && (
        <div className="relative mt-8 w-full aspect-[3/2] md:aspect-[16/9] rounded-xl overflow-hidden">
          <Image
            src={place.cover_url}
            alt={place.name}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {place.notes && (
        <div className="mt-8 max-w-content">
          <p className="eyebrow">notes</p>
          <p className="text-[15px] leading-relaxed text-ink-soft dark:text-white/80 whitespace-pre-wrap">
            {place.notes}
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-10">
          <p className="eyebrow">photos</p>
          <div className="columns-2 md:columns-3 gap-3 mt-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid mb-3 group relative rounded-md overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={img.caption ?? place.name}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="w-full h-auto block"
                />
                {img.caption && (
                  <>
                    {/* Desktop: hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-end p-3 hidden md:flex">
                      <p className="font-mono text-[10px] text-paper">{img.caption}</p>
                    </div>
                    {/* Mobile: always visible caption below */}
                    <p className="mt-1.5 px-0.5 font-mono text-[10px] leading-relaxed text-muted md:hidden">
                      {img.caption}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!place.notes && images.length === 0 && (
        <p className="mt-8 font-mono text-[15px] text-muted">
          notes and photos coming soon.
        </p>
      )}
    </main>
  );
}
