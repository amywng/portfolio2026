const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_URL =
  "https://api.spotify.com/v1/me/player/recently-played?limit=10";

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error(
      "Missing Spotify env vars. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, " +
        "and SPOTIFY_REFRESH_TOKEN to .env.local — see README.md.",
    );
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh Spotify token: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export type Song = {
  title: string | null;
  artist: string | null;
  albumArt: string | null;
  songUrl: string | null;
};

export async function getRecentlyPlayed(): Promise<Song[]> {
  const accessToken = await getAccessToken();

  const recentRes = await fetch(RECENTLY_PLAYED_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (recentRes.ok) {
    const data = await recentRes.json();
    const songs = data?.items;
    if (songs) {
      return songs.map(
        (song: {
          track: {
            name: string;
            artists: { name: string }[];
            album: { images: { url: string }[] };
            external_urls: { spotify: string };
          };
        }) => ({
          title: song.track.name,
          artist:
            song.track.artists
              ?.map((a: { name: string }) => a.name)
              .join(", ") ?? null,
          albumArt: song.track.album?.images?.[0]?.url ?? null,
          songUrl: song.track.external_urls?.spotify ?? null,
        }),
      );
    }
  }

  return [];
}
