(() => {
  const WEDDING = new Date("2026-12-16T11:00:00+05:30");
  const pages = [...document.querySelectorAll(".page")];

  /* ---------- Hash-based pages (#page-0 envelope, #page-1 invite, #page-2 RSVP) ---------- */
  function route() {
    const hash = location.hash.slice(1);
    let target = document.getElementById(hash);
    let index = 0;
    if (target && target.classList.contains("page")) {
      index = Number(target.dataset.page);
    } else if (target) {
      index = Number(target.closest(".page")?.dataset.page ?? 0);
    } else {
      target = null;
    }
    pages.forEach((p) => p.classList.toggle("active", Number(p.dataset.page) === index));
    if (target && !target.classList.contains("page")) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth" }));
    } else {
      window.scrollTo(0, 0);
    }
    if (index === 0) document.querySelector(".envelope")?.classList.remove("open");
    observeFades();
  }
  window.addEventListener("hashchange", route);

  /* ---------- Envelope ---------- */
  const envelope = document.getElementById("openEnvelope");
  envelope.addEventListener("click", () => {
    if (envelope.classList.contains("open")) return;
    envelope.classList.add("open");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => { location.hash = "page-1"; }, reduce ? 50 : 2800);
  });

  /* ---------- Scroll reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  function observeFades() {
    document.querySelectorAll(".page.active .fade:not(.in)").forEach((el) => io.observe(el));
  }

  /* ---------- Calendar ---------- */
  const grid = document.getElementById("calGrid");
  ["S", "M", "T", "W", "T", "F", "S"].forEach((d) => {
    const el = document.createElement("span");
    el.className = "dow"; el.textContent = d; grid.appendChild(el);
  });
  const firstDow = new Date(2026, 11, 1).getDay();
  for (let i = 0; i < firstDow; i++) grid.appendChild(document.createElement("span"));
  for (let day = 1; day <= 31; day++) {
    const el = document.createElement("span");
    el.className = "d" + (day === 16 || day === 17 ? " hl" : "");
    el.textContent = day;
    if (day === 16 || day === 17) el.setAttribute("aria-label", `${day} December — wedding celebrations`);
    grid.appendChild(el);
  }

  /* ---------- Countdown ---------- */
  const units = Object.fromEntries(
    [...document.querySelectorAll("#countdown [data-unit]")].map((el) => [el.dataset.unit, el])
  );
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let diff = Math.max(0, WEDDING - Date.now());
    const s = Math.floor(diff / 1000);
    units.days.textContent = pad(Math.floor(s / 86400));
    units.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    units.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    units.seconds.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- RSVP form ---------- */
  const form = document.getElementById("rsvpForm");
  const attendingOnly = document.getElementById("attendingOnly");
  const guests = document.getElementById("f-guests");
  const phone = document.getElementById("f-phone");
  const phoneError = form.querySelector('[data-for="phone"]');
  const submit = document.getElementById("rsvpSubmit");
  const formError = document.getElementById("formError");
  const thanks = document.getElementById("rsvpThanks");

  const thanksMsg = document.getElementById("thanksMsg");

  // Keep the date calendar collapsed until requested, then show the selected date.
  const arrivalPicker = document.getElementById("arrivalPicker");
  const arrivalSummary = document.getElementById("arrivalSummary");
  arrivalPicker.addEventListener("change", (e) => {
    if (e.target.name !== "arrival") return;
    arrivalSummary.textContent = `${Number(e.target.value.slice(-2))} December 2026`;
    arrivalPicker.open = false;
    arrivalSummary.focus();
  });
  arrivalPicker.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      arrivalPicker.open = false;
      arrivalSummary.focus();
    }
  });

  // Show only the dates in the RSVP choices, and submit those dates as their values.
  const dateLabels = ["16-Dec-2026", "17-Dec-2026"];
  form.querySelectorAll('input[name="days"]').forEach((input, index) => {
    if (dateLabels[index]) {
      input.value = dateLabels[index];
      const label = input.nextElementSibling;
      if (label) label.textContent = dateLabels[index];
    }
  });

  // Accept exactly ten digits; do not include a country code.
  phone.removeAttribute("placeholder");
  phone.maxLength = 10;
  phone.pattern = "[0-9]{10}";
  phone.inputMode = "numeric";
  phone.autocomplete = "tel-national";
  phoneError.textContent = "Enter a valid 10-digit mobile number.";
  phone.addEventListener("input", () => {
    phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
  });

  form.querySelectorAll("[data-step]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const v = Math.min(12, Math.max(1, (parseInt(guests.value, 10) || 1) + Number(btn.dataset.step)));
      guests.value = v;
    })
  );

  form.addEventListener("change", (e) => {
    if (e.target.name === "attendance") {
      attendingOnly.classList.toggle("hidden", e.target.value === "Regretfully declines");
    }
    e.target.closest(".field")?.classList.remove("invalid");
  });
  form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));

  function validate() {
    let ok = true;
    const mark = (name, bad) => {
      const field = form.querySelector(`[data-for="${name}"]`).closest(".field");
      field.classList.toggle("invalid", bad);
      if (bad) ok = false;
    };
    mark("name", !form.elements.name.value.trim());
    mark("phone", !/^\d{10}$/.test(phone.value));
    mark("attendance", !form.querySelector('[name="attendance"]:checked'));
    const arrival = form.elements.arrival.value;
    const declining = form.elements.attendance.value === "Regretfully declines";
    mark("arrival", !declining && arrival !== "" && !/^2026-12-(14|15|16|17)$/.test(arrival));
    if (!ok) form.querySelector(".field.invalid input, .field.invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return ok;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    formError.hidden = true;
    if (!validate()) return;

    const data = new FormData(form);
    const name = data.get("name").trim();
    const declined = data.get("attendance") === "Regretfully declines";
    // Netlify stores multi-select dates as one readable field.
    data.set("days", declined ? "" : data.getAll("days").join(", "));
    if (declined) {
      data.set("guests", "0");
      data.set("arrival", "");
    }
    submit.disabled = true;
    submit.classList.add("loading");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      });
      if (!response.ok) throw new Error("RSVP submission failed");

      thanksMsg.textContent = declined
        ? `We'll miss you, ${name} — thank you for letting us know. You'll be in our hearts on the day.`
        : `Your reply is with us, ${name}. We can't wait to celebrate with you!`;
      form.hidden = true;
      thanks.hidden = false;
      thanks.focus({ preventScroll: true });
      thanks.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "center"
      });
    } catch {
      formError.hidden = false;
    } finally {
      submit.disabled = false;
      submit.classList.remove("loading");
    }
  });

  route();
})();
