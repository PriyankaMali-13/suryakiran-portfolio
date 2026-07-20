# Suryakiran Mali — Portfolio

Personal portfolio site built with Node.js + Express + EJS + Bootstrap 5.

## Project Structure

```
suryakiran-portfolio/
├── app.js              ← Express server + all personal data
├── package.json
├── render.yaml         ← Render deployment config
├── views/
│   └── index.ejs       ← Single-page HTML template
├── public/
│   ├── css/style.css   ← All custom styles (dark theme)
│   ├── js/main.js      ← Navbar scroll, typewriter, contact form, reveal animations
│   └── resume.pdf      ← Replace with actual resume
└── CLAUDE.md
```

## How to Run Locally

```bash
npm install
npm start          # http://localhost:3000
npm run dev        # with nodemon auto-restart
```

## How to Update Personal Data

All personal data lives in the `data` object in `app.js` (top of file). Edit it directly:

- **Name / Role / Tagline** — `data.name`, `data.role`, `data.tagline`
- **Stack badges** — `data.stack` array
- **Hero stats** — `data.stats` array (value + label pairs)
- **About paragraphs** — `data.about` string (double newlines = paragraph breaks)
- **Email / Location** — `data.email`, `data.location`
- **Social links** — `data.social` object

## How to Add a New Project Card

In `app.js`, add an object to the `data.projects` array:

```js
{
  name: 'My New Project',
  description: 'Short description of what it does.',
  tech: ['Tool 1', 'Tool 2'],
  live: 'https://myproject.com',  // leave '' if none
  github: 'https://github.com/...',  // leave '' if none
}
```

The card renders automatically — no template changes needed.

## How to Update Experience / Education

Edit `data.experience` and `data.education` arrays in `app.js`. Each experience entry has:
- `title`, `company`, `type`, `period`, `location`
- `points` — array of bullet strings
- `skills` — array of skill badge strings

## How to Change Colors / Theme

All CSS variables are at the top of `public/css/style.css`:

```css
:root {
  --bg-primary: #0a0a0a;      /* page background */
  --bg-secondary: #111111;    /* alternate section bg */
  --accent: #00d4ff;          /* primary accent color */
  --accent-dim: rgba(0, 212, 255, 0.12);
  /* ... */
}
```

Change `--accent` to any hex color to re-theme the entire site instantly.

## How to Add a Resume

Replace `public/resume.pdf` with the actual PDF. The download button in the navbar links to `/resume.pdf`.

## Deploying to Render

1. Push to GitHub: `git push origin main`
2. On [render.com](https://render.com), create a **New Web Service**
3. Connect your GitHub repo `PriyankaMali-13/suryakiran-portfolio`
4. Render auto-detects `render.yaml` — build: `npm install`, start: `node app.js`
5. Deploy and get your live URL

## Contact Form

Currently logs submissions to the server console. To wire up email, add a service like **Nodemailer + Gmail** or **Resend** to the `/contact` POST route in `app.js`.
