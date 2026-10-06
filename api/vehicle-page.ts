import type { VercelRequest, VercelResponse } from '@vercel/node'

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[char];
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const id = typeof req.query.id === "string" ? req.query.id : "";

  if (!id) return res.status(400).send("Missing vehicle id");

  const host = req.headers.host;

  if (!host) return res.status(500).send("Missing host");

  const origin = `https://${host}`;

  /*
   * Get the normal Vite-generated index.html.
   * React will still boot normally after the HTML is returned.
   */
  const indexResponse = await fetch(`${origin}/index.html`);

  if (!indexResponse) return res.status(500).send("Could not load application HTML");

  let html = await indexResponse.text();

  /*
   * The image URL can be generated directly from the vehicle ID.
   */
  const imageUrl = `https://wiki.warthunder.com/assets/gunit_social/${encodeURIComponent(id)}.jpg`;

  /*
   * Get the vehicle name from Supabase.
   *
   * This uses the same public/publishable key that your React app
   * already uses. Do NOT use a service-role key here.
   */
  let vehicleName = id;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const vehicleResponse = await fetch(
        `${supabaseUrl}/rest/v1/vehicles?id=eq.${encodeURIComponent(id)}&select=name`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        },
      );

      if (vehicleResponse.ok) {
        const vehicles = await vehicleResponse.json();

        if (Array.isArray(vehicles) && vehicles[0]?.name) {
          vehicleName = vehicles[0].name;
        }
      }
    } catch {
      // Falling back to the vehicle ID is fine.
    }
  }

  const title = `${vehicleName} - War Thunder Vehicle Dashboard`;
  const pageUrl = `${origin}/vehicle/${encodeURIComponent(id)}`;

  const safeTitle = escapeHtml(title);
  const safeImageUrl = escapeHtml(imageUrl);
  const safePageUrl = escapeHtml(pageUrl);

  /*
   * Replace the normal title and inject the social metadata.
   */
  html = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${safeTitle}</title>`,
  );

  const socialMetadata = `
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta property="og:image" content="${safeImageUrl}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
  `;

  html = html.replace("</head>", `${socialMetadata}\n</head>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  return res.status(200).send(html);
}