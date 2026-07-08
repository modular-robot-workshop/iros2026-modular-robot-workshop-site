# Modular Robot Workshop Website (IROS 2026)

Static, Git-friendly workshop website scaffold.

## Project Structure

- `index.html` -> page structure
- `assets/css/styles.css` -> visual design and responsive layout
- `assets/js/main.js` -> rendering logic and countdown
- `assets/data/workshop.json` -> all editable workshop content

## Edit Content Quickly

Update `assets/data/workshop.json` for:

- title, date, location
- submission/mailing links
- topics, schedule, organizers, FAQ
- contact email

## Run Locally

```bash
cd iros2026-modular-robot-workshop-site
python3 -m http.server 8080
# open http://localhost:8080
```

## Git Workflow (Recommended)

```bash
cd iros2026-modular-robot-workshop-site
git init -b main
git add .
git commit -m "Initial IROS 2026 modular robot workshop site"

# create feature branch for updates
git checkout -b feat/update-deadlines
# edit files...
git add .
git commit -m "Update CFP deadlines and organizer list"

# merge back to main
git checkout main
git merge feat/update-deadlines
```

## GitHub Pages Deploy (Optional)

1. Create a new GitHub repository.
2. Add remote and push:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

3. In GitHub repository settings, enable **Pages** from branch `main` and folder `/ (root)`.

The site is fully static, so no build step is required.
