require('dotenv').config();
const express = require('express');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Fetch all media live from Cloudinary ──────────────────────────────────────
async function fetchMedia() {
  try {
    const [images, videos] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: 'ayrus-creatives/', context: true, max_results: 200 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'ayrus-creatives/', context: true, max_results: 200, resource_type: 'video' }),
    ]);

    const CLD = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;

    const toItem = (r) => {
      const isVideo = r.resource_type === 'video';
      const id = r.public_id.split('/').pop();
      return {
        public_id: r.public_id,
        brand: r.context?.custom?.brand || '',
        type: r.context?.custom?.type || 'Other',
        brief: r.context?.custom?.brief || '',
        position: r.context?.custom?.position || '',
        isVideo,
        url: isVideo
          ? `${CLD}/video/upload/${r.public_id}.mp4`
          : `${CLD}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/${r.public_id}.png`,
        fullUrl: isVideo
          ? `${CLD}/video/upload/q_auto/${r.public_id}.mp4`
          : `${CLD}/image/upload/q_auto,f_auto/${r.public_id}`,
        thumb: isVideo
          ? `${CLD}/video/upload/so_0,w_800,h_600,c_fill,q_auto,f_jpg/${r.public_id}.jpg`
          : `${CLD}/image/upload/w_800,h_600,c_fill,q_auto,f_auto/${r.public_id}.png`,
        thumbSm: isVideo
          ? `${CLD}/video/upload/so_0,w_400,h_300,c_fill,q_auto,f_jpg/${r.public_id}.jpg`
          : `${CLD}/image/upload/w_400,h_300,c_fill,q_auto,f_auto/${r.public_id}.png`,
        created_at: r.created_at,
      };
    };

    const all = [...images.resources.map(toItem), ...videos.resources.map(toItem)]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Build pinned map from position context
    const pinned = {};
    all.forEach(i => { if (i.position) pinned[i.position] = i; });

    // Featured slot
    const featured = pinned['featured'] || all.find(i => i.isVideo) || all[0];

    // Side slots — use pinned side-1…side-4, fill gaps from remaining items
    const usedIds = new Set([featured?.public_id].filter(Boolean));
    ['side-1','side-2','side-3','side-4'].forEach(p => { if (pinned[p]) usedIds.add(pinned[p].public_id); });
    const remaining = all.filter(i => !usedIds.has(i.public_id));
    let ri = 0;
    const featuredSide = ['side-1','side-2','side-3','side-4'].map(p => pinned[p] || remaining[ri++] || null).filter(Boolean);

    // Group into categories by type
    const categoryMap = {};
    all.forEach(item => {
      const cat = item.type;
      if (!cat || cat === 'Other') return; // skip items with no type
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push(item);
    });

    // Preferred category order
    const order = ['Hyper Motion', 'UGC', 'Brand Identity', 'Cinematic Stills', 'Billboard', 'ASMR', 'Unboxing'];
    const categories = [
      ...order.filter(c => categoryMap[c]).map(c => ({ name: c, items: categoryMap[c] })),
      ...Object.keys(categoryMap).filter(c => !order.includes(c)).map(c => ({ name: c, items: categoryMap[c] })),
    ];

    return { featured, featuredSide, categories };
  } catch (err) {
    console.error('Cloudinary fetch error:', err.message);
    // Retry once on network errors
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      try {
        await new Promise(r => setTimeout(r, 1500));
        return await fetchMedia();
      } catch (_) {}
    }
    return { featured: null, featuredSide: [], categories: [] };
  }
}

// ── Personal data ─────────────────────────────────────────────────────────────
const data = {
  name: 'Suryakiran Mali',
  role: 'Founder & AI Creative Director',
  tagline: 'Building brands through AI-powered visual storytelling.',
  stack: ['AI Tools', 'Creative Strategy', 'Algorithmic Trading'],
  loves: 'Visual Storytelling',
  status: 'Open to Collaborations',
  location: 'Mumbai, Maharashtra, India',
  email: 'suryamali007@gmail.com',
  stats: [
    { value: '6+', label: 'Years Exp.' },
    { value: '3', label: 'Industries' },
    { value: '1', label: 'Studio Founded' },
  ],
  about: `I am the Founder of Ayrus Creatives, an AI-powered creative studio helping brands bring ideas to life through premium visual storytelling. I specialize in AI-generated product campaigns, cinematic product photography, AI UGC, hypermotion videos, campaign hero creatives, digital billboards, ASMR and unboxing content.

My career has given me experience across manufacturing, financial technology and creative production. I began in manufacturing operations, where I managed production workflows, vendor development, procurement and new product development. I later moved into algorithmic trading, developing trading strategies, onboarding clients and contributing to business growth through technology-driven investment solutions.

Today, I combine strategic thinking with creativity to help brands produce high-quality marketing assets faster and more efficiently. My focus is on building visually compelling campaigns that blend storytelling, design and AI while maintaining premium production quality.

I enjoy collaborating with founders, marketing teams and brands that value innovation, creativity, and measurable business impact.`,
  experience: [
    {
      title: 'Founder',
      company: 'Ayrus Creatives',
      type: 'Full-time',
      period: 'May 2026 – Present · 3 mos',
      location: 'Mumbai, Maharashtra, India · Remote',
      points: [
        'Founded Ayrus Creatives, an AI-powered creative studio',
        'Lead creative strategy, AI production and client delivery',
      ],
      skills: ['AI Content Creator', 'AI Filmmaker'],
    },
    {
      title: 'Associate Partner',
      company: 'Capitaengineers Algotech',
      type: 'Full-time',
      period: 'Feb 2022 – May 2026 · 4 yrs 4 mos',
      location: 'Mumbai, Maharashtra, India · On-site',
      points: [
        'Developed and optimized algorithmic trading strategies',
        'Onboarded and advised clients on systematic investment solutions',
      ],
      skills: ['Algorithmic Trading', 'Quantitative Investing'],
    },
    {
      title: 'Production Engineer',
      company: 'POWERMASTER',
      type: 'Full-time',
      period: 'Sep 2019 – Jun 2021 · 1 yr 10 mos',
      location: 'Navi Mumbai, Maharashtra, India · On-site',
      points: [
        'Supervised the complete production lifecycle, from Order Acceptance to final packaging and dispatch',
        'Coordinated daily production activities to ensure quality, efficiency and timely order fulfillment',
      ],
      skills: ['Production Operations', 'Production Engineering'],
    },
  ],
  education: [
    {
      institution: 'Pillai HOC College of Engineering and Technology',
      degree: 'Bachelor of Engineering, Mechanical Engineering',
      period: 'Jul 2016 – May 2019',
      grade: '7.8 CGPA',
    },
  ],
  awards: [],
  certifications: [],
  social: {
    github: '',
    linkedin: 'https://www.linkedin.com/in/suryakiran-mali-771a43422/',
    twitter: '',
  },
};

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', async (req, res) => {
  const media = await fetchMedia();
  res.render('index', { data: { ...data, media } });
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('\n📬 New contact form submission:', { name, email });
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'suryamali007@gmail.com',
      reply_to: email,
      subject: `New message from ${name} via Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a1a;color:#e8e8f0;border-radius:12px;">
          <h2 style="color:#00d4ff;margin-bottom:4px;">New Portfolio Message</h2>
          <p style="color:#7a7a9a;margin-top:0;font-size:14px;">Someone reached out via your portfolio contact form.</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:20px 0;" />
          <p><strong style="color:#b0a8ff;">Name:</strong> ${name}</p>
          <p><strong style="color:#b0a8ff;">Email:</strong> <a href="mailto:${email}" style="color:#00d4ff;">${email}</a></p>
          <p><strong style="color:#b0a8ff;">Message:</strong></p>
          <p style="background:rgba(255,255,255,0.04);padding:16px;border-radius:8px;border-left:3px solid #00d4ff;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</p>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:20px 0;" />
          <p style="font-size:12px;color:#7a7a9a;">Sent from suryakiran-portfolio</p>
        </div>
      `,
    });
    res.json({ success: true, message: "Thanks! I'll get back to you soon." });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// ── Admin: position manager ───────────────────────────────────────────────────
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ayrus2025';
const ADMIN_TOKEN = Buffer.from(ADMIN_PASS).toString('base64');

function isAdminAuthed(req) {
  return req.headers.cookie?.includes(`sk_admin=${ADMIN_TOKEN}`);
}

app.get('/admin', async (req, res) => {
  if (!isAdminAuthed(req)) {
    return res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>Admin Login</title>
    <style>
      body{font-family:system-ui,sans-serif;background:#0f0f0f;color:#e8e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .box{background:#1a1a2e;border:1px solid rgba(0,212,255,0.2);border-radius:16px;padding:40px 36px;width:360px}
      h2{font-size:1.2rem;color:#00d4ff;margin-bottom:24px}
      input{width:100%;padding:10px 14px;border-radius:8px;background:#111;border:1px solid rgba(255,255,255,0.12);color:#e8e8f0;font-size:0.9rem;margin-bottom:14px;box-sizing:border-box}
      input:focus{outline:none;border-color:#00d4ff}
      button{width:100%;padding:11px;border-radius:8px;background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.35);color:#00d4ff;font-size:0.9rem;font-weight:600;cursor:pointer}
      button:hover{background:rgba(0,212,255,0.28)}
      .err{color:#ff5050;font-size:0.8rem;margin-top:8px}
    </style></head>
    <body><div class="box">
      <h2>Admin — Position Manager</h2>
      <form method="POST" action="/admin/login">
        <input type="password" name="password" placeholder="Enter password" autofocus required />
        <button type="submit">Login</button>
        ${req.query.err ? '<p class="err">Incorrect password.</p>' : ''}
      </form>
    </div></body></html>`);
  }
  const media = await fetchMedia();
  const all = media.categories.flatMap(c => c.items);
  const seen = new Set();
  const items = all.filter(i => seen.has(i.public_id) ? false : seen.add(i.public_id));
  res.render('admin', { items });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.setHeader('Set-Cookie', `sk_admin=${ADMIN_TOKEN}; Path=/; HttpOnly; Max-Age=28800`);
    return res.redirect('/admin');
  }
  res.redirect('/admin?err=1');
});

app.post('/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'sk_admin=; Path=/; Max-Age=0');
  res.redirect('/admin');
});

app.post('/admin/set-position', async (req, res) => {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: 'Unauthorised' });
  const { public_id, position, isVideo, brand, type, brief } = req.body;
  const resourceType = isVideo === 'true' ? 'video' : 'image';
  try {
    // Fetch existing context to preserve work_id
    const existing = await cloudinary.api.resource(public_id, { resource_type: resourceType, context: true });
    const ctx = existing.context?.custom || {};
    const newCtx = [
      `brand=${brand ?? ctx.brand ?? ''}`,
      `type=${type ?? ctx.type ?? ''}`,
      `brief=${brief ?? ctx.brief ?? ''}`,
      `position=${position ?? ctx.position ?? ''}`,
      ctx.work_id ? `work_id=${ctx.work_id}` : '',
    ].filter(Boolean).join('|');
    await cloudinary.uploader.explicit(public_id, { type: 'upload', resource_type: resourceType, context: newCtx });
    res.json({ ok: true });
  } catch (err) {
    console.error('Position update error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Suryakiran Portfolio running at http://localhost:${PORT}`);
});
