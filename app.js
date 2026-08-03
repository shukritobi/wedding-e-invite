(() => {
  "use strict";

  const config = window.WEDDING_CONFIG;
  const $ = (selector) => document.querySelector(selector);
  const setText = (selector, value) => {
    const element = $(selector);
    if (element && value !== undefined && value !== null) element.textContent = value;
  };

  const safeUrl = (value) => {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };

  const showToast = (message) => {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  };

  const fillContent = () => {
    const { couple, event, gifts } = config;
    const names = `${couple.bride} & ${couple.groom}`;

    ["#opening-bride", "#hero-bride"].forEach((id) => setText(id, couple.bride));
    ["#opening-groom", "#hero-groom"].forEach((id) => setText(id, couple.groom));
    ["#monogram", "#footer-monogram"].forEach((id) => setText(id, couple.monogram));
    ["#opening-date", "#hero-date"].forEach((id) => setText(id, event.displayDate));
    setText("#footer-names", names);
    setText("#bride-parents", couple.brideParents);
    setText("#groom-parents", couple.groomParents);
    setText("#event-time", event.displayTime);
    setText("#venue-name", event.venueName);
    setText("#venue-address", event.address);
    setText("#venue-note", event.venueNote);
    setText("#gift-note", gifts.note);
    setText("#gift-account-name", gifts.accountName);
    setText("#gift-account-note", gifts.accountNote);

    document.title = `${config.sharing.title} | ${event.displayDate}`;
    const qr = $("#gift-qr");
    if (qr && gifts.qrImage) qr.src = gifts.qrImage;

    const date = new Date(event.start);
    const weekday = new Intl.DateTimeFormat("ms-MY", { weekday: "long" }).format(date).toUpperCase();
    const month = new Intl.DateTimeFormat("ms-MY", { month: "long" }).format(date).toUpperCase();
    setText("#event-weekday", weekday);
    setText("#event-month", month);
    setText("#event-day", String(date.getDate()).padStart(2, "0"));
    setText("#event-year", date.getFullYear());

    const demoBadge = $("#demo-badge");
    if (demoBadge && !config.demoMode) demoBadge.remove();

    const recipient = new URLSearchParams(window.location.search).get("to");
    if (recipient) {
      const cleanName = recipient.trim().slice(0, 80);
      setText("#opening-to", `Jemputan khas buat ${cleanName}`);
      const greeting = $("#personal-greeting");
      if (greeting) {
        greeting.textContent = `Dengan hormatnya menjemput ${cleanName} sekeluarga`;
        greeting.hidden = false;
      }
    }
  };

  const renderTimeline = () => {
    const timeline = $("#timeline");
    if (!timeline) return;
    timeline.replaceChildren();
    config.event.itinerary.forEach((item) => {
      const wrapper = document.createElement("article");
      wrapper.className = "timeline__item";

      const time = document.createElement("time");
      time.className = "timeline__time";
      time.textContent = item.time;

      const content = document.createElement("div");
      content.className = "timeline__content";
      const title = document.createElement("h3");
      title.textContent = item.title;
      const description = document.createElement("p");
      description.textContent = item.description || "";
      content.append(title, description);
      wrapper.append(time, content);
      timeline.append(wrapper);
    });
  };

  const configureLinks = () => {
    const links = [
      ["#google-maps", config.event.googleMapsUrl],
      ["#waze", config.event.wazeUrl]
    ];

    links.forEach(([selector, rawUrl]) => {
      const element = $(selector);
      const url = safeUrl(rawUrl);
      if (!element) return;
      if (url) element.href = url;
      else {
        element.classList.add("is-disabled");
        element.setAttribute("aria-disabled", "true");
        element.removeAttribute("href");
      }
    });

    const container = $("#payment-links");
    if (!container) return;
    container.replaceChildren();
    config.gifts.paymentLinks.forEach((item) => {
      const link = document.createElement("a");
      link.className = "payment-link";
      const url = safeUrl(item.url);
      if (url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener";
      } else {
        link.classList.add("is-disabled");
        link.setAttribute("aria-disabled", "true");
        link.title = "Masukkan pautan pembayaran sebenar dalam config.js";
      }
      const label = document.createElement("strong");
      label.textContent = item.label;
      const provider = document.createElement("span");
      provider.textContent = item.provider;
      link.append(label, provider);
      container.append(link);
    });
  };

  const startCountdown = () => {
    const target = new Date(config.event.start).getTime();
    const update = () => {
      const difference = Math.max(0, target - Date.now());
      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference / 3600000) % 24);
      const minutes = Math.floor((difference / 60000) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setText("#days", String(days).padStart(2, "0"));
      setText("#hours", String(hours).padStart(2, "0"));
      setText("#minutes", String(minutes).padStart(2, "0"));
      setText("#seconds", String(seconds).padStart(2, "0"));
    };
    update();
    window.setInterval(update, 1000);
  };

  const formatIcsDate = (dateString) => new Date(dateString)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

  const downloadCalendar = () => {
    const event = config.event;
    const location = `${event.venueName}, ${event.address}`;
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding E-Invite//MS",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@wedding-e-invite`,
      `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
      `DTSTART:${formatIcsDate(event.start)}`,
      `DTEND:${formatIcsDate(event.end)}`,
      `SUMMARY:${event.title} — ${config.couple.bride} & ${config.couple.groom}`,
      `DESCRIPTION:${config.sharing.text.replace(/\n/g, "\\n")}`,
      `LOCATION:${location.replace(/,/g, "\\,")}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "jemputan-perkahwinan.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const shareInvite = async () => {
    const payload = {
      title: config.sharing.title,
      text: config.sharing.text,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${payload.text}\n\n${payload.url}`)}`;
    window.open(whatsapp, "_blank", "noopener");
  };

  const submitRsvp = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      `RSVP — ${config.event.title}`,
      `Nama: ${form.get("name")}`,
      `Kehadiran: ${form.get("attendance")}`,
      `Jumlah tetamu: ${form.get("guests") || 1}`,
      form.get("message") ? `Ucapan: ${form.get("message")}` : ""
    ].filter(Boolean).join("\n");
    const number = String(config.rsvp.whatsappNumber || "").replace(/\D/g, "");
    const url = number
      ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
    showToast(number ? "Membuka WhatsApp untuk menghantar RSVP" : "Pilih penerima RSVP dalam WhatsApp");
  };

  const setupInteractions = () => {
    document.body.classList.add("invite-closed");
    $("#open-invite")?.addEventListener("click", () => {
      $("#opening")?.classList.add("is-hidden");
      document.body.classList.remove("invite-closed");
      window.setTimeout(() => $("#opening")?.remove(), 800);
    });

    ["#share-top", "#share-bottom", "#share-dock"].forEach((id) => $(id)?.addEventListener("click", shareInvite));
    $("#add-calendar")?.addEventListener("click", downloadCalendar);
    $("#rsvp-form")?.addEventListener("submit", submitRsvp);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  };

  fillContent();
  renderTimeline();
  configureLinks();
  startCountdown();
  setupInteractions();
})();
