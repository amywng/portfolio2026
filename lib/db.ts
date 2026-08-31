import { supabase } from "./supabase";

// ── Types ───────────────────────────────────────────────────────────────────

// experience
export type ExperienceRole = {
  id: string;
  company_id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  sort_order: number;
};

export type ExperienceCompany = {
  id: string;
  company: string;
  icon: string;
  sort_order: number;
  roles: ExperienceRole[];
};

// art
export type ArtPiece = {
  id: string;
  title: string | null;
  blurb: string | null;
  url: string;
  category: "digital" | "animated" | "tangible" | "experimental";
  sort_order: number;
  audio: boolean | null;
  created_at: number;
};

// currently
export type Book = {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  status: "reading" | "finished";
  started_at: string | null;
  finished_at: string | null;
  rating: number | null;
  review: string | null;
  created_at: number;
};

export type OnMyPlate = {
  id: string;
  image_url: string;
  dish: string;
  restaurant: string | null;
  note: string | null;
  visited_at: Date;
  created_at: number;
};

export type CurrentlyInto = {
  id: string;
  text: string;
  category: "playing" | "making" | "enjoying";
  location: "laptop" | "notepad";
  sticker: string | null;
  sort_order: number;
  created_at: number;
};

// travel
export type TravelPlace = {
  id: string;
  slug: string;
  name: string;
  states: string[] | null;
  country: string;
  lat: number;
  lon: number;
  home: boolean;
  cover_url: string | null;
  date: string | null;
  notes: string | null;
  sort_order: number;
  type: "pin" | "visited" | "preview";
  created_at: number;
};

export type TravelImage = {
  id: string;
  place_slug: string | null;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: number;
};

// ── Methods ───────────────────────────────────────────────────────────────────

// experience
export async function getExperience(): Promise<ExperienceCompany[]> {
  const [companies, roles] = await Promise.all([
    supabase.from("experience_companies").select("*").order("sort_order"),
    supabase.from("experience_roles").select("*").order("sort_order"),
  ]);

  return (companies.data ?? []).map((company) => ({
    ...company,
    roles: (roles.data ?? []).filter((r) => r.company_id === company.id),
  }));
}

// art
export async function getArt(): Promise<ArtPiece[]> {
  const { data } = await supabase
    .from("art")
    .select("*")
    .order("sort_order", { ascending: true });

  return data as ArtPiece[];
}

// currently
export async function getCurrentData(): Promise<{
  reading: Book | undefined;
  finished: Book[];
  plate: OnMyPlate[];
  into: CurrentlyInto[];
}> {
  const [books, plate, into] = await Promise.all([
    supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("on_my_plate")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(6),
    supabase
      .from("currently_into")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  return {
    reading: books.data?.find((b) => b.status === "reading") as
      | Book
      | undefined,
    finished: books.data?.filter((b) => b.status === "finished") as Book[],
    plate: plate.data as OnMyPlate[],
    into: into.data as CurrentlyInto[],
  };
}

// travel
export async function getTravelPlaces(): Promise<TravelPlace[]> {
  const { data } = await supabase
    .from("travel_places")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as TravelPlace[];
}

export async function getTravelPlace(slug: string): Promise<{
  place: TravelPlace | null;
  images: TravelImage[];
}> {
  const [place, images] = await Promise.all([
    supabase.from("travel_places").select("*").eq("slug", slug).single(),
    supabase
      .from("travel_images")
      .select("*")
      .eq("place_slug", slug)
      .order("sort_order"),
  ]);
  return {
    place: place.data as TravelPlace | null,
    images: (images.data ?? []) as TravelImage[],
  };
}
