/**
 * One-time helper to get a Spotify refresh token.
 *
 * Usage:
 *   1. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local first.
 *   2. In your Spotify app settings (developer.spotify.com/dashboard), add
 *      this exact Redirect URI:  http://127.0.0.1:8888/callback
 *   3. Run:  npm run spotify:auth
 *   4. It prints a URL — open it, log in, click "Agree".
 *   5. You'll be redirected back here and your refresh token will be printed.
 *      Copy it into .env.local as SPOTIFY_REFRESH_TOKEN.
 */

require("dotenv").config({ path: ".env.local" });
const http = require("http");
const { URL } = require("url");

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ["user-read-currently-playing", "user-read-recently-played"].join(" ");

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.error(
    "\nMissing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in .env.local.\n" +
      "Add those first, then re-run this script.\n"
  );
  process.exit(1);
}

const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.set("client_id", SPOTIFY_CLIENT_ID);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("scope", SCOPES);

console.log("\nOpen this URL in your browser, then click Agree:\n");
console.log(authUrl.toString());
console.log(`\nWaiting for the redirect on ${REDIRECT_URI} ...\n`);

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (reqUrl.pathname !== "/callback") {
    res.end("Not found");
    return;
  }

  const code = reqUrl.searchParams.get("code");
  if (!code) {
    res.end("No code received — check the terminal and try again.");
    return;
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const data = await tokenRes.json();

  if (data.refresh_token) {
    console.log("\n✅ Success! Add this to .env.local:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    res.end("Done — check your terminal, then close this tab.");
  } else {
    console.error("\n❌ Something went wrong:", data);
    res.end("Something went wrong — check your terminal.");
  }

  server.close();
  process.exit(0);
});

server.listen(PORT);
