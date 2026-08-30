/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" }, // Spotify album art
      { protocol: "https", hostname: "covers.openlibrary.org" }, // Book covers
      { protocol: "https", hostname: "tkdloiqrnsnvxsodrlpj.supabase.co" }, // Supabase storage
    ],
  },
};

export default nextConfig;
