const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CLD = 'https://res.cloudinary.com/dnxauc2ly';

function img(id, w = 800, h = 600) {
  return `${CLD}/image/upload/w_${w},h_${h},c_fill,q_auto,f_auto/ayrus-creatives/${id}.png`;
}

function vid(id) {
  return `${CLD}/video/upload/ayrus-creatives/${id}.mp4`;
}

function vidThumb(id, w = 800, h = 600) {
  return `${CLD}/video/upload/so_0,w_${w},h_${h},c_fill,q_auto,f_jpg/ayrus-creatives/${id}.jpg`;
}

const media = {
  featured: {
    type: 'video',
    videoUrl: `${CLD}/video/upload/ayrus-creatives/ejssft7kph7n6oa5xrbd.mp4`,
    thumb: vidThumb('ejssft7kph7n6oa5xrbd', 900, 600),
    brand: 'Rang Studio',
    brief: 'Hypermotion video of Rang Foundation',
    category: 'Hyper Motion',
  },
  featuredSide: [
    { type: 'video', videoUrl: vid('arffxnz7hrzato7djm5z'), thumb: vidThumb('arffxnz7hrzato7djm5z', 500, 300), brand: 'Jalsa', brief: 'Ashwagandha Drink', category: 'Hyper Motion' },
    { type: 'image', url: img('axubilv5jimbbfpbvw1r', 500, 300), brand: 'SunKind', brief: 'Sunscreen Cinematic Still', category: 'Cinematic Stills' },
    { type: 'image', url: img('lytyojouq7cjrchomwb5', 500, 300), brand: 'Jalsa', brief: 'Feel good, for real', category: 'Brand Identity' },
    { type: 'image', url: img('bd6fqdddkootmyqodvwx', 500, 300), brand: 'Rang Studio', brief: 'Product Billboard', category: 'Billboard' },
  ],
  categories: [
    {
      name: 'UGC',
      items: [
        { type: 'video', videoUrl: vid('k4zcvs8o1wkkzmd6lede'), thumb: vidThumb('k4zcvs8o1wkkzmd6lede'), brand: "It's Skin", brief: 'Collagen Peptide Review' },
        { type: 'video', videoUrl: vid('ziuqbymc44nx1uahvqj1'), thumb: vidThumb('ziuqbymc44nx1uahvqj1'), brand: 'Kaash', brief: 'AI UGC' },
      ],
    },
    {
      name: 'Brand Identity',
      items: [
        { type: 'image', url: img('nrgr70saxewye8pbjxqo'), brand: 'Rang Studio', brief: 'Every shade is the main character' },
        { type: 'image', url: img('lytyojouq7cjrchomwb5'), brand: 'Jalsa', brief: 'Feel good, for real' },
        { type: 'image', url: img('laccsj4lrfzxtl5djh6l'), brand: 'Kaash', brief: 'Wear it your way' },
      ],
    },
    {
      name: 'Hyper Motion',
      items: [
        { type: 'video', videoUrl: vid('ejssft7kph7n6oa5xrbd'), thumb: vidThumb('ejssft7kph7n6oa5xrbd'), brand: 'Rang Studio', brief: 'Rang Foundation' },
        { type: 'video', videoUrl: vid('arffxnz7hrzato7djm5z'), thumb: vidThumb('arffxnz7hrzato7djm5z'), brand: 'Jalsa', brief: 'Ashwagandha Drink' },
        { type: 'video', videoUrl: vid('jrccvcio6wfdptpu10jt'), thumb: vidThumb('jrccvcio6wfdptpu10jt'), brand: 'Kaash', brief: 'Hero Product Shoot 2' },
        { type: 'video', videoUrl: vid('zyxh4boev6kvi24iugld'), thumb: vidThumb('zyxh4boev6kvi24iugld'), brand: 'Kaash', brief: 'Hero Product Shoot 1' },
        { type: 'video', videoUrl: `${CLD}/video/upload/ayrus-creatives/tlo3aavpmj2okiacdiua.mp4`, thumb: vidThumb('tlo3aavpmj2okiacdiua'), brand: 'SunKind', brief: 'Sunscreen Hyper Motion' },
        { type: 'video', videoUrl: vid('eyo6ycfz38ut44ct0uvh'), thumb: vidThumb('eyo6ycfz38ut44ct0uvh'), brand: 'Ayrus', brief: 'SaaS Brand Intro' },
      ],
    },
    {
      name: 'Cinematic Stills',
      items: [
        { type: 'image', url: img('rb41pctu7g02vdfgla5s'), brand: 'Tuyo', brief: 'Poppy Curtains Still 2' },
        { type: 'image', url: img('owkqouhowcig09pslhxy'), brand: 'Tuyo', brief: 'Poppy Curtains Still 1' },
        { type: 'image', url: img('ifvbjsd30tiktjc69kw1'), brand: 'SunKind', brief: 'Face Wash Still' },
        { type: 'image', url: img('eah0fk0pjw3qi1ahqw9i'), brand: 'SunKind', brief: 'Moisturizer Still' },
        { type: 'image', url: img('axubilv5jimbbfpbvw1r'), brand: 'SunKind', brief: 'Sunscreen Still' },
        { type: 'image', url: img('wbymrbq662ntlwauc8en'), brand: 'Jalsa', brief: 'Cinematic Shoot 3' },
        { type: 'image', url: img('pd77kyfh5luv3ssvadf2'), brand: 'Jalsa', brief: 'Cinematic Shoot 2' },
        { type: 'image', url: img('zt8kypzmb4m3tco48tun'), brand: 'Kaash', brief: 'Cinematic Shoot 3' },
        { type: 'image', url: img('ggutstlupxuzajmaamjr'), brand: 'Kaash', brief: 'Cinematic Shoot 2' },
        { type: 'image', url: img('ljenmrhstuvvnfhfswqx'), brand: 'Kaash', brief: 'Cinematic Shoot 1' },
      ],
    },
    {
      name: 'Billboard',
      items: [
        { type: 'image', url: img('ns92t4ax4wqeu3yozqjb'), brand: 'Jalsa', brief: 'Emotion Led Billboard' },
        { type: 'image', url: img('is9dgzbkdorfhzn4olay'), brand: 'Jalsa', brief: 'Product Billboard' },
        { type: 'image', url: img('enfiq1l0ikgxprgmkmgz'), brand: 'Kaash', brief: 'Product Billboard' },
        { type: 'image', url: img('t2jevqttnpiyhcnz0eey'), brand: 'Kaash', brief: 'Hero Billboard' },
        { type: 'image', url: img('g8jhu6q0fscnk7o3qjf0'), brand: 'Rang Studio', brief: 'Texture Billboard' },
        { type: 'image', url: img('bd6fqdddkootmyqodvwx'), brand: 'Rang Studio', brief: 'Product Billboard' },
        { type: 'image', url: img('kefi8vencpw0rj3gw7op'), brand: 'Rang Studio', brief: 'Hero Billboard' },
      ],
    },
    {
      name: 'ASMR',
      items: [
        { type: 'video', videoUrl: `${CLD}/video/upload/ayrus-creatives/yxzmyckjy1lozcnv0qgs.mp4`, thumb: vidThumb('yxzmyckjy1lozcnv0qgs'), brand: 'Jalsa', brief: 'Tulsi Mint ASMR' },
        { type: 'video', videoUrl: `${CLD}/video/upload/ayrus-creatives/pidslennh07ca47ujihr.mp4`, thumb: vidThumb('pidslennh07ca47ujihr'), brand: 'Rang Studio', brief: 'Lipstick ASMR' },
      ],
    },
    {
      name: 'Unboxing',
      items: [
        { type: 'video', videoUrl: `${CLD}/video/upload/ayrus-creatives/rgfqq8mucx7sz8a110lq.mp4`, thumb: vidThumb('rgfqq8mucx7sz8a110lq'), brand: 'Kaash', brief: 'Unboxing Video' },
      ],
    },
  ],
};

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
  media,
  social: {
    github: '',
    linkedin: 'https://www.linkedin.com/in/suryakiran-mali-771a43422/',
    twitter: '',
  },
};

app.get('/', (req, res) => {
  res.render('index', { data });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('\n📬 New contact form submission:');
  console.log(`  Name: ${name}`);
  console.log(`  Email: ${email}`);
  console.log(`  Message: ${message}`);
  res.json({ success: true, message: 'Thanks! Your message has been received.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Suryakiran Portfolio running at http://localhost:${PORT}`);
});
