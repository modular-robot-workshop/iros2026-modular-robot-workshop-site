const DATA_PATH = "assets/data/workshop.json";

const byId = (id) => document.getElementById(id);

function setText(id, text) {
  const el = byId(id);
  if (el && text) {
    el.textContent = text;
  }
}

function setLink(id, href) {
  const el = byId(id);
  if (el && href) {
    el.href = href;
  }
}

function renderCards(containerId, items, factory) {
  const container = byId(containerId);
  if (!container || !Array.isArray(items)) {
    return;
  }

  container.innerHTML = "";
  items.forEach((item) => {
    const node = factory(item);
    container.appendChild(node);
  });
}

function makeCard(title, body, extra = "") {
  const div = document.createElement("article");
  div.className = "card";

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const p = document.createElement("p");
  p.textContent = body;

  div.appendChild(h3);
  div.appendChild(p);

  if (extra) {
    const extraP = document.createElement("p");
    extraP.textContent = extra;
    div.appendChild(extraP);
  }

  return div;
}

function renderCountdown(workshopDateIso, tentativeLabel = "") {
  const countdownEl = byId("countdown");
  if (!countdownEl || !workshopDateIso) {
    return;
  }

  const eventDate = new Date(workshopDateIso).getTime();
  if (Number.isNaN(eventDate)) {
    countdownEl.textContent = tentativeLabel || "Update workshop date in assets/data/workshop.json";
    return;
  }

  const update = () => {
    const now = Date.now();
    const diff = eventDate - now;

    if (diff <= 0) {
      countdownEl.textContent = "Workshop day has arrived.";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    countdownEl.textContent = `Tentative countdown: ${days} days, ${hours} hours remaining.`;
  };

  update();
  window.setInterval(update, 1000 * 60);
}

function initRevealAnimation() {
  const sections = Array.from(document.querySelectorAll(".reveal"));
  if (!sections.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section, index) => {
    section.style.transitionDelay = `${index * 30}ms`;
    observer.observe(section);
  });
}

async function loadWorkshopData() {
  const response = await fetch(DATA_PATH);
  if (!response.ok) {
    throw new Error(`Unable to load ${DATA_PATH}`);
  }
  return response.json();
}

function renderData(data) {
  setText("hero-kicker", data.heroKicker);
  setText("title", data.title);
  setText("subtitle", data.subtitle);
  setText("event-date", data.eventDateDisplay);
  setText("event-location", data.location);
  setText("event-format", data.format);

  setText("overview-text", data.overview);
  setText("cfp-intro", data.cfpIntro);
  setText("venue-text", data.venueText);

  setLink("submit-link", data.submitUrl);
  setLink("mailing-link", data.mailingListUrl);

  const emailAnchor = byId("contact-email");
  if (emailAnchor && data.contactEmail) {
    emailAnchor.href = `mailto:${data.contactEmail}`;
    emailAnchor.textContent = data.contactEmail;
  }

  renderCards("dates-list", data.keyDates, (item) => makeCard(item.label, item.date, item.note));

  const topics = byId("topics-list");
  if (topics && Array.isArray(data.topics)) {
    topics.innerHTML = "";
    data.topics.forEach((topic) => {
      const li = document.createElement("li");
      li.textContent = topic;
      topics.appendChild(li);
    });
  }

  renderCards("schedule-list", data.schedule, (slot) =>
    makeCard(`${slot.time} - ${slot.title}`, slot.description, slot.speaker || "")
  );

  renderCards("organizer-list", data.organizers, (person) =>
    makeCard(person.name, person.affiliation, person.role)
  );

  const faqList = byId("faq-list");
  if (faqList && Array.isArray(data.faq)) {
    faqList.innerHTML = "";
    data.faq.forEach((item) => {
      const block = document.createElement("article");
      block.className = "faq-item";

      const h3 = document.createElement("h3");
      h3.textContent = item.q;

      const p = document.createElement("p");
      p.textContent = item.a;

      block.appendChild(h3);
      block.appendChild(p);
      faqList.appendChild(block);
    });
  }

  renderCountdown(data.workshopDateIso, data.countdownFallback);

  setText("copyright-year", String(new Date().getFullYear()));
}

async function main() {
  initRevealAnimation();

  try {
    const data = await loadWorkshopData();
    renderData(data);
  } catch (error) {
    const message = "Could not load workshop data. Check assets/data/workshop.json.";
    setText("countdown", message);
    console.error(error);
  }
}

main();
