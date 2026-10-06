let token = sessionStorage.getItem("bautrocknung-admin") || "";
const error = document.querySelector("#admin-error");
async function refresh() {
  error.textContent = "";
  try {
    const response = await fetch("/api/admin/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(
        response.status === 401
          ? "Zugangsschlüssel nicht gültig."
          : "Posteingang konnte nicht geladen werden.",
      );
    const { requests } = await response.json();
    document.querySelector("#login").hidden = true;
    document.querySelector("#inbox").hidden = false;
    document.querySelector("#logout").hidden = false;
    document.querySelector("#count").textContent =
      `${requests.length} Anfragen · ${requests.filter((r) => r.status === "new").length} offen`;
    const list = document.querySelector("#requests");
    list.replaceChildren();
    if (!requests.length) {
      const p = document.createElement("p");
      p.textContent =
        "Noch keine Anfragen. Neue Anfragen erscheinen hier und werden per Resend weitergeleitet.";
      p.style.padding = "30px 0";
      list.append(p);
    }
    requests.forEach((r) => {
      const article = document.createElement("article");
      article.className = `request-item ${r.status === "done" ? "done" : ""}`;
      const content = document.createElement("div");
      const title = document.createElement("h2");
      title.textContent = r.problem;
      const meta = document.createElement("p");
      meta.textContent = `PLZ ${r.postcode} · ${new Date(r.created_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })} · ${r.id.slice(0, 8).toUpperCase()}`;
      const phone = document.createElement("a");
      phone.href = `tel:${r.phone.replace(/[^+0-9]/g, "")}`;
      phone.textContent = r.phone;
      const sent = document.createElement("p");
      sent.textContent =
        r.notified === "sent"
          ? "E-Mail an Projektteam versendet"
          : "E-Mail-Zustellung ausstehend";
      content.append(title, meta, phone, sent);
      const button = document.createElement("button");
      button.textContent =
        r.status === "done" ? "Wieder öffnen" : "Als erledigt markieren";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          const res = await fetch(`/api/admin/requests/${r.id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: r.status === "done" ? "new" : "done",
            }),
          });
          if (!res.ok)
            throw new Error("Status konnte nicht gespeichert werden.");
          await refresh();
        } catch (e) {
          error.textContent = e.message;
          button.disabled = false;
        }
      });
      article.append(content, button);
      list.append(article);
    });
  } catch (e) {
    error.textContent = e.message;
    document.querySelector("#login").hidden = false;
    document.querySelector("#inbox").hidden = true;
  }
}
document.querySelector("#login").addEventListener("submit", (e) => {
  e.preventDefault();
  token = document.querySelector("#token").value.trim();
  sessionStorage.setItem("bautrocknung-admin", token);
  refresh();
});
document.querySelector("#refresh").addEventListener("click", refresh);
document.querySelector("#logout").addEventListener("click", () => {
  sessionStorage.removeItem("bautrocknung-admin");
  token = "";
  document.querySelector("#inbox").hidden = true;
  document.querySelector("#login").hidden = false;
  document.querySelector("#logout").hidden = true;
  document.querySelector("#token").value = "";
});
if (token) refresh();

document.querySelector("#retry").addEventListener("click", async () => {
  const button = document.querySelector("#retry");
  button.disabled = true;
  try {
    const res = await fetch("/api/admin/retry", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Zustellung konnte nicht gestartet werden.");
    const data = await res.json();
    await refresh();
    if (data.results.some((r) => !r.sent))
      error.textContent =
        "Mindestens eine E-Mail konnte noch nicht zugestellt werden. Die Anfrage bleibt gespeichert.";
  } catch (e) {
    error.textContent = e.message;
  } finally {
    button.disabled = false;
  }
});
