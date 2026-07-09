const DATA_PATH = "assets/data/workshop.json";

const byId = (id) => document.getElementById(id);

function setText(id, text) {
  const node = byId(id);
  if (node && text) {
    node.textContent = text;
  }
}

function setLink(id, url) {
  const node = byId(id);
  if (node && url) {
    node.href = url;
  }
}

function makeCard(title, body = "", extra = "") {
  const card = document.createElement("article");
  card.className = "card";

  const heading = document.createElement("h3");
  heading.textContent = title;
  card.appendChild(heading);

  if (body) {
    const paragraph = document.createElement("p");
    paragraph.textContent = body;
    card.appendChild(paragraph);
  }

  if (extra) {
    const more = document.createElement("p");
    more.textContent = extra;
    card.appendChild(more);
  }

  return card;
}

function makePhotoCard(item) {
  const card = document.createElement("article");
  card.className = "photo-card";

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.alt || item.title || "Workshop photo";
  image.loading = "lazy";
  image.decoding = "async";
  card.appendChild(image);

  const body = document.createElement("div");
  body.className = "photo-body";

  const title = document.createElement("h3");
  title.textContent = item.title || "Photo";
  body.appendChild(title);

  if (item.description) {
    const description = document.createElement("p");
    description.textContent = item.description;
    body.appendChild(description);
  }

  if (item.creditLabel && item.creditUrl) {
    const credit = document.createElement("p");
    credit.className = "photo-credit";

    const anchor = document.createElement("a");
    anchor.href = item.creditUrl;
    anchor.textContent = item.creditLabel;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    credit.appendChild(anchor);
    body.appendChild(credit);
  }

  card.appendChild(body);
  return card;
}

function renderCards(containerId, items, renderer) {
  const container = byId(containerId);
  if (!container || !Array.isArray(items)) {
    return;
  }

  container.innerHTML = "";
  items.forEach((item) => {
    container.appendChild(renderer(item));
  });
}

function renderSimpleList(containerId, items) {
  const list = byId(containerId);
  if (!list || !Array.isArray(items)) {
    return;
  }

  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
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
    { threshold: 0.14 }
  );

  sections.forEach((section, index) => {
    section.style.transitionDelay = `${index * 26}ms`;
    observer.observe(section);
  });
}

async function loadData() {
  const response = await fetch(DATA_PATH);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_PATH}`);
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

  setLink("submit-link", data.submitUrl);
  setLink("mailing-link", data.mailingListUrl);

  setText("overview-text", data.overview);
  setText("cfp-intro", data.cfpIntro);
  setText("venue-text", data.venueText);

  renderCards("focus-list", data.focusAreas, (item) => makeCard(item.title, item.description));
  renderCards("photo-list", data.photos, (item) => makePhotoCard(item));

  renderSimpleList("topics-list", data.topics);

  renderCards("submission-list", data.submissionTypes, (item) =>
    makeCard(item.type, item.requirement, item.note || "")
  );

  renderSimpleList("criteria-list", data.reviewCriteria);

  renderCards("dates-list", data.keyDates, (item) => makeCard(item.label, item.date, item.note));

  renderCards("schedule-list", data.schedule, (slot) =>
    makeCard(`${slot.time} - ${slot.title}`, slot.description, slot.speaker || "")
  );

  renderCards("organizer-list", data.organizers, (person) =>
    makeCard(person.name, person.affiliation, person.role)
  );

  const emailNode = byId("contact-email");
  if (emailNode && data.contactEmail) {
    emailNode.href = `mailto:${data.contactEmail}`;
    emailNode.textContent = data.contactEmail;
  }

  setText("copyright-year", String(new Date().getFullYear()));
}

async function main() {
  initRevealAnimation();

  try {
    const data = await loadData();
    renderData(data);
  } catch (error) {
    console.error(error);
  }
}

main();
