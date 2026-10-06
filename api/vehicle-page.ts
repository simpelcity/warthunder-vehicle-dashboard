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

function getDocumentTitle(vehicle: { id: string, name: string }) {
  if (!vehicle) return ""

  if (vehicle.id === "germ_leopard_2a5_yt_cup_2019") return "Leopard 2A5 (Germany)"
  if (vehicle.id === "uk_challenger_ii_yt_cup_2019") return "Challenger 2 (Great Britain)"
  if (vehicle.id === "ussr_t_80u_yt_cup_2019") return "T-80U (USSR)"
  return vehicle.name
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const id = typeof req.query.id === "string" ? req.query.id : "";

  if (!id) return res.status(400).send("Missing vehicle id");

  const host = req.headers.host;

  if (!host) return res.status(500).send("Missing host");

  const protocol =
    req.headers["x-forwarded-proto"] ||
    (process.env.NODE_ENV === "development" ? "http" : "https");

  const origin = `${protocol}://${host}`;

  const indexResponse = await fetch(`${origin}/index.html`);

  if (!indexResponse) return res.status(500).send("Could not load application HTML");

  let html = await indexResponse.text();

  const imageUrl = `https://wiki.warthunder.com/assets/gunit_social/${encodeURIComponent(id)}.jpg`;

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

        if (Array.isArray(vehicles) && vehicles[0]) {
          vehicleName = getDocumentTitle(vehicles[0]);
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

  html = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${safeTitle}</title>`,
  );

  const socialMetadata = `
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta name="og:image:width" content="1200" />
    <meta name="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
  `;

  html = html.replace("</head>", `${socialMetadata}\n</head>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  return res.status(200).send(html);
}