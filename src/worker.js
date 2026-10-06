const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
const problems = new Set([
  "Wasserschaden",
  "Feuchte Wand",
  "Neubau / Estrich",
  "Unklar",
]);
async function hash(value) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
async function authorized(request, env) {
  const supplied =
    request.headers.get("Authorization")?.replace(/^Bearer /, "") || "";
  return (
    !!env.ADMIN_TOKEN &&
    (await hash(supplied)) === (await hash(env.ADMIN_TOKEN))
  );
}
async function notify(row, env) {
  if (row.notified === "sent") return true;
  try {
    const isTest = row.phone.replace(/\D/g, "") === "0000000000";
    const text = `${isTest ? "SYSTEMTEST — keine echte Kundenanfrage. Bitte nicht zurückrufen.\n\n" : ""}Neue Rückrufanfrage — Bautrocknung Website-Vorschau\n\nSituation: ${row.problem}\nTelefon: ${row.phone}\nPostleitzahl: ${row.postcode}\nReferenz: ${row.id.slice(0, 8).toUpperCase()}\nEingang: ${row.created_at}\n\nPosteingang: ${env.SITE_URL}/admin\n\nDies ist eine Anfrage, keine bestätigte Terminbuchung.`;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `bautrocknung-${row.id}`,
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || "Bautrocknung Projekt <onboarding@resend.dev>",
        to: [env.MAIL_TO],
        subject: `${isTest ? "[TEST] " : ""}Bautrocknung: ${row.problem} · ${row.postcode}`,
        text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      let failure;
      try {
        failure = await response.json();
      } catch {
        failure = { message: "Email provider rejected request" };
      }
      throw new Error(
        `${response.status}: ${failure.message || failure.name || "Email provider rejected request"}`,
      );
    }
    const mail = await response.json();
    if (!mail.id) throw new Error("Email id missing");
    await env.DB.prepare(
      "UPDATE requests SET notified='sent', delivery_error=NULL, email_id=? WHERE id=?",
    )
      .bind(mail.id, row.id)
      .run();
    return true;
  } catch (error) {
    await env.DB.prepare(
      "UPDATE requests SET notified='pending',delivery_error=? WHERE id=?",
    )
      .bind(String(error.message).slice(0, 500), row.id)
      .run();
    return false;
  }
}
async function submit(request, env) {
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin)
    return json({ error: "Anfrage muss von dieser Website kommen." }, 403);
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    return json({ error: "Ungültiges Format." }, 415);
  if (Number(request.headers.get("Content-Length") || 0) > 4096)
    return json({ error: "Anfrage ist zu groß." }, 413);
  const raw = await request.text();
  if (raw.length > 4096) return json({ error: "Anfrage ist zu groß." }, 413);
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400);
  }
  if (!data || typeof data !== "object")
    return json({ error: "Ungültige Anfrage." }, 400);
  if (data.website) return json({ reference: "OK", notified: true });
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  if (
    !/^[+0-9 ()-]{7,25}$/.test(phone) ||
    phone.replace(/\D/g, "").length < 7 ||
    !/^\d{5}$/.test(data.postcode || "") ||
    !problems.has(data.problem) ||
    !/^\w{8}-\w{4}-4\w{3}-[89ab]\w{3}-\w{12}$/.test(data.id || "")
  )
    return json(
      { error: "Bitte prüfen Sie Telefonnummer, Postleitzahl und Situation." },
      400,
    );
  const ipHash = await hash(
    `${env.ADMIN_TOKEN}:${request.headers.get("CF-Connecting-IP") || "unknown"}`,
  );
  let row = await env.DB.prepare("SELECT * FROM requests WHERE id=?")
    .bind(data.id)
    .first();
  if (
    row &&
    (row.ip_hash !== ipHash ||
      row.phone !== phone ||
      row.postcode !== data.postcode ||
      row.problem !== data.problem)
  )
    return json({ error: "Bitte öffnen Sie eine neue Anfrage." }, 409);
  if (!row) {
    const now = new Date().toISOString();
    const since = new Date(Date.now() - 3600000).toISOString();
    const result = await env.DB.prepare(
      "INSERT OR IGNORE INTO requests(id,phone,postcode,problem,created_at,ip_hash) SELECT ?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM requests WHERE ip_hash=? AND created_at>?)<3",
    )
      .bind(
        data.id,
        phone,
        data.postcode,
        data.problem,
        now,
        ipHash,
        ipHash,
        since,
      )
      .run();
    if (!result.meta.changes)
      return json(
        {
          error:
            "Zu viele Anfragen. Bitte versuchen Sie es später erneut oder rufen Sie an.",
        },
        429,
      );
    row = await env.DB.prepare("SELECT * FROM requests WHERE id=?")
      .bind(data.id)
      .first();
  }
  const notified = await notify(row, env);
  return json({ reference: row.id.slice(0, 8).toUpperCase(), notified }, 201);
}
async function route(request, env) {
  const path = new URL(request.url).pathname;
  if (path === "/api/request" && request.method === "POST")
    return submit(request, env);
  if (path.startsWith("/api/admin/")) {
    if (!(await authorized(request, env)))
      return json({ error: "Nicht autorisiert." }, 401);
    if (path === "/api/admin/retry" && request.method === "POST") {
      const rows = await env.DB.prepare(
        "SELECT * FROM requests WHERE notified='pending' AND created_at>? ORDER BY created_at DESC LIMIT 5",
      )
        .bind(new Date(Date.now() - 86400000).toISOString())
        .all();
      const results = [];
      for (const row of rows.results)
        results.push({ id: row.id, sent: await notify(row, env) });
      return json({ results });
    }
    if (path === "/api/admin/requests" && request.method === "GET") {
      const data = await env.DB.prepare(
        "SELECT id,phone,postcode,problem,created_at,status,notified,email_id FROM requests ORDER BY created_at DESC LIMIT 200",
      ).all();
      return json({ requests: data.results });
    }
    const id = path.match(/^\/api\/admin\/requests\/([a-zA-Z0-9-]{36})$/)?.[1];
    if (id && request.method === "PATCH") {
      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: "Ungültig." }, 400);
      }
      if (!["new", "done"].includes(data.status))
        return json({ error: "Ungültiger Status." }, 400);
      const r = await env.DB.prepare("UPDATE requests SET status=? WHERE id=?")
        .bind(data.status, id)
        .run();
      return r.meta.changes
        ? json({ ok: true })
        : json({ error: "Nicht gefunden." }, 404);
    }
    return json({ error: "Nicht gefunden." }, 404);
  }
  if (path.startsWith("/api/")) return json({ error: "Nicht gefunden." }, 404);
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Method not allowed", { status: 405 });
  if (path === "/robots.txt")
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain" },
    });
  const key =
    path === "/"
      ? "/index.html"
      : path === "/admin"
        ? "/admin.html"
        : path === "/datenschutz"
          ? "/datenschutz.html"
          : path;
  const asset = ASSETS[key];
  if (!asset) return new Response("Seite nicht gefunden", { status: 404 });
  return new Response(
    request.method === "HEAD"
      ? null
      : asset.binary
        ? Uint8Array.from(atob(asset.body), (c) => c.charCodeAt(0))
        : asset.body,
    {
      headers: {
        "Content-Type": asset.type,
        "Cache-Control": asset.type.startsWith("image/")
          ? "public,max-age=86400"
          : "no-cache",
      },
    },
  );
}
export default {
  async fetch(request, env) {
    let response;
    try {
      response = await route(request, env);
    } catch {
      response = json(
        {
          error:
            "Die Anfrage konnte gerade nicht verarbeitet werden. Bitte versuchen Sie es erneut oder rufen Sie an.",
        },
        503,
      );
    }
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("X-Robots-Tag", "noindex, nofollow");
    headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    );
    return new Response(response.body, { status: response.status, headers });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      (async () => {
        const data = await env.DB.prepare(
          "SELECT * FROM requests WHERE notified='pending' AND created_at>? ORDER BY created_at ASC LIMIT 10",
        )
          .bind(new Date(Date.now() - 86400000).toISOString())
          .all();
        for (const row of data.results) await notify(row, env);
        await env.DB.prepare("DELETE FROM requests WHERE created_at<?")
          .bind(new Date(Date.now() - 90 * 86400000).toISOString())
          .run();
      })(),
    );
  },
};
