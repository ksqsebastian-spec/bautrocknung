const dialog = document.querySelector("#request-dialog");
const form = document.querySelector("#request-form");
let trigger = null,
  requestId = crypto.randomUUID();
const showStep = (step) => {
  dialog.setAttribute(
    "aria-labelledby",
    step === 1 ? "request-title" : "contact-title",
  );
  document.querySelector("#problem-step").hidden = step !== 1;
  document.querySelector("#contact-step").hidden = step !== 2;
  document.querySelector("#step-label").textContent = `Schritt ${step} von 2`;
  document.querySelector("#progress-bar").style.width =
    step === 1 ? "50%" : "100%";
};
function openRequest(event) {
  trigger = event.currentTarget;
  document.querySelector("#request-flow").hidden = false;
  document.querySelector("#request-success").hidden = true;
  showStep(1);
  dialog.showModal();
  document.body.classList.add("modal-open");
}
function closeRequest() {
  dialog.close();
  document.body.classList.remove("modal-open");
  trigger?.focus();
}
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
document.querySelector("#next-step").addEventListener("click", () => {
  const radios = form.querySelectorAll("[name=problem]");
  if (!form.querySelector("[name=problem]:checked")) {
    radios[0].reportValidity();
    return;
  }
  showStep(2);
  form.elements.phone.focus();
});
document.querySelector("#back-step").addEventListener("click", () => {
  showStep(1);
  form.querySelector("[name=problem]:checked")?.focus();
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!document.querySelector("#problem-step").hidden) {
    document.querySelector("#next-step").click();
    return;
  }
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
    const result = await response.json();
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
      ? "Ihre Rückrufanfrage wurde per E-Mail an das Projektteam weitergeleitet. Der nächste Schritt wird persönlich mit Ihnen abgestimmt."
      : "Ihre Anfrage ist sicher gespeichert. Die E-Mail-Zustellung wird erneut versucht. Das Projektteam kann Ihre Anfrage auch im geschützten Posteingang sehen.";
    document.querySelector("#success-close").focus();
    form.reset();
    requestId = crypto.randomUUID();
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
    error.scrollIntoView({ block: "nearest" });
  } finally {
    button.disabled = false;
    button.innerHTML = 'Rückruf anfordern <span aria-hidden="true">↗</span>';
  }
});
const descriptions = [
  "Den Bodenbelag erhalten wir nach Möglichkeit. Welcher Zugang geeignet ist, hängt vom Material und vom Aufbau ab.",
  "Beim Estrich prüfen wir die Feuchte. Vor einem neuen Bodenbelag wird die Belegreife gemessen, nicht geschätzt.",
  "Unter dem Estrich trocknet Feuchtigkeit kaum von allein. Über Randfugen oder Bohrungen erreichen wir die Dämmschicht gezielt.",
];
document.querySelectorAll("[data-floor]").forEach((button) =>
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-floor]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    document
      .querySelectorAll("[data-layer]")
      .forEach((layer) =>
        layer.classList.toggle(
          "active",
          layer.dataset.layer === button.dataset.floor,
        ),
      );
    document.querySelector("#layer-description").textContent =
      descriptions[Number(button.dataset.floor)];
  }),
);
