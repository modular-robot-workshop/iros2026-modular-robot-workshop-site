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

function makePersonCard(person, { withPhoto = false } = {}) {
  const card = document.createElement("article");
  card.className = "card person-card";

  if (withPhoto && person.photo) {
    const img = document.createElement("img");
    img.className = "person-photo";
    img.src = person.photo;
    img.alt = person.name;
    img.loading = "lazy";
    card.appendChild(img);
  }

  const heading = document.createElement("h3");
  heading.textContent = person.name;
  card.appendChild(heading);

  if (person.title) {
    const title = document.createElement("p");
    title.className = "person-title";
    title.textContent = person.title;
    card.appendChild(title);
  }

  if (person.affiliation) {
    const affiliation = document.createElement("p");
    affiliation.className = "person-affiliation";
    affiliation.textContent = person.affiliation;
    card.appendChild(affiliation);
  }

  if (person.bio) {
    const bio = document.createElement("p");
    bio.className = "person-bio";
    bio.textContent = person.bio;
    card.appendChild(bio);
  }

  if (person.email || person.url) {
    const links = document.createElement("p");
    links.className = "person-links";

    if (person.email) {
      const emailLink = document.createElement("a");
      emailLink.href = `mailto:${person.email}`;
      emailLink.textContent = person.email;
      links.appendChild(emailLink);
    }

    if (person.email && person.url) {
      links.appendChild(document.createTextNode(" · "));
    }

    if (person.url) {
      const profileLink = document.createElement("a");
      profileLink.href = person.url;
      profileLink.target = "_blank";
      profileLink.rel = "noopener";
      profileLink.textContent = "Profile";
      links.appendChild(profileLink);
    }

    card.appendChild(links);
  }

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

  renderSimpleList("topics-list", data.topics);

  renderCards("submission-list", data.submissionTypes, (item) =>
    makeCard(item.type, item.requirement, item.note || "")
  );

  renderSimpleList("criteria-list", data.reviewCriteria);

  renderCards("dates-list", data.keyDates, (item) => makeCard(item.label, item.date, item.note));

  renderCards("schedule-list", data.schedule, (slot) =>
    makeCard(`${slot.time} - ${slot.title}`, slot.description, slot.speaker || "")
  );

  renderCards("speaker-list", data.speakers, (person) =>
    makePersonCard(person, { withPhoto: true })
  );

  const organizerGroupsEl = byId("organizer-groups");
  if (organizerGroupsEl && Array.isArray(data.organizerGroups)) {
    organizerGroupsEl.innerHTML = "";
    data.organizerGroups.forEach((group) => {
      const wrap = document.createElement("div");
      wrap.className = "organizer-group";

      const label = document.createElement("p");
      label.className = "organizer-group-label";
      label.textContent = group.region;
      wrap.appendChild(label);

      const row = document.createElement("div");
      row.className = "cards-grid organizer-grid";
      group.members.forEach((person) => {
        row.appendChild(makePersonCard(person, { withPhoto: true }));
      });
      wrap.appendChild(row);

      organizerGroupsEl.appendChild(wrap);
    });
  }

  const contactList = byId("contact-list");
  if (contactList && Array.isArray(data.contacts)) {
    contactList.innerHTML = "";
    data.contacts.forEach((contact) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `mailto:${contact.email}`;
      link.textContent = contact.email;
      li.append(`${contact.name} — `, link);
      contactList.appendChild(li);
    });
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
