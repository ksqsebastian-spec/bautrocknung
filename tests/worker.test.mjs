import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import worker from "../dist/worker.mjs";
const schema =
  "CREATE TABLE requests(id TEXT PRIMARY KEY,phone TEXT NOT NULL,postcode TEXT NOT NULL,problem TEXT NOT NULL,created_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',ip_hash TEXT NOT NULL,email_id TEXT,delivery_error TEXT,notified TEXT NOT NULL DEFAULT 'pending')";
function fixture() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(schema);
  const DB = {
    prepare(query) {
      return {
        bind(...args) {
          return {
            first: async () => sql.prepare(query).get(...args) || null,
            all: async () => ({ results: sql.prepare(query).all(...args) }),
            run: async () => ({
              meta: {
                changes: Number(sql.prepare(query).run(...args).changes),
              },
            }),
          };
        },
        all: async () => ({ results: sql.prepare(query).all() }),
      };
    },
  };
  return {
    env: {
      DB,
      ADMIN_TOKEN: "test-admin-token",
      RESEND_API_KEY: "test-only",
      MAIL_TO: "test@example.invalid",
      SITE_URL: "https://example.invalid",
    },
    sql,
  };
}
function request(data, origin = "https://example.invalid") {
  return new Request("https://example.invalid/api/request", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "CF-Connecting-IP": "192.0.2.10",
    },
    body: JSON.stringify(data),
  });
}
const data = () => ({
  id: randomUUID(),
  phone: "0178 1234567",
  postcode: "22529",
  problem: "Wasserschaden",
  website: "",
});
test("submission stores once, notifies once, and supports safe retries", async () => {
  const { env, sql } = fixture();
  let mails = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    mails++;
    return Response.json({ id: "mail-1" });
  };
  try {
    const d = data();
    const res = await worker.fetch(request(d), env);
    assert.equal(res.status, 201);
    assert.equal((await res.json()).notified, true);
    assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM requests").get().n, 1);
    assert.equal((await worker.fetch(request(d), env)).status, 201);
    assert.equal(mails, 1);
    const changed = { ...d, phone: "0178 9999999" };
    assert.equal((await worker.fetch(request(changed), env)).status, 409);
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
test("invalid data and foreign origins cannot create leads", async () => {
  const { env, sql } = fixture();
  assert.equal(
    (await worker.fetch(request(data(), "https://evil.invalid"), env)).status,
    403,
  );
  assert.equal(
    (
      await worker.fetch(
        request({ ...data(), phone: "<script>alert(1)</script>" }),
        env,
      )
    ).status,
    400,
  );
  assert.equal(
    (await worker.fetch(request({ ...data(), postcode: "22529 OR 1=1" }), env))
      .status,
    400,
  );
  assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM requests").get().n, 0);
  sql.close();
});
test("atomic rate limiting caps new requests while preserving retry", async () => {
  const { env, sql } = fixture();
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ id: "mail" });
  try {
    const first = data();
    for (const d of [first, data(), data()])
      assert.equal((await worker.fetch(request(d), env)).status, 201);
    assert.equal((await worker.fetch(request(data()), env)).status, 429);
    assert.equal((await worker.fetch(request(first), env)).status, 201);
    assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM requests").get().n, 3);
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
test("mail failure preserves lead and scheduler retries successfully", async () => {
  const { env, sql } = fixture();
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
  try {
    const res = await worker.fetch(request(data()), env);
    assert.equal(res.status, 201);
    assert.equal((await res.json()).notified, false);
    assert.equal(
      sql.prepare("SELECT notified FROM requests").get().notified,
      "pending",
    );
    globalThis.fetch = async () => Response.json({ id: "retried" });
    let pending;
    await worker.scheduled({}, env, {
      waitUntil(p) {
        pending = p;
      },
    });
    await pending;
    assert.equal(
      sql.prepare("SELECT notified FROM requests").get().notified,
      "sent",
    );
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
test("admin data is private and status changes persist", async () => {
  const { env, sql } = fixture();
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ id: "mail" });
  try {
    const d = data();
    await worker.fetch(request(d), env);
    const url = "https://example.invalid/api/admin/requests";
    assert.equal((await worker.fetch(new Request(url), env)).status, 401);
    const headers = { Authorization: "Bearer test-admin-token" };
    const res = await worker.fetch(new Request(url, { headers }), env);
    const list = await res.json();
    assert.equal(list.requests.length, 1);
    assert.equal(list.requests[0].ip_hash, undefined);
    const changed = await worker.fetch(
      new Request(url + "/" + d.id, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      }),
      env,
    );
    assert.equal(changed.status, 200);
    assert.equal(
      sql.prepare("SELECT status FROM requests").get().status,
      "done",
    );
  } finally {
    globalThis.fetch = original;
    sql.close();
  }
});
test("expired records are removed and static resources have security headers", async () => {
  const { env, sql } = fixture();
  sql
    .prepare(
      "INSERT INTO requests(id,phone,postcode,problem,created_at,ip_hash,notified)VALUES('old','0000000','22529','Unklar','2020-01-01T00:00:00.000Z','test','sent')",
    )
    .run();
  let pending;
  await worker.scheduled({}, env, {
    waitUntil(p) {
      pending = p;
    },
  });
  await pending;
  assert.equal(sql.prepare("SELECT COUNT(*) AS n FROM requests").get().n, 0);
  const res = await worker.fetch(new Request("https://example.invalid/"), env);
  assert.equal(res.status, 200);
  assert.ok(
    res.headers
      .get("Content-Security-Policy")
      .includes("frame-ancestors 'none'"),
  );
  assert.ok((await res.text()).includes("Wieder trocken."));
  assert.equal(
    (await worker.fetch(new Request("https://example.invalid/secret"), env))
      .status,
    404,
  );
  sql.close();
});
