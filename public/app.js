const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const dialog = document.querySelector("#request-dialog");
const form = document.querySelector("#request-form");
let trigger = null,
  requestId = crypto.randomUUID();
function openRequest(event) {
  trigger = event.currentTarget;
  document.querySelector("#request-flow").hidden = false;
  document.querySelector("#request-success").hidden = true;
  dialog.setAttribute("aria-labelledby", "request-title");
  document.querySelector("#form-error").hidden = true;
  closeMenu();
  updateRequestSummary();
  document.querySelector("#situation-editor").hidden = true;
  dialog.showModal();
  document.querySelector("#request-title").focus({ preventScroll: true });
  if (!reducedMotion.matches)
    dialog.animate(
      [
        {
          opacity: 0,
          transform:
            innerWidth <= 650 ? "translateY(45px)" : "translateX(70px)",
        },
        { opacity: 1, transform: "translate(0)" },
      ],
      { duration: 480, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  document.body.classList.add("modal-open");
}
let closing = false;
async function closeRequest() {
  if (closing) return;
  closing = true;
  if (!reducedMotion.matches) {
    await dialog
      .animate(
        [
          { opacity: 1, transform: "translate(0)" },
          {
            opacity: 0,
            transform:
              innerWidth <= 650 ? "translateY(35px)" : "translateX(50px)",
          },
        ],
        { duration: 200, easing: "ease-in" },
      )
      .finished.catch(() => {});
  }
  dialog.close();
  document.body.classList.remove("modal-open");
  trigger?.focus();
  closing = false;
}
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeRequest();
});
document
  .querySelectorAll("[data-request]")
  .forEach((el) => el.addEventListener("click", openRequest));
document.querySelector("#close-dialog").addEventListener("click", closeRequest);
document.querySelector("#success-close").addEventListener("click", () => {
  form.reset();
  requestId = crypto.randomUUID();
  closeRequest();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  trigger?.focus();
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeRequest();
  }
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  form.elements.phone.setCustomValidity(
    form.elements.phone.value.replace(/\D/g, "").length < 7
      ? "Bitte geben Sie eine Telefonnummer mit mindestens sieben Ziffern ein."
      : "",
  );
  if (!form.reportValidity()) return;
  const button = document.querySelector("#submit-request"),
    error = document.querySelector("#form-error");
  button.disabled = true;
  button.textContent = "Anfrage wird gesendet …";
  error.hidden = true;
  try {
    const data = Object.fromEntries(new FormData(form));
    data.id = requestId;
    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({
      error:
        "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    }));
    if (!response.ok)
      throw new Error(
        result.error ||
          "Das Senden hat nicht geklappt. Bitte versuchen Sie es erneut.",
      );
    document.querySelector("#request-flow").hidden = true;
    document.querySelector("#request-success").hidden = false;
    dialog.setAttribute("aria-labelledby", "success-title");
    document.querySelector("#reference").textContent = result.reference;
    document.querySelector("#success-message").textContent = result.notified
      ? "Ihre Anfrage wurde per E-Mail an das Projektteam weitergeleitet. So geht es weiter:"
      : "Ihre Anfrage ist sicher gespeichert. Die E-Mail-Zustellung wird erneut versucht. Das Projektteam kann Ihre Anfrage auch im geschützten Posteingang sehen.";
    document.querySelector("#success-close").focus();
    form.reset();
    requestId = crypto.randomUUID();
  } catch (err) {
    error.textContent =
      err instanceof TypeError
        ? "Die Verbindung hat nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie uns an."
        : err.message;
    error.hidden = false;
    error.scrollIntoView({ block: "nearest" });
  } finally {
    button.disabled = false;
    button.innerHTML =
      'Rückruf anfordern <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
  }
});

// Native page scrolling. Motion enhances the photographic composition; never delays contact.
const header = document.querySelector("#site-header");
const hero = document.querySelector(".hero");
const heroFrame = document.querySelector("#hero-frame");
const heroPicture = heroFrame?.querySelector("picture");
const menu = document.querySelector("#menu-toggle");
function closeMenu() {
  header?.classList.remove("menu-open");
  menu?.setAttribute("aria-expanded", "false");
  menu?.setAttribute("aria-label", "Menü öffnen");
}
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  header.classList.toggle("menu-open", open);
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
});
document
  .querySelectorAll("#main-nav a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("menu-open")) {
    closeMenu();
    menu.focus();
  }
});
let framePending = false;
function updateScene() {
  if (!hero || !header || !heroFrame || !heroPicture) {
    framePending = false;
    return;
  }
  const height = hero.offsetHeight;
  header.classList.toggle("solid", scrollY > height - header.offsetHeight - 24);
  if (reducedMotion.matches) {
    heroFrame.style.clipPath = "";
    heroPicture.style.transform = "";
  } else {
    const phase = Math.min(scrollY / (height * 0.7), 1);
    const inset = phase * (innerWidth <= 650 ? 10 : 28);
    heroFrame.style.clipPath = `inset(0 ${inset}px round ${phase * 16}px)`;
    heroPicture.style.transform = `translateY(${Math.min(scrollY, height) * 0.16}px)`;
  }
  framePending = false;
}
function requestScene() {
  if (!framePending) {
    framePending = true;
    requestAnimationFrame(updateScene);
  }
}
addEventListener("scroll", requestScene, { passive: true });
addEventListener("resize", requestScene);
reducedMotion.addEventListener("change", () => {
  updateScene();
  if (reducedMotion.matches)
    document.querySelectorAll(".reveal-pending").forEach((el) => {
      el.classList.remove("reveal-pending");
      el.classList.add("is-visible");
    });
});
updateScene();
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        entry.target.classList.remove("reveal-pending");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -35px 0px" },
);
document.querySelectorAll("[data-reveal]").forEach((el) => {
  if (!reducedMotion.matches && el.getBoundingClientRect().top > innerHeight)
    el.classList.add("reveal-pending");
  revealObserver.observe(el);
});
const mobileBar = document.querySelector("#mobile-bar");
const visibleContactActions = new Set();
let passedHeroAction = false;
const heroRequest = document.querySelector("#hero-request");
const contactObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.target === heroRequest)
        passedHeroAction = entry.boundingClientRect.top < 0;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.8)
        visibleContactActions.add(entry.target);
      else visibleContactActions.delete(entry.target);
    });
    mobileBar?.classList.toggle(
      "visible",
      passedHeroAction && visibleContactActions.size === 0,
    );
  },
  { threshold: [0, 0.8] },
);
document
  .querySelectorAll("main [data-request]")
  .forEach((action) => contactObserver.observe(action));
// Animate native details while preserving keyboard operation and the static fallback.
document.querySelectorAll(".faq details").forEach((details) => {
  const summary = details.querySelector("summary"),
    answer = details.querySelector(".faq-answer");
  let animation;
  summary.addEventListener("click", (event) => {
    if (reducedMotion.matches) return;
    event.preventDefault();
    if (animation) return;
    const wasOpen = details.open;
    if (!wasOpen) details.open = true;
    const height = answer.scrollHeight;
    animation = answer.animate(
      wasOpen
        ? [
            { height: `${height}px`, opacity: 1 },
            { height: "0px", opacity: 0 },
          ]
        : [
            { height: "0px", opacity: 0 },
            { height: `${height}px`, opacity: 1 },
          ],
      { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    animation.onfinish = () => {
      if (wasOpen) details.open = false;
      animation = null;
    };
  });
});

// A short technical explanation, never a simulated measurement or live dashboard.
document.querySelectorAll("[data-method]").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.method;
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    document.querySelectorAll("[data-method]").forEach((choice) => {
      const active = willOpen && choice.dataset.method === selected;
      choice.setAttribute("aria-expanded", String(active));
      const panel = document.querySelector(`#method-${choice.dataset.method}`);
      panel.hidden = !active;
      if (active && !reducedMotion.matches)
        panel.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 350, easing: "ease-out" },
        );
    });
  });
});

// Optional guidance: a useful plan before asking for contact details. No diagnosis or invented availability.
const situations = {
  Unklar: {
    label: "Die Situation gemeinsam einordnen",
    title: "Erst Klarheit. Dann der passende Plan.",
    description:
      "Wir besprechen, was Ihnen aufgefallen ist, und klären, ob eine Messung vor Ort sinnvoll ist.",
  },
  Wasserschaden: {
    label: "Wasser ist ausgetreten",
    title: "Den Schaden eingrenzen. Räume zurückgewinnen.",
    description:
      "Nach dem Stoppen des Wasseraustritts prüfen wir, welche Bauteile betroffen sind. Daraus entsteht der Plan für Trocknung und Wiederherstellung.",
  },
  "Feuchte Wand": {
    label: "Wand oder Boden ist feucht",
    title: "Erst messen. Dann gezielt trocknen.",
    description:
      "Wir prüfen Wand, Bodenaufbau und Raumluft. Welche Trocknung sinnvoll ist, entscheiden die Messung und die Situation vor Ort.",
  },
  "Neubau / Estrich": {
    label: "Neubau oder Estrich trocknen",
    title: "Belegreife prüfen. Den nächsten Schritt planen.",
    description:
      "Wir prüfen die Baufeuchte und die Belegreife des Estrichs. Das Trocknungsverfahren richtet sich nach Aufbau und Messung.",
  },
};
let selectedSituation = "Unklar";
const problemSelect = form.elements.problem;
function updateRequestSummary() {
  problemSelect.value = selectedSituation;
  document.querySelector("#request-situation").textContent =
    situations[selectedSituation].label;
}
function selectSituation(value) {
  if (!situations[value]) return;
  selectedSituation = value;
  document
    .querySelectorAll('[name="situation"]')
    .forEach((radio) => (radio.checked = radio.value === value));
  const situation = situations[value];
  document.querySelector("#plan-title").textContent = situation.title;
  document.querySelector("#plan-description").textContent =
    situation.description;
  document.querySelector("#plan-caution").hidden = value !== "Wasserschaden";
  updateRequestSummary();
  if (!reducedMotion.matches)
    document.querySelector("#plan-copy").animate(
      [
        { opacity: 0.45, transform: "translateY(5px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 260, easing: "ease-out" },
    );
}
document
  .querySelectorAll('[name="situation"]')
  .forEach((radio) =>
    radio.addEventListener("change", () => selectSituation(radio.value)),
  );
problemSelect.addEventListener("change", () =>
  selectSituation(problemSelect.value),
);
document.querySelector("#change-situation").addEventListener("click", () => {
  const editor = document.querySelector("#situation-editor");
  editor.hidden = !editor.hidden;
  if (!editor.hidden) problemSelect.focus();
});

form.elements.phone.addEventListener("input", () =>
  form.elements.phone.setCustomValidity(""),
);
form.elements.postcode.addEventListener("input", () =>
  form.elements.postcode.setCustomValidity(""),
);
form.elements.postcode.addEventListener("invalid", () =>
  form.elements.postcode.setCustomValidity(
    "Bitte geben Sie die fünfstellige Postleitzahl des Einsatzortes ein.",
  ),
);

form.elements.phone.addEventListener("invalid", () =>
  form.elements.phone.setCustomValidity(
    "Bitte geben Sie eine Telefonnummer mit mindestens sieben Ziffern ein.",
  ),
);
