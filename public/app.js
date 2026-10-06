const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
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
  document.querySelectorAll("#contact-step input").forEach((input) => {
    input.disabled = step !== 2;
  });
  const panel = document.querySelector(
    step === 1 ? "#problem-step" : "#contact-step",
  );
  if (dialog.open && !reducedMotion.matches)
    panel.animate(
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 350, easing: "ease-out" },
    );
};
function openRequest(event) {
  trigger = event.currentTarget;
  document.querySelector("#request-flow").hidden = false;
  document.querySelector("#request-success").hidden = true;
  showStep(1);
  closeMenu();
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
  header.classList.toggle("solid", scrollY > height - 105);
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
const contactObserver = new IntersectionObserver((entries) => {
  const entry = entries[0];
  mobileBar?.classList.toggle(
    "visible",
    !entry.isIntersecting && entry.boundingClientRect.top < 0,
  );
});
const heroRequest = document.querySelector("#hero-request");
if (heroRequest) contactObserver.observe(heroRequest);
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
